import {model, models, Schema} from "mongoose";

const CategorySchema = new Schema(
  {
    categoryName: {
      type: String,
      required: true,
    },
    categoryImage: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const CategoryModel = models.Category || model("Category", CategorySchema);

export default CategoryModel;