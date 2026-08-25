'use client'
import HostListingCard from "@/app/components/HostListingCard";
import { Dot, Hotel, IndianRupee } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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
        checkIn: Date,
    },
    totalBookings: number,
    totalIncome: number,
    totalReviews: number,
}

interface Income {
    _id: {
        month: number,
        year: number
    }
    income: number
}
export default function Edit() {
    const [listing, setListing] = useState<Listing[]>([])
    const [monthIncome, setMonthIncome] = useState<Income[]>([]);
    const router = useRouter();

    const getListing = async () => {
        const res = await fetch("/api/host/listing");
        if (!res.ok) {
            return;
        }

        const data = await res.json();
        setListing(data.listing);
        setMonthIncome(data.incomeByMonth);
    }

    useEffect(() => {
        getListing();
    }, [])

    if (listing) {
        for (const element of listing) {
            // console.log(element.booking.length);
        }
    }

    const handleDelete = async (listingId: string) => {
        const resp = confirm("Are you sure you want to delete this listing");
        if(!resp){
            return;
        }
        try {
            const res = await fetch(`/api/listings/${listingId}`, {
                method: "DELETE"
            });
            const data = await res.json();
    
            if (!res.ok) {
                toast.error(data.message, {
                    style: {
                        backgroundColor: 'red',
                    }
                })
    
                return;
            }
    
            toast.success(data.message, {
                style: {
                    backgroundColor: 'lightgreen',
                }
            })
        } catch (error) {
            console.log(error);
        }

        await getListing();
    }

    const currentMonth = new Date(Date.now()).getMonth();
    const income = monthIncome.find((item) => item._id.month === currentMonth + 1)

    const activeListing = listing && listing.reduce((count, item) => { return item.status === "ACTIVE" ? count + 1 : count }, 0);
    return (
        <div className="p-4 md:px-20">
            <div className="mb-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 w-full">
                    <div className="bg-gray-200 p-6 rounded-xs">
                        <div className="flex gap-2 items-center">
                            <span className=""><Hotel size={30} /></span>
                            <span className="text-xl md:text-3xl font-semibold">{listing.length || 0}</span>
                        </div>
                        <div className="text-2xs mt-2 font-semibold text-black/60">
                            Total Listings
                        </div>
                    </div>
                    <div className="bg-gray-200 p-6 rounded-xs">
                        <div className="flex gap-2 items-center">
                            <span className=""><Dot strokeWidth={16} color="green" /></span>
                            <span className="text-xl md:text-3xl font-semibold">{activeListing || 0}</span>
                        </div>
                        <div className="text-2xs mt-2 font-semibold text-black/60">
                            Total Active Listings
                        </div>
                    </div>
                    <div className="bg-gray-200 p-6 rounded-xs">
                        <div className="flex gap-2 items-center">
                            <span className=""><Dot strokeWidth={16} color="red" /></span>
                            <span className="text-xl md:text-3xl font-semibold">{(listing.length - activeListing) || 0}</span>
                        </div>
                        <div className="text-2xs mt-2 font-semibold text-black/60">
                            Total Inactive Listings
                        </div>
                    </div>
                    <div className="bg-gray-200 p-6 rounded-xs">
                        <div className="flex gap-2 items-center">
                            <span className=""><IndianRupee size={30} strokeWidth={2.75} /></span>
                            <span className="text-xl md:text-3xl font-semibold">{income?.income.toLocaleString("en-IN") || 0}</span>
                        </div>
                        <div className="text-2xs max-md:text-sm mt-2 font-semibold text-black/60">
                            Total Revenue(this month)
                        </div>
                    </div>
                </div>
            </div>
            <div className="mb-4 w-full flex justify-end">
                <button onClick={() => router.push("/host/listing/add")} className="text-xl border border-black/50 px-2 cursor-pointer hover:border-black">+ Add Listing</button>
            </div>
            <HostListingCard listing={listing} onDelete={handleDelete} />
        </div>
    )
}