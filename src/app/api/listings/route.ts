import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import ListingModel from "@/models/Listing";
import ListingService from "@/services/listing.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        await dbConnect();

        // const listing = await ListingService.getAllListing();
        const listing = await ListingModel.aggregate([
            {
                $lookup: {
                    from: "reviews",
                    localField:"_id",
                    foreignField: "listingId",
                    as: "reviews",
                    
                }
            },
            {
                $addFields:{
                    reviewCount: {$size: "$reviews"},
                    averageRating: {
                        $round:[
                            {
                                $ifNull: [
                                    { $avg: "$reviews.rating"},
                                    0
                                ]
                            },
                            1
                        ]
                    },
                }
            }
        ]);
        
        return NextResponse.json(listing, {status: 200});
    } catch (error) {
        console.log(error);
        return NextResponse.json({message: "Failed to load listing"}, {status: 500});
    }
}

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const session = await auth.api.getSession({ headers: req.headers });

        if(!session){
            return NextResponse.json({message: "Unauthorized Access in listing"}, {status: 400});
        }

        const body = await req.json();

        const listing = await ListingService.createListing({
            hostId: session.session.userId,
            ...body
        })

        return NextResponse.json(listing, {status: 200})

    } catch (error) {
        console.log(error);
        return NextResponse.json({message: "Failed to create listing"}, {status: 500});
    }
}