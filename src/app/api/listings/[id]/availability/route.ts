import dbConnect from "@/lib/db";
import BookingModel from "@/models/Booking";
import { NextRequest, NextResponse } from "next/server";


interface Params {
    params: Promise<{ id : string }>
}
export async function POST(req :NextRequest, {params}: Params) {
    try {
        dbConnect();
        const { id } = await params;
        const { checkInDate, checkOutDate, maxGuests } = await req.json();
        
        if(!checkInDate || !checkOutDate || maxGuests){
            return NextResponse.json({message: "These fields are required"}, {status: 400});
        }
    
        const requestedCheckIn = new Date(checkInDate);
        const requestedCheckOut = new Date(checkOutDate);
    
        const booking = await BookingModel.findOne({
            listing: id,
            checkIn: {$lt: requestedCheckOut},
            checkOut: {$gt: requestedCheckIn}
        })
    
        return NextResponse.json({
            available: !booking,
        })
    } catch (error) {
        console.log(error);
        return NextResponse.json({message: "Cannot check the availability"}, {status: 500})
    }
}