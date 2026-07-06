"use client";

import useUpdateUrlParams from "@/hooks/updateParam";
import { useParams, useSearchParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";

export default function GuestPopover(
  { showGuests, setShowGuests, maxGuests, onSave }:
    {
      showGuests: boolean,
      setShowGuests: React.Dispatch<React.SetStateAction<boolean>>,
      maxGuests: number | undefined,
      onSave: (guests: number) => void
    }
) {
  const searchParam = useSearchParams();
  const guest = searchParam.get("guests") || 1;
  const [guests, setGuests] = useState(Number(guest));
  const popoverRef = useRef<HTMLDivElement>(null);
  const updateParam = useUpdateUrlParams();

  const increaseGuests = () => {
    setGuests((prev) => Math.min(10, prev + 1));
  };

  const decreaseGuests = () => {
    setGuests((prev) => Math.max(1, prev - 1));
  };

  // close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setShowGuests(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSave = () => {
    onSave(guests);
    setShowGuests(false);
  }

  return (
    <div className="relative bg-white p-4" ref={popoverRef}>

      {showGuests && (
        <div className="">

          <div className="flex justify-between items-center">

            <div>
              <p className="font-medium">Guests</p>
              <p className="text-sm text-gray-500">Maximum {maxGuests} guests</p>
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
                disabled={guests === maxGuests}
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
      )}
    </div>
  );
}