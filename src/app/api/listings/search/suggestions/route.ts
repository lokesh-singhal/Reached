import dbConnect from "@/lib/db";
import ListingModel from "@/models/Listing";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req:NextRequest) {
    try {
        const location = req.nextUrl.searchParams.get("city");
        
        await dbConnect();
        const places = await ListingModel.aggregate([
            {
                $match:{
                    $or:[
                        {city: {$regex: location, $options: "i"}},
                        {address: {$regex: location, $options: "i"}},
                        {state: {$regex: location, $options: "i"}},
                    ]
                }
            },
            {
                $group:{
                    _id: "$city",
                }
            }
        ])

        return NextResponse.json(places, {status: 200});
    } catch (error) {
        console.log(error);
        return NextResponse.json({message: "Cannot search the listing"}, {status: 500});
    }
}