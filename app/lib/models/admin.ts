import mongoose, { Schema, Document, models } from "mongoose";

interface IAdminSchema extends Document {
  username: string;
  identifier: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAdmin {
  username: string;
  identifier: string;
  createdAt: string;
  updatedAt: string;
  isAdmin: boolean;
}

const AdminSchema: Schema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    identifier: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  },
);

const AdminModel =
  models.Admin || mongoose.model<IAdminSchema>("Admin", AdminSchema);

export default AdminModel;
