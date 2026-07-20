'use client'
import { HtmlHTMLAttributes, useEffect, useRef, useState } from 'react'
import DropDown from '../DropDown'
import { useRouter, useSearchParams } from 'next/navigation';
import Search from '../Search';
import DateRangePicker from '../DateRangePicker';
import { DateRange } from 'react-day-picker';
import GuestPopover from '../GuestsPop';
import { format } from 'date-fns';
import { UserRound } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import SearchSmall from '../SearchSmall';

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

const Navbar = () => {
  const dropDownRef = useRef<HTMLDivElement>(null);
  const destinationRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const datePicker = useRef<HTMLDivElement>(null);
  const guestRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [smallSearch, setSmallSearch] = useState(false);
  const [range, setRange] = useState<DateRange>();
  const [guests, setGuests] = useState<number>();
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState([]);
  const [isShowGuest, setIsShowGuest] = useState(false);

  const { data: session } = authClient.useSession();

  const [isDestination, setIsDestination] = useState(false);
  const [isDatePicker, setIsDatePicker] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (dropDownRef.current && !dropDownRef.current.contains(target)) {
        setIsOpen(false);
      }

      if (destinationRef.current && !destinationRef.current.contains(target)) {
        setIsDestination(false);
      }

      if (datePicker.current && !datePicker.current.contains(target)) {
        setIsDatePicker(false);
      }

      if (guestRef.current && !guestRef.current.contains(target)) {
        setIsShowGuest(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);

    }
  }, [])

  const destination = searchParams.get("city");
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const reqGuests = searchParams.get("guests");
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
  }, [query])

  const handleSearch = async () => {
    router.push(
      `/search?city=${encodeURIComponent(query)}&checkIn=${encodeURIComponent(range?.from?.toISOString()!)}&checkOut=${encodeURIComponent(range?.to?.toISOString()!)}&guests=${guests}`
    );
  }

  return (
    <div className='sticky top-0 shadow-md z-100'>
      <div className='grid grid-cols-2 gap-4 lg:grid-cols-[auto_1fr_auto] max-w-full h-[12%] bg-gray-200 px-4 py-10 md:p-10 items-center '>
        <div onClick={() => router.push("/")} className='flex justify-self-start justify-center items-center cursor-pointer'>
          <img className='h-18' src="/appIcon.svg" alt="App Logo" />
          <span className='text-2xl max-xl:lg:hidden'>Reached</span>
        </div>
        <div className='justify-self-end lg:col-start-3 flex gap-4 items-center justify-center pr-3'>
          <div className='text-[18px] max-xl:hidden'>Become a host</div>
          <div onClick={() => router.push("/profile")} className={`h-10 w-10 rounded-full cursor-pointer bg-gray-400 justify-center self-center ${session ? "" : "hidden"}`}>
            <UserRound size={35} className='pl-1' />
          </div>
          <div ref={dropDownRef} className='relative'>
            <button onClick={() => setIsOpen(prev => !prev)}>
              <img className='h-8 cursor-pointer' src="/bar.svg" alt="" />
            </button>
            {isOpen && <DropDown isOpen={isOpen} setIsOpen={setIsOpen} />}
          </div>
        </div>
        <div className='col-span-2 max-md:w-full lg:col-span-1 lg:col-start-2 lg:row-start-1 justify-self-center flex border border-gray-100 shadow-2xl bg-white rounded-full justify-between items-center relative'>
          <div ref={destinationRef} className='relative max-md:hidden'>
            <input value={query} onChange={(e) => setQuery(e.target.value)} onClick={() => setIsDestination(true)} className='hover:bg-gray-500  p-6 px-8 rounded-full placeholder:text-black  focus:outline-none focus:shadow focus:border-0 focus:bg-gray-100' type="text" placeholder='Add Destination' />
            {isDestination && (
              <div className='absolute top-20'>
                <Search search={search} setQuery={setQuery} setIsDestination={setIsDestination} />
              </div>
            )}
          </div>
          <div ref={datePicker} className='relative max-md:hidden'>
            <button onClick={() => setIsDatePicker(true)} className='hover:bg-gray-500  text-start p-6 px-8 rounded-full focus:outline-none focus:shadow focus:border-0 focus:bg-gray-100 w-60'>{formatted(range) || "Add Dates"}</button>
            {isDatePicker && (
              <div className='absolute top-20 md:-left-40'>
                <DateRangePicker
                  setShowCalendar={setIsDatePicker}
                  checkInDate={range?.from!}
                  checkOutDate={range?.to!}
                  listingId={undefined}
                  onSave={(range) => {
                    setRange(range);
                  }}
                />
              </div>
            )}
          </div>
          <div className='flex max-md:hidden justify-center items-center relative  rounded-full'>
            <div ref={guestRef} className='relative'>
              <button onClick={() => setIsShowGuest(true)} className=' p-6 px-8 hover:bg-gray-500 rounded-full focus:outline-none focus:shadow focus:border-0 focus:bg-gray-100 w-60 text-start'>{guests || "Add"} {guests == 1 ? " Guest" : " Guests"}</button>
              {isShowGuest && (
                <div className='absolute w-60 shadow-2xl top-20 rounded-2xl overflow-hidden'>
                  <GuestPopover
                    showGuests={isShowGuest}
                    setShowGuests={setIsShowGuest}
                    maxGuests={undefined}
                    onSave={(guest) => {
                      setGuests(guest);
                    }}
                  />
                </div>
              )}
            </div>
            <button onClick={handleSearch} className='cursor-pointer h-14 w-14 rounded-full bg-green-500 absolute right-2 flex items-center justify-center'><img className='h-10 w-10' src="/search.svg" alt="" /></button>
          </div>
          <div onClick={() => setSmallSearch(true)}
            className='md:hidden hover:bg-gray-500 p-6 px-8 text-center w-full text-xl font-semibold  rounded-full truncate focus:outline-none focus:shadow focus:border-0 focus:bg-gray-100'>
            🔍 Start your search
          </div>
        </div>
      </div>
      {smallSearch && (
        <div className='md:hidden absolute bottom-0 top-0 h-screen left-0 right-0 bg-gray-200'>
          <SearchSmall setSmallSearch={setSmallSearch} />
        </div>
      )}
    </div>
  )
}

export default Navbar
