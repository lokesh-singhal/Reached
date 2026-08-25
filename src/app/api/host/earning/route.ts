import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import ListingModel from "@/models/Listing";
import DashboardService from "@/services/host/dashboard.service";
import { addDays, addHours, endOfMonth, startOfMonth } from "date-fns";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const startDate = searchParams.get("startDate");
        const endDate = searchParams.get("endDate");
        const start = startDate ? startDate : addHours(startOfMonth(new Date()), 5.50);
        const end = endDate ? endDate: addHours(endOfMonth(new Date()), 5.50);
        const session = await auth.api.getSession({ headers: req.headers });

        if(end < start){
            return NextResponse.json({message: "Enter valid dates"}, {status: 400});
        }

        if(!session){
            return NextResponse.json({message: "Unauthorized Access"}, {status: 400});
        }

        await dbConnect();
        const { summary } = await DashboardService.getSummary(new Date(start), new Date(end), session.session.userId);
        const currentSummary = await DashboardService.getGroupSummary(new Date(start), new Date(end), session.session.userId);
        const propertySummary = await DashboardService.getIncomebyProperty(new Date(start), new Date(end), session.session.userId);
        const transaction = await DashboardService.getTransaction(new Date(start), new Date(end), session.session.userId);

        return NextResponse.json({summary, currentSummary, propertySummary, transaction}, {status: 200});
    } catch (error) {
        console.log(error);
        return NextResponse.json({message: "Error"});
    }
}