import { Schema, model, models, SchemaTypes } from "mongoose";
import {
  AddressSchema,
  CartItemSchema,
  IAddress,
  ICartItem,
} from "@/app/lib/models/user";

export interface ICheckout {
  _id: string;
  userId: string;
  products: [ICartItem];
  isProcessed: boolean;
  proofOfPayment: string;
  address: IAddress;
  createdAt: string;
}

const CheckoutSchema = new Schema(
  {
    userId: {
      type: SchemaTypes.ObjectId,
      ref: "User",
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
      type: AddressSchema,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const CheckoutModel = models.Checkout || model("Checkout", CheckoutSchema);

export default CheckoutModel;
