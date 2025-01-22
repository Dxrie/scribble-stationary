import {Schema, model, models} from "mongoose";

const ProductSchema = new Schema(
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
    imageUrl: {
      type: String,
      required: true,
      validate: {
        validator: function (value: string) {
          return /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/.test(value); // Basic URL validation for image files
        },
        message: "Invalid image URL format.",
      },
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