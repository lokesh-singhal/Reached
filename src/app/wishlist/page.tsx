'use client'

import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("../components/Map"), {
  ssr: false,
});


type Listing = {
  _id: string,
  host: string,
  title: string,
  description: string,
  houseImageUrl: string[];
  address: string,
  city: string,
  state: string,
  location: {
    type: string,
    coordinates: number[]
  },
  maxGuests: number,
  price: number,
  status: string,
  averageRating: number,
}

const Wishlist = () => {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const [listing, setListing] = useState([]);

  useEffect(() => {
    const getFavourite = async () => {
      const res = await fetch("/api/favourites");
      if (!res.ok) return;
      const data = await res.json();
      const listings = data.map((item: any) => item.listing);
      setListing(listings)
    };

    getFavourite();
  }, [])


  const handleListing = (list: string) => {
    router.push(`/rooms/${list}`);
  }

  return (
    <>
      {session ? (
        <div className="relative w-full">
          <div className="w-full lg:pr-[40%]">
            <div className="max-w-7xl mx-auto px-6 py-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {listing.map((item: Listing) => (
                  <div
                    key={item._id}
                    onClick={() => handleListing(item._id)}
                    className="cursor-pointer"
                  >
                    <img
                      className="w-full aspect-20/19 object-cover rounded-xl"
                      src={item.houseImageUrl[0]}
                      alt={item.title}
                    />

                    <div className="pt-2">
                      <div className="flex items-center justify-between">
                        <h1 className="font-medium truncate">
                          {item.title}
                        </h1>
                        <span>⭐ {item.averageRating}</span>
                      </div>

                      <p className="truncate text-gray-600">
                        {item.description}
                      </p>

                      <p className="text-gray-600">
                        {item.maxGuests} guests
                      </p>

                      <p>
                        <span className="font-bold underline">
                          ₹{item.price}
                        </span>{" "}
                        for 1 night
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="hidden lg:block fixed top-[16%] right-0 w-[40%] h-[calc(100vh-16%)] bg-white">
            <Map listing={listing} />
          </div>
        </div>
      ) : (
        <div className="mx-20 px-20 min-h-[50vh] shrink-0 flex flex-col justify-center gap-16">
          <div className="text-4xl font-semibold">Wishlists</div>
          <div className="flex flex-col gap-4">
            <div className="text-2xl font-semibold text-gray-800">Login in to view your wishlist</div>
            <div>You can create, view, or edit wishlists once you’ve logged in.</div>
            <button onClick={() => router.push("/sign-in")} className=
              "border py-4 text-xl font-bold px-8 rounded-2xl bg-pink-700 cursor-pointer text-white self-start">
              Log in
            </button>
          </div>
        </div>
      )
      }
    </>
  )
}

export default Wishlist
