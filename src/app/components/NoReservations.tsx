'use client'
import { useRouter } from "next/navigation"


const NoReservations = () => {
    const router = useRouter();
    return (
        <>
            <div className="lg:mx-20 mx-10 lg:px-20 min-h-[50vh] shrink-0 flex flex-col justify-center gap-16">
                <div className="text-4xl font-semibold">Trips</div>
                <div className="flex flex-col gap-4">
                    <div className="text-2xl font-semibold text-gray-800">Build the perfect trip</div>
                    <div>Explore homes, experiences and services. When you book, your reservations will appear here.</div>
                    <button onClick={() => router.push("/")} className=
                        "border py-4 text-xl font-bold px-8 rounded-2xl bg-pink-700 cursor-pointer text-white self-start">
                        Get Started
                    </button>
                </div>
            </div>
        </>
    )
}

export default NoReservations
