import mongoose, {Schema, Document} from "mongoose";

export interface Review extends Document {
    listingId: mongoose.Types.ObjectId,
    reviewerId: mongoose.Types.ObjectId,
    bookingId: mongoose.Types.ObjectId,
    rating: number,
    comment: string
}

const reviewSchema = new Schema({
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      unique: true
    },

    listingId:{
        type: Schema.Types.ObjectId,
        ref: "Listing",
        required: true
    },

    reviewerId: {
        type: Schema.Types.ObjectId,
        ref: "AuthUser",
        required: true
    },

    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },

    comment: {
        type: String
    }
}, {timestamps: true})

const ReviewModel = mongoose.models.Review as mongoose.Model<Review> || mongoose.model<Review>("Review", reviewSchema);
export default ReviewModel;

