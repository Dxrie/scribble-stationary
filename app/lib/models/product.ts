import {Schema, model, models} from "mongoose";

export interface IProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: "Notebooks & Journals" | "Pens & Pencils" | "Art Supplies" | "Office Supplies" | 
    "Paper Products" | "Planners & Organizers" | "Desk Accessories" | "Markers & Highlighters" | 
    "Adhesives & Tapes" | "Craft Supplies" | "Other";
  image: string;
  isAvailable: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Notebooks & Journals",
        "Pens & Pencils",
        "Art Supplies",
        "Office Supplies",
        "Paper Products",
        "Planners & Organizers",
        "Desk Accessories",
        "Markers & Highlighters",
        "Adhesives & Tapes",
        "Craft Supplies",
        "Other",
      ],
    },
    image: {
      type: String,
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const ProductModel = models.Product || model("Product", ProductSchema);

export default ProductModel;
