'use client'
import BookingSummary from "@/app/components/BookingSummary";
import ConfirmLayout from "@/app/components/ConfirmLayout";
import PaymentSection from "@/app/components/PaymentSection";
import { Spinner } from "@/app/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { redirect, useParams, useRouter, useSearchParams } from "next/navigation";
import Razorpay from "razorpay";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Listing {
  houseImageUrl: string[],
  _id: string,
  title: string,
  maxGuests: number,
  price: number,
  averageRating: number
}

interface Options {
  key: string,
  amount: number,
  currency: string,
  order_id: string,
  handler: any,
  name: string
  modal: any
}
export default function ConfirmPage() {
  const searchParams = useSearchParams();
  const {data: session} = authClient.useSession();
  const params = useParams<{ id: string }>();
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const guests = searchParams.get("guests");
  const router = useRouter();
  const [listing, setListing] = useState<Listing | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if(!session){
    redirect("/sign-in");
  }

  useEffect(() => {
    const particularListing = async () => {
      const res = await fetch(`/api/listings/${params.id}`);
      const data = await res.json();
      setListing(data);
    };

    particularListing();
  }, [params]);

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
    if(isLoading) return;

    try {
      setIsLoading(true);

      if(Number(guests) > listing.maxGuests){
        toast.warning("Too many guests");
        setIsLoading(false);
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
        toast.error("No booking available for this date", {
          style: {
            background: 'red',
          }
        })
        setIsLoading(false);
        return;
      }

      const data = await res.json();

      const deletePayment = async() => {
        const res = await fetch(`/api/orders/${data.bookingId}`,{
          method: "DELETE",
        })

      }
      const options:Options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: data.amount,
        currency: data.currency,
        order_id: data.order,
        name: "Reached",
  
        handler: async function (response: any) {
          const res = await fetch("/api/orders/verify-payment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(response),
          });

          if(res.ok){
            setIsLoading(false);
            router.replace("/");
          }
        },

        modal: {
          ondismiss: async function(){
            await deletePayment();
            router.replace("/");
          }
        }
      }
  
      const rzp1 = new window.Razorpay(options);
      rzp1.open();

      rzp1.on("payment.failed", async function(response:any){
        toast.error(response.error.description, {
          style: {
            background: 'red',
          }
        })
        setIsLoading(false);
      })
    } catch (error) {
      console.log(error);
    } 
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

            <button disabled={isLoading} onClick={handleClick} className="w-full cursor-pointer bg-black disabled:bg-black/50 disabled:cursor-not-allowed text-white py-4 rounded-xl font-medium hover:bg-gray-900 transition flex justify-center">
              {isLoading ? <Spinner /> : "Continue to Razorpay"}
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