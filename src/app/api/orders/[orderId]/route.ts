import dbConnect from "@/lib/db";
import BookingModel from "@/models/Booking";
import { NextRequest, NextResponse } from "next/server";

interface Param {
    params: Promise<{orderId : string}>
}

export async function DELETE(_:NextRequest, { params }: Param) {
    try {
        const { orderId } = await params;
        await dbConnect();
        const booking = await BookingModel.findByIdAndDelete(orderId);
        if(!booking){
            return NextResponse.json({message: "Cannot find booking to delete"}, {status: 400});
        }
    
        return NextResponse.json({message: "Pending Booking deleted successfully"}, {status: 200});
    } catch (error) {
        console.log(error);
        return NextResponse.json({message: "Failed to delete pending booking"}, {status: 500});
    }


}