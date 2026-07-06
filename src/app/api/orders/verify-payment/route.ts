import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/db";
import BookingModel from "@/models/Booking";

export async function POST(req: NextRequest) {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();
        const generatedSignature = crypto
        .createHmac(
          "sha256",
          process.env.RAZORPAY_KEY_SECRET!
        )
        .update(
          `${razorpay_order_id}|${razorpay_payment_id}`
        )
        .digest("hex");
    
        const isValid = generatedSignature === razorpay_signature;
        console.log(isValid);
        if(!isValid) {
            return NextResponse.json({message: "Invalid razorpay payment"}, {status: 400});
        }

        dbConnect();
        await BookingModel.findOneAndUpdate(
            {razorpay: razorpay_order_id},
            {status: "CONFIRMED"}
        )

        return NextResponse.json({success: true});
    } catch (error) {
        console.log(error);
        return NextResponse.json({message: "Failure while verifying razorpay signatures"}, {status: 500})
    }
}