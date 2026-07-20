'use client'
import { useEffect, useRef, useState } from "react";
import RedHeart from "./RedHeart";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Spinner } from "./ui/spinner";

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
  averageRating: number
}

type cardProps = {
  listing: Listing[];
  loadingId: string | null,
  state: string,
  onListingClick: (id: string) => void,
  onToggleHeart: (id: string) => void,
  favouriteSet: Set<string>,
}
const CardListing = ({ listing, state, onListingClick, loadingId, favouriteSet, onToggleHeart }: cardProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  // const [favouriteSet, setfavouriteSet] = useState<Set<string>>(new Set());
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const scrollLeft = () => {
    scrollRef.current?.scrollBy({
      left: -600,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({
      left: 600,
      behavior: "smooth",
    });
  };

  if(!listing || !state){
    return <div>Loading...</div>
  }

  return (
    <div>
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Popular Stays in {state}</h1>
          <div className="flex gap-1 items-center">
            <button onClick={scrollLeft} className="rounded-full p-1 disabled:bg-gray-100 bg-gray-300"><img src="leftarrow.svg" alt="" /></button>
            <button onClick={scrollRight} className="rounded-full disabled:bg-gray-100 bg-gray-300 p-1"><img src="rightarrow.svg" alt="" /></button>
          </div>
        </div>
        <div ref={scrollRef} className="flex gap-4 scroll-m-0 no-scrollbar overflow-x-auto w-full pt-4">
          {listing
            .filter((item: Listing) => item.city == state)
            .map((item: Listing) => {
              return (
                <div key={item._id} className={loadingId === item._id ? "opacity-60 pointer-events-none relative" : "relative"}>
                  {loadingId === item._id && (
                    <Spinner />
                  )}
                  <div onClick={() => onListingClick(item._id)} className="min-w-60 relative shrink-0 rounded-lg">
                    <img className="h-40 w-full object-cover rounded-md" src={item.houseImageUrl[0]} alt="House Image" />
                    <div className="pt-2 flex flex-col">
                      <h1 className="">{item.title}</h1>
                      <h2 className="text-gray-400">{item.price} for 1 night• {"  "}
                        <span>⭐{item.averageRating}</span>
                      </h2>
                    </div>
                  </div>
                  <button onClick={() => {
                    if (!session) {
                      router.push("/sign-in");
                    }
                    onToggleHeart(item._id)
                  }} className="absolute top-1 right-1 cursor-pointer flex justify-center">
                    <RedHeart liked={favouriteSet.has(item._id)} />
                  </button>
                </div>
              )
            })}
        </div>
      </div>
    </div>
  )
}

export default CardListing;