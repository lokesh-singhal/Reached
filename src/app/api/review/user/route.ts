import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import ReviewModel from "@/models/Review";
import "@/models/Booking";
import "@/models/Listing"
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(req:NextRequest) {
    try {
        const session = await auth.api.getSession({headers: req.headers});
        if(!session){
            return NextResponse.json({message: "Unauthorized Access"}, {status: 400});
        }
    
        await dbConnect();
        const reviews = await ReviewModel.find({
            reviewerId: session.session.userId,
        }).populate("bookingId listingId");
    
        return NextResponse.json(reviews, {status: 200});
    } catch (error) {
        console.log(error);
        return NextResponse.json({message: "Failed to get reviews of the user"}, {status: 500});
    }
}