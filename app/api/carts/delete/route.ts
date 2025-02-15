import {NextResponse} from "next/server";
import UserModel from "@/app/lib/models/user";
import ProductModel from "@/app/lib/models/product";

export async function POST(request: Request) {
    const body = await request.json();

    const {userId, productId} = body;

    if (!userId || !productId) return NextResponse.json({message: "Please provide all required fields"}, {status: 400});

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
}