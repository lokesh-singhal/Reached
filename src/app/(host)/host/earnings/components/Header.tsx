'use client'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/app/components/ui/dropdown-menu";
import { addHours, addMonths, endOfMonth, startOfMonth, startOfYear } from "date-fns";
import { CalendarDays, ChevronDown } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function Header({ summary }:{ summary:any }) {
    const [custStart, setCustStart] = useState<string>("");
    const [custEnd, setCustEnd] = useState<string>("");
    const searchParams = useSearchParams();
    const router = useRouter();
    const getPeriod = searchParams.get("period");
    const [period, setPeriod] = useState(getPeriod);
    const params = new URLSearchParams(searchParams.toString());

    const handleThisMonth = async() => {
        const date = Date.now();
        const startDate = addHours(startOfMonth(date), 5.5);
        const endDate = addHours(endOfMonth(date), 5.5);
        setPeriod("This Month")
        params.set("period", "This Month");
        params.set("startDate", startDate.toISOString());
        params.set("endDate", endDate.toISOString());
        router.replace(`?${params.toString()}`);
    }

    const handleLastMonth = async() => {
        const date = Date.now();
        const startDate = addHours(addMonths(startOfMonth(date), -1), 5.5);
        const endDate = addHours(addMonths(endOfMonth(date), -1), 5.5);
        setPeriod("Last Month")
        params.set("period", "Last Month");
        params.set("startDate", startDate.toISOString());
        params.set("endDate", endDate.toISOString());
        router.replace(`?${params.toString()}`);
    }

    const handleLast3Month = () => {
        const date = Date.now();
        const startDate = addHours(addMonths(startOfMonth(date), -2), 5.5);
        const endDate = addHours(endOfMonth(date), 5.5);
        setPeriod("Last 3 Months")
        params.set("period", "Last 3 Months");
        params.set("startDate", startDate.toISOString());
        params.set("endDate", endDate.toISOString());
        router.replace(`?${params.toString()}`);
    }

    const handleThisYear = () => {
        const date = Date.now();
        const startDate = addHours(startOfYear(date), 5.5);
        const endDate = addHours(endOfMonth(date), 5.5);
        setPeriod("This Year")
        params.set("period", "This Year");
        params.set("startDate", startDate.toISOString());
        params.set("endDate", endDate.toISOString());
        router.replace(`?${params.toString()}`);
    }

    const handleSearch = () => {
        console.log(custStart);
        console.log(custEnd);
        if(!custStart || !custEnd){
            toast.error("Please enter valid dates", {
                style: {
                    backgroundColor: 'red',
                }
            });
            return;
        }

        if(new Date(custEnd) < new Date(custStart)){
            toast.error("Please enter valid dates", {
                style: {
                    backgroundColor: 'red',
                }
            });
            return;
        }
        setPeriod("Custom");
        router.replace(`/host/earnings?period=Custom&startDate=${new Date(custStart).toISOString()}&endDate=${new Date(custEnd).toISOString()}`);
    }
    return (
        <div>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Earnings
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Track your revenue, payouts, and financial performance.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row md:items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger render={
                            <button className="inline-flex h-10 items-center gap-2 rounded-lg border bg-background px-3 text-sm font-medium hover:bg-muted">
                                <CalendarDays className="h-4 w-4" />
                                {period}
                                <ChevronDown className="h-4 w-4" />
                            </button>
                        } />
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={handleThisMonth}>This Month</DropdownMenuItem>
                            <DropdownMenuItem onClick={handleLastMonth}>Last Month</DropdownMenuItem>
                            <DropdownMenuItem onClick={handleLast3Month}>Last 3 Month</DropdownMenuItem>
                            <DropdownMenuItem onClick={handleThisYear}>This Year</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <div className="flex flex-col sm:flex-row gap-2 max-sm:mb-2 sm:items-center">
                        <p>Custom:</p>
                        <input value={custStart} onChange={(e) => setCustStart(e.target.value)} className="outline-1 rounded-sm px-1" type="date" name="" id="" />
                        <p className="font-semibold text-xl">/</p>
                        <input value={custEnd} onChange={(e) => setCustEnd(e.target.value)} className="outline-1 rounded-sm px-1" type="date" name="" id="" />
                        <button onClick={handleSearch} className="border px-1">Search</button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <div className="rounded-xl border bg-background p-5">
                    <p className="text-sm text-muted-foreground">Gross revenue</p>

                    <div className="mt-2 flex items-end justify-between">
                        <h2 className="text-2xl font-semibold">₹{summary && summary.finance.grossInvoiced.toLocaleString("en-IN") || 0.00}</h2>
                    </div>

                    <p className="mt-2 text-xs text-muted-foreground">
                        Compared with last month
                    </p>
                </div>

                <div className="rounded-xl border bg-background p-5">
                    <p className="text-sm text-muted-foreground">Commission</p>

                    <div className="mt-2 flex items-end justify-between">
                        <h2 className="text-2xl font-semibold">₹{summary && summary.finance.commission.toLocaleString("en-IN") || 0.00}</h2>
                    </div>

                    <p className="mt-2 text-xs text-muted-foreground">
                        Reached platform commission
                    </p>
                </div>

                <div className="rounded-xl border bg-background p-5">
                    <p className="text-sm text-muted-foreground">Net earnings</p>

                    <div className="mt-2 flex items-end justify-between">
                        <h2 className="text-2xl font-semibold">₹{summary && (summary.finance.grossInvoiced - summary.finance.commission).toLocaleString("en-IN") || 0.00}</h2>
                    </div>

                    <p className="mt-2 text-xs text-muted-foreground">
                        After platform commission
                    </p>
                </div>
            </div>
        </div>
    )
}