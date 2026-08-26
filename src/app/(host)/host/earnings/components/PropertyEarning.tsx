'use client'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/app/components/ui/dialog";
import { useEffect, useState } from "react"
import PropertyDialog from "./PropertyDialog";

interface PropertyProps {
    _id: string,
    title: string,
    income: number,
    bookings: number,
    grossRevenue: number,
    commission: number,
    location: string
}

export default function PropertyEarning({ propertySummary }: { propertySummary: PropertyProps[] }) {
    const [topEarnings, setTopEarnings] = useState<PropertyProps[]>();

    useEffect(() => {
        setTopEarnings(propertySummary.slice(0, 5));
    }, [propertySummary])

    return (
        <div className="rounded-xl border bg-background">
            <div className="flex items-center justify-between border-b p-5">
                <div>
                    <h2 className="text-base font-semibold">Earnings by property</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        See how each property is contributing to your earnings.
                    </p>
                </div>

                {propertySummary && propertySummary.length > 5 && (
                    <Dialog>
                        <DialogTrigger render={
                            <button className="text-sm font-medium text-primary hover:underline">
                                View all
                            </button>
                        } />
                        <DialogContent className="sm:max-w-7xl z-1010 overflow-auto max-h-[95vh]">
                            <DialogHeader>
                                <DialogTitle className={"text-2xl"}>All earning by properties</DialogTitle>
                            </DialogHeader>
                            <PropertyDialog earnings={propertySummary} />
                        </DialogContent>
                    </Dialog>
                )}
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b text-left text-muted-foreground">
                            <th className="px-5 py-3 font-medium">Property</th>
                            <th className="px-5 py-3 font-medium">Bookings</th>
                            <th className="px-5 py-3 font-medium">Gross revenue</th>
                            <th className="px-5 py-3 font-medium">Commission</th>
                            <th className="px-5 py-3 text-right font-medium">
                                Net earnings
                            </th>
                        </tr>
                    </thead>

                    {topEarnings && topEarnings.length === 0 ? (
                        <tbody>
                            <tr>
                                <td className="p-4">
                                    No listing earning to show
                                </td>
                            </tr>
                        </tbody>
                    ) : (
                        <tbody>
                            {topEarnings && topEarnings.map((property) => (
                                <tr
                                    key={property._id}
                                    className="border-b last:border-0 hover:bg-muted/40"
                                >
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div>
                                                <p className="font-medium">{property.title}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {property.location}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-5 py-4">
                                        {property.bookings}
                                    </td>

                                    <td className="px-5 py-4">
                                        ₹{property.grossRevenue.toLocaleString("en-IN")}
                                    </td>

                                    <td className="px-5 py-4 text-muted-foreground">
                                        ₹{property.commission.toLocaleString("en-IN")}
                                    </td>

                                    <td className="px-5 py-4 text-right font-medium">
                                        ₹{property.income.toLocaleString("en-IN")}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    )}
                </table>
            </div>
        </div>
    )
}