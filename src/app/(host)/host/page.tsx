import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import ListingModel from "@/models/Listing";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
    const session = await auth.api.getSession({headers: await headers()});
    if(!session){
        redirect("/sign-in");
    }

    await dbConnect();
    const listing = await ListingModel.findOne({
        host: session.session.userId,
    }).select("_id");

    console.log("listing", listing);
    if(!listing){
        redirect("/host/listing/add");
    }

    redirect("/host/dashboard");
}