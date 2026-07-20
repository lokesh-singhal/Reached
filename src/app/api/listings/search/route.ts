import BookingModel from "@/models/Booking";
import ListingModel from "@/models/Listing";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const destination = searchParams.get("city");
        const checkIn = searchParams.get("checkIn");
        const checkOut = searchParams.get("checkOut");
        const guests = searchParams.get("guests");

        const search = destination ? destination : "";
        const reqCheckIn = checkIn && checkIn === undefined ? new Date(checkIn) : "";
        const reqCheckOut = checkOut && checkOut === undefined ? new Date(checkOut) : "";
        const reqGuest = guests && guests === undefined ? Number(guests) : 0;

        const conflictBooking = await BookingModel.find({
            checkIn: { $lt: reqCheckOut },
            checkOut: { $gt: reqCheckIn }
        }).select("listing");


        const bookedListingIds = conflictBooking.map(bookings => bookings.listing);
        const listing = await ListingModel.aggregate([
            {
                $match: {
                    _id: { $nin: bookedListingIds },
                    maxGuests: { $gte: reqGuest },
                    $or: [
                        { city: { $regex: search, $options: "i" } },
                        { address: { $regex: search, $options: "i" } },
                        { state: { $regex: search, $options: "i" } }
                    ],
                },
            },
            {
                $lookup: {
                    from: "reviews",
                    localField: "_id",
                    foreignField: "listingId",
                    as: "reviews",

                }
            },
            {
                $addFields: {
                    reviewCount: { $size: "$reviews" },
                    averageRating: {
                        $round: [
                            {
                                $ifNull: [
                                    { $avg: "$reviews.rating" },
                                    0
                                ]
                            },
                            1
                        ]
                    },
                }
            },
            {
                $project: {
                    reviews: 0,
                },
            },
        ])
        return NextResponse.json(listing, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Cannot find filtered listing" }, { status: 500 });
    }
}