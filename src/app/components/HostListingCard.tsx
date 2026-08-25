'use client'

import { useRouter } from "next/navigation"
import { Spinner } from "./ui/spinner";
import { useState } from "react";

interface Listing {
    _id?: string,
    description?: string,
    title: string,
    houseImageUrl: string[],
    city: string,
    state: string,
    maxGuests: number
    host: {
        name: string,
        email: string,
    },
    price: number,
    averageRating: number,
    status: string,
    booking: {

    },
    totalBookings: number,
    totalIncome: number,
    totalReviews: number,
}

export default function HostListingCard({ listing, onDelete }: { listing: Listing[], onDelete: (listingId: string) => Promise<void> }) {
    const router = useRouter();
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const handleDelete = async(listingId: string) => {
        setLoadingId(listingId);
        await onDelete(listingId);
        setLoadingId(null);
    }
    return (
        <div>
            {listing.map((item) => (
                <div className="rounded-xl border bg-background p-4 shadow-sm">
                    <div className="flex flex-col gap-4 md:flex-row">
                        <div className="w-full md:w-72 shrink-0">
                            <img
                                src={item.houseImageUrl[0]}
                                alt="Listing"
                                className="h-65 md:h-52 w-full rounded-lg object-cover"
                            />
                        </div>

                        <div className="flex flex-1 flex-col">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                    <h2 className="text-xl font-semibold">
                                        {item.title}
                                    </h2>

                                    <p className="mt-1 text-sm text-muted-foreground">
                                        📍 {item.city}, {item.state}
                                    </p>

                                    <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                        <span>⭐ {item.averageRating} ({item.totalReviews})</span>
                                        <span>👤 {item.maxGuests} Guests</span>
                                        <span>₹{item.price}/night</span>
                                    </div>
                                </div>

                                <span className={`rounded-full max-sm:w-20 px-3 py-1 text-sm font-medium ${item.status === "INACTIVE" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                                    {item.status}
                                </span>
                            </div>

                            <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
                                <div className="rounded-lg border p-3">
                                    <p className="text-xs text-muted-foreground">
                                        Bookings
                                    </p>
                                    <p className="mt-1 text-xl font-semibold">
                                        {item.totalBookings}
                                    </p>
                                </div>

                                <div className="rounded-lg border p-3">
                                    <p className="text-xs text-muted-foreground">
                                        Revenue
                                    </p>
                                    <p className="mt-1 text-xl font-semibold">
                                        ₹{item.totalIncome.toLocaleString("en-IN")}
                                    </p>
                                </div>

                                <div className="rounded-lg border p-3">
                                    <p className="text-xs text-muted-foreground">
                                        Average Rating
                                    </p>
                                    <p className="mt-1 text-xl font-semibold">
                                        {item.averageRating}
                                    </p>
                                </div>

                                <div className="rounded-lg border p-3">
                                    <p className="text-xs text-muted-foreground">
                                        Reviews
                                    </p>
                                    <p className="mt-1 text-xl font-semibold">
                                        {item.totalReviews}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 flex flex-wrap gap-3">
                                <button onClick={() => window.open(`/rooms/${item._id}`, "_blank")} className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted">
                                    Preview
                                </button>

                                <button onClick={() => router.push(`/host/listing/calendar/${item._id}`)} className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted">
                                    Calendar
                                </button>

                                <button onClick={() => router.push(`/host/listing/edit/${item._id}`)} className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted">
                                    Edit
                                </button>

                                <button disabled={loadingId === item._id} onClick={() => handleDelete(item._id!)} className="rounded-lg bg-red-500 disabled:bg-red-300 disabled:cursor-not-allowed px-4 py-2 text-sm font-medium text-white hover:bg-red-600">
                                    {loadingId === item._id ? <Spinner /> : "Delete"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}