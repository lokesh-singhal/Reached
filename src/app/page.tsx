'use client'

import CardListing from "./components/CardListing";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


export default function Home() {
  const router = useRouter()
  const [Listing, setListing] = useState([]);
  const [loading, setLoading] = useState(false);
  const [favouriteSet, setfavouriteSet] = useState<Set<string>>(new Set())
  const [loadingId, setLoadingId] = useState<string | null>(null);

  useEffect(() => {
    const getListing = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/listings");
        if (!res) {
          throw new Error("Bad network request");
        }
        const data = await res.json();
        setListing(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    getListing();
  }, [])

  const handleListing = (listingId: string) => {
    setLoadingId(listingId);
    router.push(`/rooms/${listingId}`)
  }

  useEffect(() => {
    const getFavourite = async () => {
      const res = await fetch("/api/favourites");
      if (!res.ok) return;
      const data = await res.json();
      const lists: string[] = [];
      for (const ids of data) {
        lists.push(ids.listing._id.toString())
      }
      setfavouriteSet(new Set(lists));
    }

    getFavourite();
  }, [])

  const toggleHeart = async (listingId: string) => {
    const res = await fetch("api/favourites", {
      method: "POST",
      body: JSON.stringify({
        listingId
      })
    });
    if (!res.ok) return;
    const data = await res.json();
    setfavouriteSet((prev) => {
      const updated = new Set(prev);
      data.liked ? updated.add(listingId) : updated.delete(listingId);
      return updated;
    })

  }

  if (loading) {
    return <div>Loading...</div>
  }
  return (
    <>
      <div className="lg:mx-20 lg:my-10 m-5">
        <div className="flex flex-col gap-4">
          <CardListing
            listing={Listing} loadingId={loadingId} onListingClick={handleListing} favouriteSet={favouriteSet} onToggleHeart={toggleHeart}
            state="Delhi"
          />
          <CardListing
            listing={Listing} loadingId={loadingId} onListingClick={handleListing} favouriteSet={favouriteSet} onToggleHeart={toggleHeart}
            state="Mumbai"
          />
          <CardListing
            listing={Listing} loadingId={loadingId} onListingClick={handleListing} favouriteSet={favouriteSet} onToggleHeart={toggleHeart}
            state="Goa"
          />
          <CardListing
            listing={Listing} loadingId={loadingId} onListingClick={handleListing} favouriteSet={favouriteSet} onToggleHeart={toggleHeart}
            state="Jaipur"
          />
        </div>
      </div>
    </>
  );
}