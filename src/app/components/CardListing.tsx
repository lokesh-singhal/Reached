'use client'
import { useEffect, useRef, useState } from "react";
import RedHeart from "./RedHeart";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

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
}

type cardProps = {
  listing: Listing[];
  rating: number,
  state: string
}
const CardListing = ({ listing, rating, state }: cardProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [favouriteSet, setfavouriteSet] = useState<Set<string>>(new Set());
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const scrollLeft = () => {
    scrollRef.current?.scrollBy({
      left: -600,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const getFavourite = async () => {
      const res = await fetch("/api/favourites");
      if(!res.ok) return;
      const data = await res.json();
      const lists:string[] = [];
      for(const ids of data){
        lists.push(ids.listingId._id.toString())
      }
      setfavouriteSet(new Set(lists));
    }

    getFavourite();
  }, [])
  const toggleHeart = async (listingId:string) => {
    const res = await fetch("api/favourites", {
      method: "POST",
      body: JSON.stringify({
        listingId
      })
    });
    if(!res.ok) return;
    const data = await res.json();
    setfavouriteSet((prev) => {
      const updated = new Set(prev);
      data.liked ? updated.add(listingId): updated.delete(listingId);
      return updated;
    })
    
  }

  const handleListing = async(listingId: string) => {
    router.push(`/rooms/${listingId}`);
  }
  const scrollRight = () => {
    scrollRef.current?.scrollBy({
      left: 600,
      behavior: "smooth",
    });
  };
  return (
    <div>
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl">Popular Stays in {state}</h1>
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

                <div onClick={() => {handleListing(item._id)}} className="min-w-60 relative shrink-0 rounded-lg">
                  <button onClick={() => {
                    if(!session){
                      router.push("/sign-in");
                    }
                    toggleHeart(item._id)}} className="absolute top-1 right-1 cursor-pointer flex justify-center">
                    <RedHeart liked = {favouriteSet.has(item._id)}/>
                  </button>
                  <img className="h-40 w-full object-cover rounded-md" src={item.houseImageUrl[0]} alt="House Image" />
                  <div className="pt-2 flex flex-col">
                    <h1 className="">{item.title}</h1>
                    <h2 className="text-gray-400">{item.price} for 1 night• {"  "}
                      <span>⭐{rating}</span>
                    </h2>
                  </div>
                </div>
              )
            })}
        </div>
      </div>
    </div>
  )
}

export default CardListing;