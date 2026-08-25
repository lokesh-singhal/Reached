'use client'
import { Button } from "@/app/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/app/components/ui/dialog"
import { Input } from "@/app/components/ui/input"
import { format } from "date-fns"
import { MoreHorizontal } from "lucide-react"
import { useEffect, useState } from "react"

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

export function TransactionDialog({ transactions }: { transactions: transactionProps[] }) {
    
    return (
        <div className="flex items-center gap-2 overflow-auto h-full">
            <div className="grid flex-1 gap-2">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b text-left text-muted-foreground">
                                <th className="px-5 py-3 font-medium">Guest</th>
                                <th className="px-5 py-3 font-medium">Property</th>
                                <th className="px-5 py-3 font-medium">Date</th>
                                <th className="px-5 py-3 font-medium">Amount</th>
                                <th className="px-5 py-3 font-medium">Status</th>
                                <th className="px-5 py-3"></th>
                            </tr>
                        </thead>
                        {transactions.length === 0 ? (
                            <tbody>
                                <tr>
                                    <td className="p-4">
                                        No recent transaction to show
                                    </td>
                                </tr>
                            </tbody>
                        ) : (
                            <tbody>
                                {transactions.map((transaction) => (
                                    <tr
                                        key={transaction._id}
                                        className="border-b last:border-0 hover:bg-muted/40"
                                    >

                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div>
                                                    <p className="font-medium">
                                                        {transaction.user.name}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        #{transaction.razorpay}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>


                                        <td className="px-5 py-4">
                                            {transaction.listing.title}
                                        </td>

                                        {/* Date */}
                                        <td className="px-5 py-4 text-muted-foreground">
                                            {format(transaction.createdAt, "MMM dd yyyy")}
                                        </td>


                                        <td className="px-5 py-4">
                                            <p className="font-medium">
                                                ₹{(transaction.totalPrice * 0.87).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2, })}
                                            </p>

                                            <p className="text-xs text-muted-foreground">
                                                Gross ₹{transaction.totalPrice.toLocaleString("en-IN")}
                                            </p>
                                        </td>

                                        <td className="px-5 py-4">
                                            <span
                                                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium bg-green-100 text-green-700`}
                                            >
                                                PAID
                                            </span>
                                        </td>

                                        <td className="px-5 py-4 text-right">
                                            <button className="text-muted-foreground hover:text-foreground">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        )}

                    </table>
                </div>
            </div>
        </div>
    )
}
