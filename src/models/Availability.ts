import mongoose, {Schema, Document} from "mongoose";

export interface Availability extends Document {
    listing: mongoose.Types.ObjectId,
    date: Date
    isAvailable: boolean,
    priceOverride: number
}

const availabilitySchema = new Schema({
    listing:{
        type: Schema.Types.ObjectId,
        ref: "Listing",
        required: true
    },

    checkIn:{
        type: Date,
        required: true
    },

    checkOut:{
        type: Date,
        required: true
    },

    isAvailable:{
        type: Boolean,
        default: true,
    },

    priceOverride:{
        type: Number
    }
}, {timestamps: true})

availabilitySchema.index({ listing: 1, checkIn: 1, checkOut: 1 }, { unique: true });
const AvailabilityModel = (mongoose.models.Availability as mongoose.Model<Availability>) || mongoose.model<Availability>("Availability", availabilitySchema);

export default AvailabilityModel;