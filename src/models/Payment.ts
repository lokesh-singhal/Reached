import mongoose, {Schema, Document} from "mongoose";

export interface Payment extends Document {
    booking: mongoose.Types.ObjectId,
    providerPaymentId: string,
    amount: number,
    status: ("success" | "failed" | "refunded")
}

const paymentSchema = new Schema({
    booking:{
        type: Schema.Types.ObjectId,
        ref: "Booking",
        required: true
    },

    providerPaymentId:{
        type: String,
        required: true
    },

    amount:{
        type: Number,
        required: true
    },

    status:{
        type: String,
        enum: ["success", "failed", "refunded"]
    }


}, {timestamps: true})

const PaymentModel = (mongoose.models.Payment as mongoose.Model<Payment>) || mongoose.model<Payment>("Payment", paymentSchema);

export default PaymentModel;