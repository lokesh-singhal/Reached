'use client'
import { MapPinHouse } from "lucide-react";
import DateRangePicker from "./DateRangePicker";
import { useEffect, useState } from "react";
import DatePickerSmall from "./DatePickerSmall";
import { DateRange } from "react-day-picker";
import SmallGuestPopover from "./SmallGuestPop";
import { format } from 'date-fns';
import { useRouter } from "next/navigation";

const formatted = (range: DateRange | undefined) => {
  if (!range?.from || !range.to) return;
  const sameMonth =
    range.from.getMonth() === range.to.getMonth() &&
    range.from.getFullYear() === range.to.getFullYear();

  if (sameMonth) {
    return `${format(range.from, "d")}–${format(range.to, "d MMM")}`;
  }

  return `${format(range.from, "d MMM")} – ${format(range.to, "d MMM")}`;
}

export default function SearchSmall({ setSmallSearch }: { setSmallSearch: React.Dispatch<React.SetStateAction<boolean>> }) {
    const router = useRouter();
    const [search, setSearch] = useState([]);
    const [query, setQuery] = useState("");
    const [showCalendar, setShowCalendar] = useState<boolean>(true);
    const [range, setRange] = useState<DateRange | undefined>();
    const [guests, setGuests] = useState<number>();
    const [expand, setExpand] = useState<number | null>(0)
    const [showGuests, setShowGuests] = useState<boolean>(true);
    useEffect(() => {
          document.body.style.overflow = "hidden";

          return () => {
            document.body.style.overflow = "";
          }
    }, [])
    
    useEffect(() => {
        if (query.length < 2) {
            setSearch([]);
            return;
        }

        const timer = setTimeout(async () => {
            const res = await fetch(`/api/listings/search/suggestions?city=${encodeURIComponent(query)}`);
            const data = await res.json();
            setSearch(data);

            return () => clearTimeout(timer);
        }, 300);
    }, [query]);

    const handleSearch = async () => {
        setSmallSearch(false);
        router.push(
        `/search?city=${encodeURIComponent(query)}&checkIn=${encodeURIComponent(range?.from?.toISOString()!)}&checkOut=${encodeURIComponent(range?.to?.toISOString()!)}&guests=${guests}`
        );
  }
    return (
        <div className="w-full p-4 h-dvh flex flex-col">
            <div onClick={() => setSmallSearch(false)} className="self-end py-4">
                <img className=" w-8 h-8 top-4  bg-white rounded-full right-4" src="/cross.svg" alt="" />
            </div>
            <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
                <div  className={`bg-white w-full p-4 flex flex-col gap-2 rounded-xl ${expand === 0 ? "shadow-xl" : ""}`}>
                    {expand === 0 ? (
                        <div className="">
                            <h1 className="text-2xl font-semibold">Where?</h1>
                            <input value={query} onChange={(e) => setQuery(e.target.value)} className="border border-black w-full px-6 py-4 rounded-md mb-5" type="text" placeholder="Search destinations" />
                            <div className="overflow-y-auto max-h-[30dvh]">
                                {
                                    search.length > 0 ? (
                                        search.map((item: any) => (
                                            <button onClick={() => {setQuery(item._id); setExpand(1)}} className="text-2xl flex px-3 w-full rounded-xl gap-8 items-center truncate hover:bg-gray-200">
                                                <div className="bg-gray-200 rounded-xl p-1">
                                                    <MapPinHouse size={30} />
                                                </div>
                                                {item._id}
                                            </button>
                                        ))
                                    ) : (
                                        <div>
                                            No suggestions...
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    ) : (
                        <div onClick={() => setExpand(0)} className="flex items-center justify-between">
                            <span>Where</span>
                            <span>{query ? query : "I'm flexible"}</span>
                        </div>
                    )}

                </div>
                <div  className={`bg-white w-full p-4 rounded-xl relative ${expand === 1 ? "shadow-xl" : ""}`}>
                    {expand === 1 ? (
                        <div className="">
                            <DatePickerSmall
                                setShowCalendar={setShowCalendar}
                                onSave={(range) => {
                                    setRange(range);
                                    setExpand(2);
                                }}
                            />
                        </div>
                    ) : (
                        <div onClick={() => setExpand(1)} className="flex items-center justify-between">
                            <span>When</span>
                            <span>{range ? formatted(range) : "Add Dates"}</span>
                        </div>
                    )}
                </div>
                <div  className={`bg-white w-full p-4 rounded-xl relative ${expand === 2 ? "shadow-xl" : ""}`}>
                    {expand === 2 ? (
                        <div>
                            <SmallGuestPopover 
                             setShowGuests={setShowGuests}
                             onSave={(guest) => {
                                setGuests(guest);
                                setExpand(null);
                             }}
                            />
                        </div>
                    ) : (
                        <div onClick={() => setExpand(2)} className="flex items-center justify-between">
                            <span>Who</span>
                            <span>{guests ? guests : "Add Guests"}</span>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex items-center justify-between px-4 mb-3 sticky bottom-0 bg-white border-t p-4 rounded-xl">
                <button onClick={() => {setQuery(""); setGuests(1); setRange(undefined); setExpand(null)}} className="underline text-xl">
                    Reset
                </button>
                <button onClick={handleSearch} className="text-white text-xl font-semibold bg-black px-6 py-2 rounded-md">
                    Search
                </button>
            </div>
        </div>
    )
}