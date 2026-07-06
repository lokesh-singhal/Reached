import Image from "next/image";
import PriceRow from "./PriceRow";
import { useState } from "react";
import DateRangePicker from "./DateRangePicker";
import GuestPopover from "./GuestsPop";
import { useSearchParams } from "next/navigation";
import useUpdateUrlParams from "@/hooks/updateParam";

interface ListingType {
  _id: string,
  houseImageUrl: string[];
  title: string,
  maxGuests: number,
  price: number
}

function subtractDays(date: Date, days: number) {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() - days);
  return newDate;
}

export default function BookingSummary({ listing, checkIn, checkOut, guests }: { listing: ListingType, checkIn: string, checkOut: string, guests: string }) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [showGuests, setShowGuests] = useState(false);
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const updateParam = useUpdateUrlParams();
  const nights = (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24);

  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-6">

      <div className="flex gap-4">
        <div className="relative w-50 rounded-xl">
          {/* <Image
            src= {listing.houseImageUrl[0]}
            alt="Listing"
            fill
            className="object-cover"
          /> */}
          <img className="object-cover fill" src={listing.houseImageUrl[0]} alt="image" />
        </div>

        <div>
          <h3 className="font-semibold">
            {listing.title}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            ★ 4.94 (16) · Guest favourite
          </p>
        </div>
      </div>

      <hr />

      {/* Cancellation */}
      <div>
        <p className="font-medium">Free cancellation</p>
        <p className="text-sm text-gray-600">
          This reservation is non-refundable.
        </p>
        <p className="underline text-sm cursor-pointer">
          Full policy
        </p>
      </div>

      <hr />

      {/* Dates */}
      <div className="flex justify-between items-center">
        <div>
          <p className="font-medium">Dates</p>
          <p className="text-sm text-gray-600">
            {`${checkInDate.toDateString()} - ${checkOutDate.toDateString()}`}
          </p>
        </div>
        <button onClick={() => setShowCalendar(!showCalendar)} className="bg-gray-100 px-4 py-1 rounded-lg text-sm">
          Change
        </button>
      </div>

      {showCalendar && (
        <div className="absolute top-48 right-1/3 z-50">
          <DateRangePicker
            listingId={listing._id}
            checkInDate={checkInDate}
            checkOutDate={checkOutDate}
            setShowCalendar={setShowCalendar}
            onSave={(range: any) => {
              const inDate = range.from.toISOString().split("T")[0];
              console.log(range.from.toISOString());
              const outDate = range.to.toISOString().split("T")[0];
              console.log(inDate, outDate);
              setShowCalendar(false);
              updateParam({
                checkIn: inDate,
                checkOut: outDate
              })
            }}
          />
        </div>
      )}

      <hr />

      {/* Guests */}
      <div className="relative">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium">Guests</p>
            <p className="text-sm text-gray-600">
              {guests} guests
            </p>
          </div>
          <button onClick={() => setShowGuests(!showGuests)} className="bg-gray-100 px-4 py-1 rounded-lg text-sm">
            Change
          </button>
        </div>

        {showGuests && (
          <div className="absolute right-0 top-10 w-85 bg-white shadow-xl rounded-xl p-3 z-50 border">
            <GuestPopover
              showGuests={showGuests}
              setShowGuests={setShowGuests}
              maxGuests={listing.maxGuests}
              onSave={(guest) => {
                updateParam({
                  guests: guest.toString()
                })
              }}
            />
          </div>
        )}
      </div>

      <hr />

      {/* Price Details */}
      <div className="space-y-3">
        <p className="font-semibold">Price details</p>

        <PriceRow
          label={`${nights} nights × ₹${listing.price.toLocaleString()}`}
          value={`₹${(nights * listing.price).toLocaleString()}`}
        />
        <PriceRow label="Taxes" value={`₹${(nights * 155).toLocaleString()}`} />

        <hr />

        <PriceRow
          label="Total INR"
          value={`₹${((nights * listing.price + nights * 155).toLocaleString())}`}
          bold
        />
      </div>
    </div >
  );
}