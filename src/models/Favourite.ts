import mongoose, {Schema, Document} from "mongoose";

export interface Favourite extends Document {
    listingId: mongoose.Types.ObjectId,
    userId: mongoose.Types.ObjectId,
}

const favouriteSchema = new Schema({
    listingId:{
        type: Schema.Types.ObjectId,
        ref: "Listing",
        required: true
    },

    userId: {
        type: Schema.Types.ObjectId,
        ref: "AuthUser",
        required: true
    },
}, {timestamps: true})

favouriteSchema.index({ userId: 1, listingId: 1 }, { unique: true });

const FavouriteModel = mongoose.models.Favourite as mongoose.Model<Favourite> || mongoose.model<Favourite>("Favourite", favouriteSchema);
export default FavouriteModel;