"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/app/components/ui/chart"

interface Data {
    title: string,
    value: number,
}
const monthVal = {
   0: "Jan" ,
  1: "Feb" ,
   2: "Mar",
  3: "Apr",
  4: "May",
   5: "Jun",
   6: "Jul",
  7: "Aug",
   8: "Sep",
   9: "Oct",
   10: "Nov",
  11: "Dec",
}

const chartConfig = {
  income: {
    label: "Income",
    color: "#2563eb",
  },
} satisfies ChartConfig

const months = [" ","Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

interface Set {
    _id: {
        month: number,
        year: number,
    },
    income: number,
    bookings: number
}

export function ChartBar({data}:{data:Set[] | undefined}) {
  const chartData = data?.map((item) => ({
        ...item,
        month: months[item._id.month],
    }));
  return (
    <ChartContainer config={chartConfig} className="">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={true} />
        <XAxis
          dataKey="month"
          tickLine={true}
          tickMargin={10}
          axisLine={true}
        //   tickFormatter={(value) => value.split(" ")[0]}
        />
        <YAxis
          dataKey="income"
          tickLine={true}
          tickMargin={10}
          axisLine={true}
        //   tickFormatter={(value) => value.split(" ")[0]}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="income" name="Income" fill="var(--color-income)" radius={4} />
      </BarChart>
    </ChartContainer>
  )
}
