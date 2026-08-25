'use client'
import { addHours, endOfMonth, startOfMonth } from "date-fns";
import { Menu, Settings, UserRound } from "lucide-react";
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react";

export default function SideBar() {
    const router = useRouter();
    const pathname = usePathname();
    const [dropDown, setDropDown] = useState(false);
    const dropRef = useRef<HTMLDivElement>(null);
    const date = Date.now();
    const startDate = addHours(startOfMonth(date), 5.5);
    const endDate = addHours(endOfMonth(date), 5.5);
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            if (dropRef.current && !dropRef.current.contains(target)) {
                setDropDown(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }

    }, [])

    const handleEarning = () => {
        router.push(`/host/earnings?period=${"This Month"}&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`);
        setDropDown(false);
    }
    return (
        <div className="shadow-md sticky top-0 z-1001">
            <div className="sm:px-15 px-2 py-4 flex  items-center justify-between gap-4 bg-gray-100">
                <div className='flex justify-self-start justify-center items-center cursor-pointer'>
                    <img className='h-18' src="/appIcon.svg" alt="App Logo" />
                    <span className='text-2xl'>Reached</span>
                </div>
                <div className="flex gap-6 max-md:hidden">
                    <button onClick={() => router.push("/host/dashboard")} className={`text-xl cursor-pointer ${pathname === "/host/dashboard" ? "border-b border-primary transition" : ""}`}>Overview</button>
                    <button onClick={() => { router.push("/host/listing"); }} className={`text-xl cursor-pointer ${pathname.startsWith("/host/listing") ? "border-b border-primary transition" : ""}`}>Listings</button>
                    <button onClick={handleEarning} className={`text-xl cursor-pointer ${pathname.startsWith("/host/earnings") ? "border-b border-primary transition" : ""}`}>Earnings</button>
                    <button onClick={() => router.push("/host/review")} className={`text-xl cursor-pointer ${pathname.startsWith("/host/review") ? "border-b border-primary transition" : ""}`}>Reviews</button>
                </div>
                <div className="flex gap-3 items-center">
                    <UserRound size={40} className="rounded-full bg-gray-200 p-1" />
                    <Settings onClick={() => router.push("/host/setting")} size={35} className="cursor-pointer hidden md:block" />
                    <div ref={dropRef} className="md:hidden">
                        <Menu onClick={() => setDropDown((prev) => !prev)} className=" relative" />
                        {dropDown && (
                            <div className="absolute bg-white w-60 right-6 top-20 rounded-md shadow-md transition p-3 flex flex-col gap-3">
                                <button onClick={() => { router.push("/host/dashboard"); setDropDown(false) }} className={`text-xl active:bg-gray-100 rounded-md py-1`}>Overview</button>
                                <button onClick={() => { router.push("/host/listing"); setDropDown(false); }} className={`text-xl active:bg-gray-100 rounded-md py-1`}>Listings</button>
                                <button onClick={handleEarning} className={`text-xl active:bg-gray-100 rounded-md py-1`}>Earnings</button>
                                <button onClick={() => { router.push("/host/review"); setDropDown(false)}} className={`text-xl active:bg-gray-100 rounded-md py-1`}>Reviews</button>
                                <button onClick={() => { router.push("/host/setting"); setDropDown(false)}} className={`text-xl active:bg-gray-100 rounded-md py-1`}>Setting</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}