import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import ReviewModel from "@/models/Review";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: req.headers})
        if(!session) {
            return NextResponse.json({message: "Unauthorized Users"}, {status: 400});
        }
        const {comment, rating, listingId, bookingId} = await req.json();
        await dbConnect();
        const review = await ReviewModel.create({
            bookingId,
            listingId,
            reviewerId: session.session.userId,
            rating,
            comment
        })
        if(!review){
            return NextResponse.json({message: "Failed to create a review"}, {status: 400});
        }
        return NextResponse.json({status: 200})
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { messaage: "Something went wrong in review" },
            { status: 500 }
        );
    }
}