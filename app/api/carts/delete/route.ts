import {NextResponse} from "next/server";
import UserModel from "@/app/lib/models/user";
import ProductModel from "@/app/lib/models/product";
import connect from "@/app/lib/db";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const {userId, productId} = body;

        if (!userId || !productId) return NextResponse.json({message: "Please provide all required fields"}, {status: 400});

        await connect();

        const product = await ProductModel.findById(productId);

        if (!product) {
            return NextResponse.json({message: "Product with that id wasn't found."}, {status: 404});
        }

        const user = await UserModel.findById(userId).populate("cart.product");

        if (!user) {
            return NextResponse.json({message: "User with that id wasn't found."}, {status: 404});
        }

        const cart = user.cart;
        const index = cart.findIndex((item: {product: {_id: string}; total: number}) => item.product._id.toString() === productId);

        cart.splice(index, 1);

        await user.save();

        return NextResponse.json(cart, {status: 201});
    } catch (err: unknown) {
        if (err instanceof Error) {
            return NextResponse.json({message: "An error occurred: " + err.message}, {status: 500});
        } else {
            return NextResponse.json({message: "An unknown error occurred."}, {status: 500});
        }
    }
}