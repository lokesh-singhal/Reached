import dbConnect from "@/lib/db";
import ReviewModel from "@/models/Review";
import AuthUser from "@/models/AuthUser";
import { NextRequest, NextResponse } from "next/server";


interface Params {
    params: Promise<{ id : string }>
}

export async function GET(_:NextRequest, { params }: Params) {
    try {
        const { id } = await params;
        await dbConnect();
        const reviews = await ReviewModel.find({listingId: id}).populate("reviewerId");
        if(!reviews){
            return NextResponse.json({message: "Cannot find reviews for this listingId"}, {status: 400});
        }

        return NextResponse.json(reviews, {status: 200});

    } catch (error) {
        console.log(error);
        return NextResponse.json({message: "Server Error occur while getting the reviews of this listing"}, {status: 500});
    }
}