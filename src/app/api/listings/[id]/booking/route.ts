import { auth } from "@/lib/auth";
import BookingModel from "@/models/Booking";
import { NextRequest, NextResponse } from "next/server";

interface Params {
    params: Promise<{id: string}>
}

export async function GET(req:NextRequest, { params }: Params) {
    try {
        const session = await auth.api.getSession({headers: req.headers});
        if(!session){
            return NextResponse.json({message: "Unauthorized Access"}, {status: 400});
        }
        
        const { id } = await params;

        const booking = await BookingModel.find({
            listing: id,
        }).populate("user");

        if(!booking){
            return NextResponse.json({message: "No booking for this listing"}, {status: 400})
        }

        return NextResponse.json(booking, {status: 200});

    } catch (error) {
        console.log(error);
        return NextResponse.json({message: "Failed to get bookings for this listing due to internal error"}, {status: 500})
    }
}