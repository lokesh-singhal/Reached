'use client'
import Image from "next/image";
import Navbar from "./components/navbar/Navbar";
import CardListing from "./components/CardListing";
import { useEffect, useState } from "react";

const rating = 4.4;
const state = "Delhi";

export default function Home() {

  const [Listing, setListing] = useState([]);

  useEffect(() => {
    const getListing = async () => {
      try {
        const res = await fetch("/api/listings");
        if (!res) {
          throw new Error("Bad network request");
        }
        const data = await res.json();
        setListing(data);
      } catch (error) {
        console.log(error);
      }
    }

    getListing();
  }, [])


  return (
    <>
      <div className="mx-20 my-10">
        <div className="flex flex-col gap-4">
          <CardListing listing = {Listing} rating={rating} state="Delhi" />
          <CardListing listing = {Listing} rating={rating} state="Mumbai" />
          <CardListing listing = {Listing} rating={rating} state="Goa" />
          <CardListing listing = {Listing} rating={rating} state="Jaipur" />
        </div>
      </div>
    </>
  );
}
