"use client";

import { useEffect, useMemo, useState } from "react";
import { Calendar } from "@/app/components/ui/calendar";
import { addDays, eachDayOfInterval, isWithinInterval, startOfDay, subDays } from "date-fns";
import { useParams } from "next/navigation";
import { UserRound } from "lucide-react";

type Booking = {
    id: string;
    user: {
        name: string;
        email: string;
    }
    email: string;
    maxGuests: number;
    checkIn: string;
    checkOut: string;
    guests: number
    totalPrice: number;
    status: string;
};

// const booking: Booking[] = [
//     {
//         id: "1",
//         user: {
//             name: "Lokesh Singhal",
//             email: "lokes@gmail.com",
//         }
//         guests: 2,
//         checkIn: new Date("2026-08-10"),
//         checkOut: new Date("2026-08-14"),
//         total: 8500,
//     },
//     {
//         id: "2",
//         guest: "Alice Smith",
//         email: "alice@gmail.com",
//         guests: 4,
//         checkIn: new Date("2026-08-18"),
//         checkOut: new Date("2026-08-22"),
//         total: 12400,
//     },
// ];

export default function BookingCalendar() {
    const [selectedBookings, setSelectedBookings] = useState<Booking[] | null>(null);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const params = useParams<{ id: string }>()

    useEffect(() => {
        const getBookings = async () => {
            const res = await fetch(`/api/listings/${params.id}/booking`);
            const data = await res.json();

            if (!res.ok) {
                return;
            }

            setBookings(data);
            console.log(data);
        }

        getBookings();
    }, [])

    const startDates = bookings.map((b) => startOfDay(new Date(b.checkIn)));

    const endDates = bookings.map((b) => startOfDay(new Date(b.checkOut)));

    const middleDates = bookings.flatMap((b) => {
        // Booking is only 1 or 2 days long
        if (new Date(b.checkOut) <= addDays(new Date(b.checkIn), 1)) {
            return [];
        }

        return eachDayOfInterval({
            start: addDays(startOfDay(new Date(b.checkIn)), 1),
            end: subDays(startOfDay(new Date(b.checkOut)), 1),
        });
    });


    function handleDayClick(day: Date) {
        // const booking = bookings.find((booking) =>
        //     isWithinInterval(startOfDay(day), {
        //         start: startOfDay(new Date(booking.checkIn)),
        //         end: startOfDay(new Date(booking.checkOut)),
        //     })
        // );

        const clickedDay = startOfDay(day);

        const booking = bookings.filter((booking) =>
            isWithinInterval(clickedDay, {
                start: startOfDay(new Date(booking.checkIn)),
                end: startOfDay(new Date(booking.checkOut)),
            })
        );

        setSelectedBookings(booking);

        console.log(booking);
        setSelectedBookings(booking ?? null);
    }

    return (
        <div className="flex items-center justify-between p-4 gap-6">
            <div className="flex w-full flex-1 justify-center items-center h-[85vh] [--cell-size:--spacing(20)]">
                <Calendar
                    mode="single"
                    modifiers={{
                        start: startDates,
                        middle: middleDates,
                        end: endDates,
                    }}
                    className="[--cell-size:--spacing(20)] bg-gray-100 rounded-xl"
                    classNames={{
                        day: " w-40 h-20 relative text-base ring-1 ring-border",
                        week: 'border',
                        // weekday: 'border',
                        weekdays: 'border',

                    }}
                    modifiersClassNames={{
                        start:
                            "relative after:absolute  after:right-0 after:top-1/4 after:h-1/2 after:w-1/2 after:rounded-l-full after:bg-rose-500 after:content-['']",

                        end:
                            "relative after:absolute  after:left-0 after:top-1/4 after:h-1/2 after:w-1/2 after:rounded-r-full after:bg-rose-500 after:content-['']",

                        middle:
                            "relative after:absolute  after:inset-y-1/4 after:left-0 after:right-0 after:bg-rose-500 after:content-['']"
                    }}
                    onDayClick={handleDayClick}
                />
            </div>
            <div className="w-80 rounded-xl border p-5 bg-gray-100 h-[85vh] min-h-100 overflow-auto">
                {selectedBookings ? (
                    <>
                        {selectedBookings.map((selectedBooking) => (
                            <div>
                                <div className="flex items-center justify-center mb-3">
                                    <UserRound size={100} className="bg-gray-200 rounded-full p-2" />
                                </div>
                                <h2 className="text-2xl font-semibold w-full text-center">
                                    {selectedBooking.user.name}
                                </h2>

                                <div className="mt-4 space-y-2 text-m">
                                    <p>
                                        <span className="font-medium">Email:</span>{" "}
                                        {selectedBooking.user.email}
                                    </p>

                                    <p>
                                        <span className="font-medium">Guests:</span>{" "}
                                        {selectedBooking.guests}
                                    </p>

                                    <p>
                                        <span className="font-medium">Check-in:</span>{" "}
                                        {new Date(selectedBooking.checkIn).toDateString()}
                                    </p>

                                    <p>
                                        <span className="font-medium">Check-out:</span>{" "}
                                        {new Date(selectedBooking.checkOut).toDateString()}
                                    </p>

                                    <p>
                                        <span className="font-medium">Total:</span> ₹
                                        {selectedBooking.totalPrice}
                                    </p>
                                </div>
                            </div>

                        ))}
                    </>
                ) : (
                    <div className="flex h-full items-center justify-center text-gray-500">
                        Click a booked date to view guest details
                    </div>
                )}
            </div>
        </div>
    );
}