'use client'
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";


interface Listing {
    houseImageUrl: string[],
}
export default function AllPhotos() {
    const params = useParams<{ id: string }>();
    const [listing, setListing] = useState<Listing>();
    useEffect(() => {
        const particularListing = async () => {
            const data = await fetch(`/api/listings/${params.id}`);
            const res = await data.json();
            setListing(res);
        }

        particularListing();
    }, [params])

    if(!listing) {
        return <div className="text-2xl">Loading...</div>
    }
    return (
        <div className="my-10 mx-4 lg:mx-auto lg:w-[70vw]">
            <h1 className="text-3xl font-semibold">Home Tour</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 ">
                {listing.houseImageUrl.map((items) => (
                    <div className="">
                        <img className="aspect-6/5 rounded-xl object-cover" src={items} alt="" />
                    </div>
                ))}
            </div>
        </div>
    )
}