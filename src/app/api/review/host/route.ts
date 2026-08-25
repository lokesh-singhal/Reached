import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import ReviewModel from "@/models/Review";
import "@/models/AuthUser"
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: req.headers });
        if (!session) {
            return NextResponse.json({ message: "Unauthorized Access" }, { status: 400 });
        }

        await dbConnect();
        const reviews = await ReviewModel.aggregate([
            {
                $lookup: {
                    from: "listings",
                    localField: "listingId",
                    foreignField: "_id",
                    as: "listing"
                }
            },
            {
                $unwind: "$listing"
            },
            {
                $match: {
                    "listing.host": new mongoose.Types.ObjectId(session.session.userId),
                }
            },
            {
                $lookup: {
                    from: "user",
                    localField: "reviewerId",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $unwind: "$user"
            },
            {
                $lookup: {
                    from: "bookings",
                    localField: "bookingId",
                    foreignField: "_id",
                    as: "booking",
                }
            },
            {
                $unwind: "$booking"
            },
            {
                $project: {
                    _id: 1,
                    rating: 1,
                    comment: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    "user.name": 1,
                    "listing._id": 1,
                    "listing.title": 1,
                    "booking.checkIn": 1,
                    "booking.checkOut": 1
                }
            }
        ])

        return NextResponse.json(reviews, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Failed to get reviews of the user" }, { status: 500 });
    }
}