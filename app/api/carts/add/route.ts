import {NextResponse} from "next/server";
import ProductModel from "@/app/lib/models/product";
import UserModel from "@/app/lib/models/user";
import {Types} from "mongoose";
import connect from "@/app/lib/db";

export async function POST(request: Request) {
    try {
        await connect();

        const body = await request.json();
        const {userId, itemId, total} = body;

        const product = await ProductModel.findById(itemId);

        if (!product) {
            return NextResponse.json({message: "Product not found"}, {status: 404});
        }

        const user = await UserModel.findById(userId);

        if (!user) {
            return NextResponse.json({message: "User not found"}, {status: 404});
        }

        const existingCartItem = user.cart.find((item: {
            product: Types.ObjectId;
            total: number
        }) => item.product.toString() === itemId);

        if (existingCartItem) {
            if (total) {
                existingCartItem.total += total;
            } else {
                existingCartItem.total += 1;
            }
        } else {
            user.cart.push({product: itemId, total: total ? total : 1});
        }

        await user.save();

        const updatedUser = await UserModel.findById(userId).populate("cart.product");

        return NextResponse.json({
            message: "Product added to cart",
            cart: updatedUser?.cart
        }, {status: 201});
    } catch (err: unknown) {
        if (err instanceof Error) {
            return NextResponse.json({message: "An error occured: " + err.message}, {status: 500});
        } else {
            return NextResponse.json({message: "An error unexpected occured."}, {status: 500});
        }
    }
}