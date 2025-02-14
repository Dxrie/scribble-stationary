import {NextResponse} from "next/server";
import connect from "@/app/lib/db";
import UserModel from "@/app/lib/models/user";
import ProductModel from "@/app/lib/models/product";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {total, productId, userId} = body;

        if (!(total && productId && userId)) return NextResponse.json({message: "Please provide all required fields"}, {status: 400});

        await connect();

        const user = await UserModel.findById(userId).populate("cart.product");

        if (!user) return NextResponse.json({message: "User with that id wasn't found"}, {status: 404});

        const product = await ProductModel.findById(productId);
        const cartItem = user.cart.find((item: {product: {_id: string}; total: number}) => item.product._id.toString() === productId);

        if (!product) {
            return NextResponse.json({message: "Product with that id wasn't found"}, {status: 404});
        }

        if (!cartItem) {
            return NextResponse.json({message: "Product with that id wasn't found in the cart"}, {status: 404});
        }

        cartItem.total = total;

        await user.save();

        return NextResponse.json(user.cart, {status: 201});
    } catch (err: unknown) {
        if (err instanceof Error) {
            return NextResponse.json({message: "An unknown error occured: " + err.message}, {status: 500});
        } else {
            return NextResponse.json({message: "An unknown error occured."}, {status: 500});
        }
    }
}