import dbConnect from "@/lib/db";
import BookingModel from "@/models/Booking";
import { NextRequest, NextResponse } from "next/server";

interface Params {
    params: Promise<{ id: string }>;
}

export async function GET(_: NextRequest, { params }: Params) {
    try {
        const {id} = await params;
        await dbConnect();

        const reservations = await BookingModel.find({listing: id});
        console.log(reservations);
        
        const reservedDates = reservations.map((booking) => ({
            from: booking.checkIn,
            to: booking.checkOut
        }));
        console.log(reservedDates);

        return NextResponse.json(reservedDates);
    } catch (error) {
        
    }
}