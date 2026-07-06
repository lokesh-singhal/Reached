'use client'
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import NoReservations from "../components/NoReservations";
import ShowReservations from "../components/ShowReservations";
import Review from "../components/Review";

interface Booking {
    _id: string,
    listing: string
}

export default function Reservations() {
    const [line, setLine] = useState("upcoming");
    const [upcoming, setUpcoming] = useState([]);
    const [complete, setComplete] = useState([]);
    const [reviewBooking, setReviewBooking] = useState<Booking | null>(null);

    useEffect(() => {
        const gatherReservations = async () => {
            const res = await fetch("/api/orders");
            if (!res.ok) {
                return;
            }

            const data = await res.json();
            console.log(data.filter((items: any) => items.status === "CONFIRMED" && new Date(items.checkIn).setHours(0,0,0,0) >= new Date().setHours(0,0,0,0)));
            setUpcoming(data.filter((items: any) => items.status === "CONFIRMED" && new Date(items.checkIn).setHours(0,0,0,0) >= new Date().setHours(0,0,0,0)));
            setComplete(data.filter((items: any) => items.status === "CONFIRMED" && new Date(items.checkOut) < new Date()));
        }

        gatherReservations();
    }, [])

    console.log(upcoming)
    console.log(complete)

    return (
        <div className="relative">
            {reviewBooking && <div className="absolute z-10 inset-0 bg-black/50 h-full" />}
            {reviewBooking && (
                <div>
                    <div className="z-10 fixed bg-gray-100 w-1/2 top-1/2 left-1/2 -translate-x-1/2 -translate-y-3/7 p-4 rounded-2xl">
                        <Review setComplete={setComplete} reviewBooking={reviewBooking} setReviewBooking={setReviewBooking} />
                    </div>
                </div>
            )}
            {upcoming.length !== 0 || complete.length !== 0 ? (
                <div className="lg:mx-30 lg:px-10 pt-10 mx-4">
                    <div className="text-3xl font-bold">Trips</div>
                    <div>
                        <div className="flex text-[18px] gap-8 items-center mt-10">
                            <span onClick={() => setLine("upcoming")} className={`relative cursor-pointer ${line === "upcoming" && "font-semibold after:absolute after:bottom-0 after:left-0 after:h-px after:content-[''] after:w-full after:bg-black"}`}>Upcoming</span>
                            <span onClick={() => setLine("complete")} className={`relative cursor-pointer ${line === "complete" && "font-semibold after:absolute after:bottom-0 after:left-0 after:h-px after:content-[''] after:w-full after:bg-black"}`}>Completed</span>
                        </div>
                        <div className="bg-gray-300 h-px w-full shadow-2xl shadow-black"></div>
                    </div>
                    <div>
                        <ShowReservations setReviewBooking={setReviewBooking} line={line} upcoming={upcoming} complete={complete} />
                    </div>
                </div>
            ) : (
                <NoReservations />
            )
            }
        </div>
    )
}