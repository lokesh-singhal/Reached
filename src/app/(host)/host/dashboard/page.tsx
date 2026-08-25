'use client'
import { ChartBar } from "@/app/components/charts/BarCharts";
import { ChartLine } from "@/app/components/charts/LineChart";
import { ChartPie } from "@/app/components/charts/PieCharts";
import OverviewCards from "@/app/components/OverViewCards";
import { ChartColumn, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Data {
    title: string,
    income: number
}

interface Set {
    _id: {
        month: number,
        year: number,
    },
    income: number,
    bookings: number
}

export default function Dashboard() {
    const [stats, setStats] = useState();
    const [listingCount, setListingCount] = useState();
    const [propertyIncome, setPropertyIncome] = useState<Data[]>();
    const [bookingByMonth, setBookingByMonth] = useState<Set[]>();
    const [incomeByMonth, setIncomeByMonth] = useState<Set[]>();
    useEffect(() => {
        const getS = async () => {
            const res = await fetch(`/api/host/dashboard`);
            const data = await res.json();
            console.log(data);
            if(!res.ok){
                toast.error(data.message, {
                    style: {
                        backgroundColor: 'red',
                    }
                })

                return;
            }
            setStats(data.summary[0]);
            setListingCount(data.listingCounts);
            setPropertyIncome(data.propertySummary);
            setIncomeByMonth(data.incomeByMonth);
            setBookingByMonth(data.bookingByMonths);
            console.log(data);
        }

        getS();
    }, [])

    return (
        <div className="p-4 lg:px-20">
            <div className="gap-5 flex flex-col">
                <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold pt-3">Dashboard</div>
                    <button className="border-2 px-2 bg-gray-100">This Month</button>
                </div>
                <OverviewCards stats={stats} listingCount={listingCount} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="bg-gray-200 p-6 md:text-xl font-semibold">
                        <div className="flex gap-2 mb-4">
                            <ChartColumn />
                            <h1 className="max-md:text-sm">Total net income by month</h1> 
                        </div>
                        <ChartBar data={incomeByMonth} />
                    </div>
                    <div className="bg-gray-200 p-6 text-xl font-semibold">
                        <div  className="flex gap-2 mb-4">
                            <TrendingUp />
                            <h1 className="max-md:text-sm">Total booking by month</h1>
                        </div>
                        <ChartLine data={bookingByMonth} />
                    </div>
                    <div className="md:col-span-2 p-6 bg-gray-200">
                        <div className="text-sm md:text-xl font-semibold">
                            Income distribution by property
                        </div>
                        <div className="">
                            <ChartPie data={propertyIncome} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}