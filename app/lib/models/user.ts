import { model, models, Schema, SchemaTypes } from "mongoose";
import { IProduct } from "./product";

export interface ICartItem {
  _id: string;
  product: IProduct;
  total: number;
}

export const CartItemSchema = new Schema({
  product: {
    type: SchemaTypes.ObjectId,
    ref: "Product",
    required: true,
  },
  total: {
    type: Number,
    required: true,
    default: 1,
    min: 1,
  },
});

export const AddressSchema = new Schema({
  label: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  streetAddress: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  province: {
    type: String,
    required: true,
  },
  postalCode: {
    type: String,
    required: true,
  },
});

export interface IAddress {
  _id: string;
  label: string;
  fullName: string;
  phoneNumber: string;
  streetAddress: string;
  city: string;
  province: string;
  postalCode: string;
}

export interface IUser {
  _id: string;
  email: string;
  username: string;
  isVerified: boolean;
  changePasswordTokenExpire: Date | null;
  verifyTokenExpire: Date | null;
  createdAt: Date;
  updatedAt: Date;
  address: [IAddress];
  avatar: string | undefined;
}

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    avatar: {
      type: String,
      default: undefined,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifyToken: {
      type: String,
      default: null,
    },
    verifyTokenExpire: {
      type: Date,
      default: null,
    },
    changePasswordToken: {
      type: String,
      default: null,
    },
    changePasswordTokenExpire: {
      type: Date,
      default: null,
    },
    cart: {
      type: [CartItemSchema],
      default: [],
    },
    address: {
      type: [AddressSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

const UserModel = models.User || model("User", UserSchema);

export default UserModel;
