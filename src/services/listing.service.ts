import ListingModel from "@/models/Listing";
import "@/models/AuthUser";
import mongoose from "mongoose";

interface createListingInput {
    hostId: string,
    title: string,
    description?: string,
    houseImageUrl: string[];
    address: string,
    city: string,
    state: string,
    location: {
        type: "Point";
        coordinates: [number, number];
    };
    maxGuests: number,
    price: number,
}

class ListingService {
    static async createListing(data: createListingInput) {
        const listing = await ListingModel.create({
            host: data.hostId,
            title: data.title,
            description: data.description,
            houseImageUrl: data.houseImageUrl,
            address: data.address,
            city: data.city,
            state: data.state,
            location: data.location,
            maxGuests: data.maxGuests,
            price: data.price,
            status: "ACTIVE"
        });

        return listing;
    }

    static async getAllListing() {
        const listing = await ListingModel
            .find()
            .populate("host", "name email")
            .sort({ createdAt: -1 })

        return listing;
    }

    static async getListingById(listingId: string) {
        if (!mongoose.Types.ObjectId.isValid(listingId)) {
            throw new Error("Invalid Listing id");
        }

        const listing = await ListingModel
            .findById(listingId)
            .populate("host", "name email");

        if (!listing) {
            throw new Error("No listing available")
        }

        return listing;
    }

    static async updateListing(listingId: string, hostId: string, updates: Partial<createListingInput>) {
        const listing = await ListingModel.findById(listingId);

        if (!listing) {
            throw new Error("Listing does not exist");
        }

        Object.assign(listing, updates);
        await listing.save();

        return listing;
    }

    static async deleteListing(listingId: string, hostId: string) {
        const listing = await ListingModel.findById(listingId);

        if (!listing) {
            throw new Error("Listing does not exist");
        }

        listing.status = "INACTIVE";
        await listing.save();

        return { success: true };

    }
}

export default ListingService;