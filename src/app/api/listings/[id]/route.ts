import { auth } from "@/lib/auth";
import { authClient } from "@/lib/auth-client";
import dbConnect from "@/lib/db";
import BookingModel from "@/models/Booking";
import ListingService from "@/services/listing.service";
import { apiKey } from "better-auth/plugins";
import { NextRequest, NextResponse } from "next/server";

interface Params {
    params: Promise<{ id: string }>;
}

export async function GET(_: NextRequest, { params }: Params) {
    try {
        await dbConnect();
        const {id} = await params;
        const listing = await ListingService.getListingById(id);

        return NextResponse.json(listing, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Failed to fetch the listing with id" }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest, { params }: Params) {
    try {
        await dbConnect();

        const session = await auth.api.getSession({headers: req.headers});
        const {id} = await params;

        if (!session) {
            return NextResponse.json({ message: "Unauthorized Access" }, { status: 400 });
        }

        const body = await req.json();
        const listing = await ListingService.updateListing(
            id,
            session.session.userId,
            body
        )

        return NextResponse.json(listing, { status: 200 })
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Failed to update the listing" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: Params) {
    try {
        await dbConnect();
        const { id } = await params;
        const session = await auth.api.getSession({headers: req.headers});
        if (!session) {
            return NextResponse.json({ message: "Unauthorized Access" }, { status: 400 });
        }

        const bookings = await BookingModel.exists({
            listing: id,
            checkOut: {
                $gte: Date.now(),
            }
        });
        if(bookings){
            return NextResponse.json({message: "Listing cannot be deleted due to active bookings"}, {status: 400});
        }

        await ListingService.deleteListing(id, session.session.userId);
        return NextResponse.json(
            { message: "Listing deleted successfully" },
            { status: 200 }
        );

    } catch (error: any) {
        console.log(error);
        return NextResponse.json(
            { message: error.message },
            { status: 500 }
        );
    }
}