import mongoose, { Schema, Document } from "mongoose";

export interface Booking extends Document {
    user: mongoose.Types.ObjectId,
    listing: mongoose.Types.ObjectId,
    razorpay: string,
    checkIn: Date,
    checkOut: Date,
    status: "pending" | "confirmed" | "cancelled",
    totalPrice: number
}

const bookingSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "AuthUser",
        required: true
    },

    listing: {
        type: Schema.Types.ObjectId,
        ref: "Listing",
        required: true
    },

    razorpay: {
        type: String,
        required: true
    },

    checkIn: {
        type: Date,
        required: true
    },

    checkOut: {
        type: Date,
        required: true
    },

    status: {
        type: String,
        enum: ["PENDING", "CONFIRMED", "CANCELLED"],
        default: "PENDING",
        required: true
    },

    totalPrice: {
        type: Number,
        required: true
    },

})

const BookingModel = (mongoose.models.Booking as mongoose.Model<Booking>) || mongoose.model<Booking>("Booking", bookingSchema);

export default BookingModel;