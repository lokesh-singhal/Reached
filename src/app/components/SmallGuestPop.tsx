"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function SmallGuestPopover(
  { setShowGuests, onSave }:
    {
      setShowGuests: React.Dispatch<React.SetStateAction<boolean>>,
      onSave: (guests: number) => void
    }
) {
  const searchParam = useSearchParams();
  const guest = searchParam.get("guests") !== "undefined" ?  searchParam.get("guests") : 1;
  const [guests, setGuests] = useState(Number(guest));

  const increaseGuests = () => {
    setGuests((prev) => Math.min(10, prev + 1));
  };

  const decreaseGuests = () => {
    setGuests((prev) => Math.max(1, prev - 1));
  };

  const handleSave = () => {
    onSave(guests);
    setShowGuests(false);
  }

  return (
    <div className="relative bg-white p-4">

        <div className="">

          <div className="flex justify-between items-center">

            <div>
              <p className="font-medium">Guests</p>
            </div>

            <div className="flex items-center gap-3">

              <button
                type="button"
                onClick={decreaseGuests}
                disabled={guests === 1}
                className="w-8 h-8 border rounded-full flex items-center justify-center disabled:opacity-40"
              >
                -
              </button>

              <span className="w-6 text-center">{guests}</span>

              <button
                type="button"
                onClick={increaseGuests}
                disabled={guests === 10}
                className="w-8 h-8 border rounded-full flex items-center justify-center disabled:opacity-40"
              >
                +
              </button>

            </div>
          </div>

          <div className="flex justify-end mt-5">
            <button
              type="button"
              onClick={handleSave}
              className="bg-black text-white px-5 py-2 rounded-lg"
            >
              Save
            </button>
          </div>

        </div>
    </div>
  );
}