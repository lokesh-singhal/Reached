"use client";

import useUpdateUrlParams from "@/hooks/updateParam";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DayPicker, DateRange, getDefaultClassNames } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { toast } from "sonner";


export default function DatePickerSmall({
    setShowCalendar, onSave
}: {
    setShowCalendar: React.Dispatch<React.SetStateAction<boolean>>;
    onSave: (range: DateRange) => void
}) {
    const [range, setRange] = useState<DateRange | undefined>();
    const defaultClassNames = getDefaultClassNames();

    const handleSelect = (selected: DateRange | undefined) => {
        selected?.from?.setHours(12, 0, 0, 0);
        selected?.to?.setHours(12, 0, 0, 0,);
        setRange(selected);
    };

    const handleSave = () => {
        if (!range?.from || !range?.to) {
            toast.error("Plese enter valid dates", {
                style: {
                    background: 'red',
                }
            })
            return;
        }

        onSave(range);
        setShowCalendar(false);
    }
    return (
        <div className="relative bg-white rounded-2xl w-full sm:p-4">
            <div className="flex items-center justify-between">
                <span className="text-3xl font-semibold">When?</span>
                <span onClick={() => setShowCalendar(false)}><img src="/cross.svg" className="h-10 w-10" alt="" /></span>
            </div>
            <DayPicker
                required
                animate
                mode="range"
                navLayout="around"
                selected={range}
                min={1}
                onSelect={handleSelect}
                numberOfMonths={1}
                disabled={[
                    { before: new Date() },
                ]}
                excludeDisabled
                pagedNavigation
                resetOnSelect
                className="text-sm"
                classNames={{
                    day: "",
                    month_grid: "w-full",
                    day_button: `rdp-day_button max-sm:w-5 max-sm:h-5`,
                    months: "flex flex-col gap-6 w-full",
                    nav: "absolute top-2 right-2 flex gap-2 max-sm:right-10 w-full",
                }}
            />

            <div className="mt-8 flex items-center justify-between border-t pt-4">
                <button type="button" onClick={() => setRange(undefined)}>Clear Dates</button>

                <button type="button"
                    onClick={handleSave}
                    className="rounded-full bg-black px-5 py-3 text-sm md:text-base text-white hover:bg-neutral-800"
                >
                    Save
                </button>
            </div>
        </div>
    );
}