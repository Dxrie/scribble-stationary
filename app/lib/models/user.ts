import {model, models, Schema, SchemaTypes} from "mongoose";

const CartItemSchema = new Schema({
    product: {
        type: SchemaTypes.ObjectId,
        ref: 'Product',
        required: true,
    },
    total: {
        type: Number,
        required: true,
        default: 1,
        min: 1,
    },
});

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
        },
        cart: {
            type: [CartItemSchema],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

const UserModel = models.User || model("User", UserSchema);

export default UserModel;
