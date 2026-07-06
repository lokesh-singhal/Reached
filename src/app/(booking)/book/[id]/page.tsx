'use client'
import BookingSummary from "@/app/components/BookingSummary";
import ConfirmLayout from "@/app/components/ConfirmLayout";
import PaymentSection from "@/app/components/PaymentSection";
import { useParams, useSearchParams } from "next/navigation";
import Razorpay from "razorpay";
import { useEffect, useState } from "react";

interface Listing {
  houseImageUrl: string[],
  _id: string,
  title: string,
  maxGuests: number,
  price: number
}

interface Options {
  key: string,
  amount: number,
  currency: string,
  order_id: string,
  handler: any,
  name: string
}
export default function ConfirmPage() {
  const searchParams = useSearchParams();
  const params = useParams<{ id: string }>();
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const guests = searchParams.get("guests");
  const [listing, setListing] = useState<Listing | null>(null);

  useEffect(() => {
    const particularListing = async () => {
      const res = await fetch(`/api/listings/${params.id}`);
      const data = await res.json();
      setListing(data);
    };

    particularListing();
  }, [params]);

  // show loading state until we have all necessary data
  if (!listing || !checkIn || !checkOut || !guests) {
    return (
      <ConfirmLayout>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading booking information...</p>
        </div>
      </ConfirmLayout>
    );
  }

  const handleClick = async () => {
    if(Number(guests) > listing.maxGuests){
      console.log("Too many guests");
      return;
    }
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        listingId: listing?._id,
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        guests
      })
    })
    if(!res.ok){
      console.log("No booking for this date");
      return;
    }
    const data = await res.json();
    const options:Options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      amount: data.amount,
      currency: data.currency,
      order_id: data.order,
      name: "Reached",

      handler: async function (response: any) {
        await fetch("/api/orders/verify-payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(response),
        });
      },
    }

    const rzp1 = new window.Razorpay(options);
    rzp1.open();

  }

  return (
    <ConfirmLayout>
      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold">
                Proceed to payment
              </h2>
              <p className="text-gray-600 mt-1">
                You’ll be directed to Razorpay to complete payment.
              </p>
            </div>

            <hr />

            <p className="text-sm text-gray-600">
              By selecting the button, I agree to the{" "}
              <span className="underline cursor-pointer">
                booking terms
              </span>.
            </p>

            <button onClick={handleClick} className="w-full cursor-pointer bg-black text-white py-4 rounded-xl font-medium hover:bg-gray-900 transition">
              Continue to Razorpay
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <BookingSummary listing={listing} checkIn={checkIn} checkOut={checkOut} guests={guests} />
        </div>
      </div>
    </ConfirmLayout>
  );
}