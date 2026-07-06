"use client";

import useUpdateUrlParams from "@/hooks/updateParam";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DayPicker, DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";


export default function DateRangePicker({
    setShowCalendar, checkInDate, checkOutDate, onSave, listingId
}: {
    setShowCalendar: React.Dispatch<React.SetStateAction<boolean>>;
    checkInDate: Date
    checkOutDate: Date
    onSave: (range: DateRange) => void
    listingId: string | undefined
}) {
    const [range, setRange] = useState<DateRange | undefined>({
        from: checkInDate,
        to: checkOutDate
    });
    const [saveButton, setSaveButton] = useState<boolean>(true);
    const [reservedDates, setReservedDates] = useState([])

    const updateParam = useUpdateUrlParams();

    useEffect(() => {
        const getReservedDates = async () => {
            try {
                const res = await fetch(`/api/orders/listing/${listingId}`)
                if (!res.ok) {
                    return;
                }

                const data = await res.json();
                setReservedDates(data);
            } catch (error) {
                console.error(error);
            }
        }

        getReservedDates();
    }, [])


    const handleSelect = (selected: DateRange | undefined) => {
        console.log(selected);
        selected?.from?.setHours(12, 0, 0, 0);
        selected?.to?.setHours(12, 0, 0, 0,);
        setRange(selected);
    };

    const handleSave = () => {
        if (!range?.from || !range?.to) {
            setSaveButton(false);
            return;
        }

        onSave(range);
        setShowCalendar(false);
        // const inDate = range.from.toISOString().split("T")[0];
        // console.log(range.from.toISOString());
        // const outDate = range.to.toISOString().split("T")[0];
        // console.log(inDate, outDate);
        // setShowCalendar(false);
        // updateParam({
        //     checkIn: inDate,
        //     checkOut: outDate
        // })
    }
    return (
        <div className="bg-white px-10 pt-15 rounded-xl shadow-xl relative">
            <div onClick={() => setShowCalendar(false)} className="absolute w-10 h-10 cursor-pointer right-4 top-4 rounded-full z-80">
                <svg width="40px" height="40px" viewBox="0 -0.5 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.96967 16.4697C6.67678 16.7626 6.67678 17.2374 6.96967 17.5303C7.26256 17.8232 7.73744 17.8232 8.03033 17.5303L6.96967 16.4697ZM13.0303 12.5303C13.3232 12.2374 13.3232 11.7626 13.0303 11.4697C12.7374 11.1768 12.2626 11.1768 11.9697 11.4697L13.0303 12.5303ZM11.9697 11.4697C11.6768 11.7626 11.6768 12.2374 11.9697 12.5303C12.2626 12.8232 12.7374 12.8232 13.0303 12.5303L11.9697 11.4697ZM18.0303 7.53033C18.3232 7.23744 18.3232 6.76256 18.0303 6.46967C17.7374 6.17678 17.2626 6.17678 16.9697 6.46967L18.0303 7.53033ZM13.0303 11.4697C12.7374 11.1768 12.2626 11.1768 11.9697 11.4697C11.6768 11.7626 11.6768 12.2374 11.9697 12.5303L13.0303 11.4697ZM16.9697 17.5303C17.2626 17.8232 17.7374 17.8232 18.0303 17.5303C18.3232 17.2374 18.3232 16.7626 18.0303 16.4697L16.9697 17.5303ZM11.9697 12.5303C12.2626 12.8232 12.7374 12.8232 13.0303 12.5303C13.3232 12.2374 13.3232 11.7626 13.0303 11.4697L11.9697 12.5303ZM8.03033 6.46967C7.73744 6.17678 7.26256 6.17678 6.96967 6.46967C6.67678 6.76256 6.67678 7.23744 6.96967 7.53033L8.03033 6.46967ZM8.03033 17.5303L13.0303 12.5303L11.9697 11.4697L6.96967 16.4697L8.03033 17.5303ZM13.0303 12.5303L18.0303 7.53033L16.9697 6.46967L11.9697 11.4697L13.0303 12.5303ZM11.9697 12.5303L16.9697 17.5303L18.0303 16.4697L13.0303 11.4697L11.9697 12.5303ZM13.0303 11.4697L8.03033 6.46967L6.96967 7.53033L11.9697 12.5303L13.0303 11.4697Z" fill="#000000" />
                </svg>
            </div>
            <DayPicker
                className="text-xl mb-6"
                required
                animate
                mode="range"
                selected={range}
                min={1}
                onSelect={handleSelect}
                numberOfMonths={2}
                disabled={[
                    {before: new Date()},
                    ...reservedDates,
                ]}
                excludeDisabled
                pagedNavigation
                resetOnSelect
            />

            <div className="flex items-center justify-between px-3 py-3 mt-10 text-xl">
                <button type="button" onClick={() => setRange(undefined)}>Clear Dates</button>

                <button type="button"
                    // disabled = {!saveButton}
                    onClick={handleSave}
                    className="border rounded-3xl disabled:bg-gray-400 bg-black text-white px-8 py-3"
                >
                    Save
                </button>
            </div>
        </div>
    );
}