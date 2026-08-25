'use client'
import { format, parseISO } from "date-fns";
import { useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";


interface Props {
    _id: string,
    grossRevenue: number,
    earning: number,
    booking: number
}

export default function RevenuePage({ data }: { data: Props[] }) {
    const [category, setCategory] = useState("earning")
    return (
        <div className="rounded-xl border bg-background p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-base font-semibold">Revenue overview</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Your earnings over the selected period.
                    </p>
                </div>

                <div className="w-full overflow-x-auto sm:w-auto">
                    <div className="flex w-max items-center rounded-lg border p-1">
                        <button onClick={() => setCategory("earning")} className={`rounded-md px-3 ${category === "earning" ? "bg-muted": "text-muted-foreground hover:text-foreground"} py-1.5 text-xs font-medium`}>
                            Net earnings
                        </button>

                        <button onClick={() => setCategory("grossRevenue")} className={`rounded-md ${category === "grossRevenue" ? "bg-muted": "text-muted-foreground hover:text-foreground"} px-3 py-1.5 text-xs font-medium`}>
                            Gross revenue
                        </button>

                        <button onClick={() => setCategory("booking")} className={`rounded-md ${category === "booking" ? "bg-muted": "text-muted-foreground hover:text-foreground"} px-3 py-1.5 text-xs font-medium`}>
                            Bookings
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-6 h-80 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%" minHeight={1} minWidth={1}>
                    <AreaChart data={data}>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                        />

                        <XAxis
                            dataKey="_id"
                            axisLine={false}
                            tickLine={false}
                            tickMargin={10}
                            minTickGap={20}
                            tickFormatter={(value) => format(parseISO(value), "MMM dd")}
                        />

                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            allowDecimals={false}
                            tickFormatter={(value) => `${category === "booking" ? value : `₹${value / 1000}k`}`}
                        />

                        <Tooltip
                            formatter={(value) => [`${category === "booking" ? value : `₹${value}`}`, category]}
                        />

                        <Area
                            type="monotone"
                            dataKey={category}
                            strokeWidth={2}
                            fillOpacity={0.12}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}