'use client'
import RevenuePage from "./components/RevenuePage";
import PropertyEarning from "./components/PropertyEarning";
import RecentTransaction from "./components/RecentTransaction";
import Header from "./components/Header";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface PropertyProps {
    _id: string,
    title: string, 
    income: number, 
    bookings: number,
    grossRevenue: number,
    commission: number,
    location: string,
}

interface transactionProps {
    _id: string,
    checkIn: string,
    listing: {
        title: string,
    },
    user: {
        name: string,
    }
    totalPrice: number,
    razorpay: string,
    createdAt: string
}

export default function Earnings() {
    const searchParams = useSearchParams();
    const [periodData, setPeriodData] = useState([]);
    const [propertySummary, setPropertySummary] = useState<PropertyProps[]>([]);
    const [transaction, setTransaction] = useState<transactionProps[]>([])
    const [summary, setSummary] = useState();
    const getData = async(period:string, startDate: string | null, endDate: string | null) => {
        const res = await fetch(`/api/host/earning?period=${period}&startDate=${startDate}&endDate=${endDate}`);
        const data = await res.json();
        if(!res.ok){
            toast.message(data.message, {
                style: {
                    backgroundColor: 'red',
                }
            })

            return;
        }

        setPeriodData(data.currentSummary);
        setSummary(data.summary[0]);
        setPropertySummary(data.propertySummary);
        setTransaction(data.transaction);
    }
    useEffect(() => {
        const startDate = searchParams.get("startDate");
        const endDate = searchParams.get("endDate");
        if(!startDate || !endDate){
            return;
        }
        const period = searchParams.get("period");
        getData(period!, startDate, endDate);
    },[searchParams])
    return (
        <div className="p-4 max-w-390 mx-auto w-full min-w-0 min-h-0 flex-1">
            <div className="space-y-6">
                <Header summary={summary} />
                <RevenuePage data={periodData}  />
                <PropertyEarning propertySummary={propertySummary} />
                <RecentTransaction transactions={transaction} />
            </div>
        </div>
    )
}