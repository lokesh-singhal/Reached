import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import FavouriteService from "@/services/favourite.service";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
    await dbConnect();
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.session?.userId) {
       return NextResponse.json([], {status: 200});
    }
    const userId = session?.session.userId;

    const listings = await FavouriteService.getFavourite(userId);

    return NextResponse.json(listings);
}

export async function POST(req: NextRequest) {
    await dbConnect();
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.session?.userId) {
        return NextResponse.json({status: 200});
    }

    const {listingId} = await req.json();
    const result = await FavouriteService.toggleFavourite({
        listingId,
        userId: session.session.userId
    })

    return NextResponse.json(result);
}