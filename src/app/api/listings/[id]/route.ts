import { authClient } from "@/lib/auth-client";
import dbConnect from "@/lib/db";
import ListingService from "@/services/listing.service";
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

        const { data: session } = await authClient.getSession();
        const {id} = await params;

        if (!session) {
            return NextResponse.json({ message: "Unauthorized Access" }, { status: 400 });
        }

        const body = await req.json();
        const listing = await ListingService.updateListing(
            id,
            session.user.id,
            body
        )

        return NextResponse.json(listing, { status: 200 })
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Failed to update the listing" }, { status: 500 });
    }
}

export async function DELETE(_: NextRequest, { params }: Params) {
    try {
        await dbConnect();
        const { id } = await params;
        const { data: session } = await authClient.getSession();
        if (!session) {
            return NextResponse.json({ message: "Unauthorized Access" }, { status: 400 });
        }
        await ListingService.deleteListing(id, session.user.id);
        return NextResponse.json(
            { message: "Listing deleted successfully" },
            { status: 200 }
        );

    } catch (error: any) {
        return NextResponse.json(
            { message: error.message },
            { status: 403 }
        );
    }
}