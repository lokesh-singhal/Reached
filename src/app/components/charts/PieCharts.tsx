"use client"

import { TrendingUp } from "lucide-react"
import { LabelList, Pie, PieChart } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/app/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/app/components/ui/chart"
import { Piedra } from "next/font/google"


interface Data {
    title: string,
    income: number
}

const colors = [
    "#ef4444",
    "#3b82f6",
    "#22c55e",
    "#f59e0b",
    "#a855f7",
    "#000000"
];


export function ChartPie({ data }: { data: Data[] | undefined }) {
    const chartConfig1 = (data ?? []).reduce((acc, item, index) => {
        if (index < 5) {
            acc[item.title] = {
                label: item.title,
                color: colors[index % colors.length],
            };
        } else if (index == 5) {
            acc["Other"] = {
                label: "Other",
                color: colors[index],
            }
        }
        else {
            return acc;
        }
        return acc;
    }, {} as ChartConfig);

    const pieData = (() => {
        if (!data) return [];

        const sorted = [...data].sort((a, b) => b.income - a.income);

        const topFive = sorted.slice(0, 5).map((item, index) => ({
            ...item,
            fill: colors[index],
        }));

        const otherIncome = sorted
            .slice(5)
            .reduce((sum, item) => sum + item.income, 0);

        if (otherIncome > 0) {
            topFive.push({
                title: "Other",
                income: otherIncome,
                fill: colors[5],
            });
        }

        return topFive;
    })();
    return (
        <div className="grid md:grid-cols-2 items-center">
            <div className="">
                <ChartContainer
                    config={chartConfig1}
                    className="mx-auto [&_.recharts-text]:fill-background"
                >
                    <PieChart>
                        <ChartTooltip
                            content={<ChartTooltipContent nameKey="title" hideLabel />}
                        />
                        <Pie data={pieData} dataKey="income">
                            <LabelList
                                dataKey="title"
                                className="fill-background max-md:hidden"
                                stroke="none"
                                fontSize={15}
                                formatter={(item) => item?.toString().split(" ")[0]}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </div>
            <div>
                {pieData.map((item) => (
                    <div className="flex items-center justify-between max-md:text-sm">
                        <div className="flex items-center gap-2">
                            <div style={{ background: item.fill }} className={`w-4 h-4`}></div>
                            <span className="max-md:text-sm">{item.title}</span>
                        </div>
                        <div className="max-md-text-sm">
                            ₹{" "}{item.income}
                        </div>
                    </div>
                ))}
            </div>
        </div>

    )
}
