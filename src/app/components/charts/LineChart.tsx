"use client"

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/app/components/ui/chart"


interface Set {
    _id: {
        month: number,
        year: number,
    },
    income: number,
    bookings: number
}

const months = [" ", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const chartConfig = {
    bookings: {
        label: "Bookings",
        color: "#2563eb",
    },
} satisfies ChartConfig

export function ChartLine({ data }: { data: Set[] | undefined }) {
    const chartData = data?.map((item) => ({
        ...item,
        month: months[item._id.month],
    }));
    return (
        <ChartContainer config={chartConfig}>
            <LineChart
                accessibilityLayer
                data={chartData}
                margin={{
                    left: 12,
                    right: 12,
                }}
            >
                <CartesianGrid vertical={true} />
                <XAxis
                    dataKey="month"
                    tickLine={true}
                    axisLine={true}
                    tickMargin={8}
                //   tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis
                    dataKey="bookings"
                    tickLine={true}
                    axisLine={true}
                    tickMargin={8}
                //   tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                />
                <Line
                    dataKey="bookings"
                    name="Bookings"
                    type="linear"
                    stroke="var(--color-bookings)"
                    strokeWidth={2}
                    dot={true}
                />
                <ChartLegend  content={<ChartLegendContent />} />
            </LineChart>
        </ChartContainer>

    )
}
