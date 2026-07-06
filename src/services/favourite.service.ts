import FavouriteModel from "@/models/Favourite";
import mongoose from "mongoose";

interface favouriteInput {
    listingId: string;
    userId: string;
}
class FavouriteService {
    static async toggleFavourite(data: favouriteInput) {
        const favourite = await FavouriteModel.exists(data);

        if (favourite) {
            await FavouriteModel.deleteOne(data);
            return { liked: false };
        }

        await FavouriteModel.create(data);
        return { liked: true };
    }

    static async getFavourite(userId: string) {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new Error("Invalid userId")
        }

        const favourite = await FavouriteModel.find({
            userId
        })
        .populate("listingId");

        return favourite;
    }

    static async deleteFavourite(userId: string, listingId: string) {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new Error("Invalid userId")
        }

        await FavouriteModel.findOneAndDelete({
            userId,
            listingId
        });

        return { success: true };
    }
}

export default FavouriteService;