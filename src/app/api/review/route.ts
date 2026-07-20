import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import ReviewModel from "@/models/Review";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: req.headers })
        if (!session) {
            return NextResponse.json({ message: "Unauthorized Users" }, { status: 400 });
        }
        const { comment, rating, listingId, bookingId } = await req.json();
        await dbConnect();
        const review = await ReviewModel.create({
            bookingId,
            listingId,
            reviewerId: session.session.userId,
            rating,
            comment
        })
        if (!review) {
            return NextResponse.json({ message: "Failed to create a review" }, { status: 400 });
        }
        return NextResponse.json({ status: 200 })
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { messaage: "Something went wrong in review" },
            { status: 500 }
        );
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: req.headers })
        if (!session) {
            return NextResponse.json({ message: "unauthorized Access" }, { status: 400 });
        }

        const { comment, rating, reviewId } = await req.json();
        if (!reviewId) {
            return NextResponse.json({ message: "Didn't get a review Id" }, { status: 400 });
        }
        if (rating > 5 && rating < 1) {
            return NextResponse.json({ message: "Please enter a valid rating" }, { status: 400 });
        }
        await dbConnect();
        const review = await ReviewModel.findOneAndUpdate(
            {
                _id: reviewId,
                reviewerId: session.session.userId
            },
            {
                comment,
                rating
            },
            {
                new: true,
                runValidators: true,
            }
        )

        if (!review) {
            return NextResponse.json({ message: "Not able to find the review" }, { status: 400 });
        }

        return NextResponse.json(review, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Unable to update the review" }, { status: 500 });
    }
}

export async function DELETE(req:NextRequest) {
    try {
        const session = await auth.api.getSession({headers: req.headers});
        if(!session){
            return NextResponse.json({ message: "unauthorized Access" }, { status: 400 });
        }

        const { reviewId } = await req.json();
        if(!reviewId){
            return NextResponse.json({ message: "Didn't get a review Id" }, { status: 400 });
        }

        await dbConnect();
        const review = await ReviewModel.findOneAndDelete({
            _id: reviewId,
            reviewerId: session.session.userId,
        })

        if(!review){
            return NextResponse.json({ message: "Not able to find the review" }, { status: 400 });
        }

        return NextResponse.json(review, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Unable to delete the review" }, { status: 500 });
    }
}