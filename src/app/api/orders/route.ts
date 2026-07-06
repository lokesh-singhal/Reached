import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import BookingModel from "@/models/Booking";
import ListingModel from "@/models/Listing";
import "@/models/AuthUser";
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import ReviewModel from "@/models/Review";
import mongoose from "mongoose";
import UserModel from "@/models/User";
import AuthUser from "@/models/AuthUser";


const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

export async function GET(req: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: req.headers });
        if (!session) {
            return NextResponse.json({ message: "unauthorized Access" }, { status: 400 });
        }

        await dbConnect();
        const getReviews = await ReviewModel.find({reviewerId:session.session.userId});
        console.log(getReviews);
        const reservations = await BookingModel.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(session.session.userId)
                }
            },
            {
                $lookup: {
                    from: "user",
                    localField: "user",
                    foreignField: "_id",
                    as: "user",
                }
            },
            {
                $unwind: "$user"
            },
            {
                $lookup: {
                    from: "listings",
                    localField: "listing",
                    foreignField: "_id",
                    as: "listing"
                }
            },
            {
                $unwind: "$listing"
            },
            {
                $lookup: {
                    from: "reviews",
                    localField: "_id",
                    foreignField: "bookingId",
                    as: "reviews"
                }
            },

            {
                $addFields: {
                    isReviewed: { $gt: [{ $size: "$reviews" }, 0] }
                }
            }
        ]);
        console.log(reservations);
        return NextResponse.json(reservations);
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { messaage: "Something went wrong on getting reservations" },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: req.headers });
        if (!session) {
            return NextResponse.json({ message: "Unauthorized Access" }, { status: 400 });
        }

        await dbConnect();
        const { listingId, checkIn, checkOut, guests } = await req.json();
        const checkOutDate = new Date(checkOut);
        const checkInDate = new Date(checkIn);

        const listing = await ListingModel.findById(listingId);
        if (!listing) {
            return NextResponse.json({ message: "Incorrect Listing Id" }, { status: 400 });
        }

        const previousReservation = await BookingModel.find({
            listing: listingId,
            checkIn: {$lt: checkOutDate},
            checkOut: {$gt: checkInDate}
        });

        if(previousReservation){
            return NextResponse.json({message: "Already available booking for this date"}, {status: 400});
        }

        const Listingprice = listing.price;
        const nights = (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24);
        const price = Listingprice * nights;
        const totalPrice = price + (nights * 155);

        const order = await razorpay.orders.create({
            amount: totalPrice * 100,
            currency: "INR",
            receipt: `receipt-${Date.now()}`,
            notes: {
                listingId,
            }
        })

        const newBooking = await BookingModel.create({
            user: session.session.userId,
            listing: listingId,
            razorpay: order.id,
            checkIn,
            checkOut,
            status: "PENDING",
            totalPrice,
        });

        return NextResponse.json({
            order: order.id,
            amount: order.amount,
            currency: order.currency,
            bookingId: newBooking._id
        })

    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { messaage: "Something went wrong while creating razorpay order" },
            { status: 500 }
        );
    }
}