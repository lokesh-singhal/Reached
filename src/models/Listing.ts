import mongoose, {Schema, Document} from "mongoose";

interface GeoPoint {
    type: "Point",
    coordinates: [number, number]
}

export interface Listing extends Document{
    host: mongoose.Types.ObjectId,
    title: string,
    description: string,
    houseImageUrl: string[];
    address: string,
    city: string,
    state: string,
    location: GeoPoint,
    maxGuests: number,
    price: number,
    status: string,
}

const listingSchema = new Schema({
    host:{
        type: Schema.Types.ObjectId,
        ref: "AuthUser",
        required: true
    },

    title:{
        type: String,
        required: true,
        trim: true
    },

    description:{
        type: String
    },

    houseImageUrl:{
        type: [String],
        default: []
    },

    address:{
        type: String,
        required: true
    },

    city:{
        type: String,
        required: true
    },

    state:{
        type: String,
        required: true
    },

    location: {
        type:{
            type:String,
            enum:["Point"],
            default: "Point"
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },

    maxGuests:{
        type: Number,
        required: true,
        min: 1
    },

    price:{
        type: Number,
        required: true
    },

    status:{
        type: String,
        enum: ["ACTIVE", "INACTIVE"],
        default: "Active"
    },

}, {timestamps: true});

listingSchema.index({ location: "2dsphere" });

const ListingModel = (mongoose.models.Listing as mongoose.Model<Listing>) || mongoose.model<Listing>("Listing", listingSchema);

export default ListingModel;