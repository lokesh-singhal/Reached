'use client'
import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { TransactionDialog } from "./TransactionDialog";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/app/components/ui/dialog";

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

export default function RecentTransaction({ transactions }: { transactions: transactionProps[] }) {
    const [topTransaction, setTopTransaction] = useState<transactionProps[]>([]);

    useEffect(() => {
        setTopTransaction(transactions.slice(0, 5));
    }, [transactions])

    return (
        <div className="rounded-xl border bg-background w-full min-w-0">
            <div className="flex min-w-0 flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                <div className="min-w-0">
                    <h2 className="text-base font-semibold">Recent transactions</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Your latest booking earnings and payouts.
                    </p>
                </div>

                {transactions.length > 5 && (
                    <Dialog>
                        <DialogTrigger render={
                            <button className="shrink-0 text-sm font-medium text-primary hover:underline">
                                View all
                            </button>
                        } />
                        <DialogContent className="sm:max-w-7xl z-1001 overflow-auto max-h-[95vh]">
                            <DialogHeader>
                                <DialogTitle className={"text-2xl"}>All Transactions</DialogTitle>
                            </DialogHeader>
                            <TransactionDialog transactions={transactions} />
                        </DialogContent>
                    </Dialog>

                )}
            </div>

            <div className="w-full min-w-0 overflow-x-auto">
                <table className="w-full min-w-175 text-sm">
                    <thead>
                        <tr className="border-b text-left text-muted-foreground">
                            <th className="px-5 py-3 font-medium">Guest</th>
                            <th className="px-5 py-3 font-medium">Property</th>
                            <th className="px-5 py-3 font-medium">Date</th>
                            <th className="px-5 py-3 font-medium">Amount</th>
                            <th className="px-5 py-3 text-right font-medium">Status</th>
                        </tr>
                    </thead>
                    {topTransaction.length === 0 ? (
                        <tbody>
                            <tr>
                                <td className="p-4">
                                    No recent transaction to show
                                </td>
                            </tr>
                        </tbody>
                    ) : (
                        <tbody>
                            {topTransaction.map((transaction) => (
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

                                    <td className="px-5 py-4 text-right">
                                        <span
                                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium bg-green-100 text-green-700`}
                                        >
                                            PAID
                                        </span>
                                    </td>

                                    {/* <td className="px-5 py-4 text-right">
                                        <button className="text-muted-foreground hover:text-foreground">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </button>
                                    </td> */}
                                </tr>
                            ))}
                        </tbody>
                    )}

                </table>
            </div>
        </div>
    )
}