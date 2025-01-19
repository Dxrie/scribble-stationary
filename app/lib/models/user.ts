import {Schema, model, models} from "mongoose";

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
    passwordHash: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
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
    }
  },
  {
    timestamps: true,
  }
);

const UserModel = models.User || model("User", UserSchema);

export default UserModel;
