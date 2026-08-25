import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import ListingModel from "@/models/Listing";
import DashboardService from "@/services/host/dashboard.service";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

const now = new Date();

const startOfMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    1
);

const endOfMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59,
    999
);

export async function GET(req: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: req.headers });
        if (!session) {
            return NextResponse.json({ message: "Unauthorized Access" }, { status: 400 });
        }

        await dbConnect();

        const listing = await ListingModel.aggregate([
            {
                $match: {
                    host: new mongoose.Types.ObjectId(session.session.userId)
                }
            },
            {
                $lookup: {
                    from: "reviews",
                    foreignField: "listingId",
                    localField: "_id",
                    as: "review",
                }
            },
            {
                $lookup: {
                    from: "bookings",
                    foreignField: "listing",
                    localField: "_id",
                    as: "booking",
                }
            },
            {
                $addFields: {
                    totalBookings: {
                        $size: "$booking"
                    },
                    totalIncome: {
                        $sum: "$booking.totalPrice"
                    },
                    totalReviews: {
                        $size: "$review",
                    },
                    averageRating: {
                        $cond: {
                            if: { $gt: [{ $size: "$review" }, 0] },
                            then: { $round: [{ $avg: "$review.rating" }, 1] },
                            else: 0
                        }
                    }
                }
            },
            {
                $sort: {
                    "totalBookings": -1,
                }
            }
        ])


        const incomeByMonth = await DashboardService.getIncomeByMonth(session.session.userId);

        return NextResponse.json({ listing, incomeByMonth }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Failed to get the host listing" }, { status: 500 });
    }
}