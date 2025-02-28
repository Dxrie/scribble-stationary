import {Schema, model, models, SchemaTypes} from "mongoose";
import {CartItemSchema} from "@/app/lib/models/user";

const CheckoutSchema = new Schema(
    {
        userId: {
            type: SchemaTypes.ObjectId,
            ref: 'User',
            required: true,
        },
        products: {
            type: [CartItemSchema],
            required: true,
        },
        isProcessed: {
            type: Boolean,
            default: false,
        },
        proofOfPayment: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

const CheckoutModel = models.Checkout || model("Checkout", CheckoutSchema);

export default CheckoutModel;
