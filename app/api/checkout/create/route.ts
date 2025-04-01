import {NextResponse} from "next/server";
import connect from "@/app/lib/db";
import UserModel from "@/app/lib/models/user";
import ProductModel from "@/app/lib/models/product";
import CheckoutModel from "@/app/lib/models/checkout";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {userId, products, proofOfPayment, address} = body;

        if (!userId || !products || !proofOfPayment || !address)
            return NextResponse.json({message: "Please provide all the required fields."}, {status: 400});

        await connect();

        const user = await UserModel.findById(userId);

        if (!user) return NextResponse.json({message: "User with that id was not found."}, {status: 404});

        const productIds = products.map((product: { product: string }) => product.product);
        const matchingProduct = await ProductModel.find({_id: {$in: productIds}});

        if (productIds.length !== matchingProduct.length)
            return NextResponse.json({message: "One of the product that you want to checkout doesn't exist."}, {status: 400});

        const fd = new FormData();
        fd.append("image", proofOfPayment);
        fd.append("type", "base64");

        const response = await fetch("https://api.imgur.com/3/image", {
            method: "POST",
            headers: {
                Authorization: `Client-ID ${process.env.IMGUR_ID}`,
            },
            body: fd,
            redirect: "follow",
        });

        const imgurResponse = await response.json();

        if (!response.ok) {
            return NextResponse.json({message: "Something's wrong we cannot place your order please try again."}, {status: 500});
        }

        const checkout = new CheckoutModel({
            userId,
            products,
            proofOfPayment: imgurResponse.data.link,
            address,
        });

        await checkout.save();

        await UserModel.findByIdAndUpdate(userId, {
            $pull: {
                cart: { product: { $in: productIds } },
            },
        });

        return NextResponse.json({message: "Order successfully placed, please wait for our admin to confirm your purchase."}, {status: 201});
    } catch (err: unknown) {
        if (err instanceof Error) {
            return NextResponse.json({message: err.message}, {status: 500});
        } else {
            return NextResponse.json({message: "An unknown error occurred."}, {status: 500});
        }
    }
}

// TODO: Fix bug checkout
// TODO: Lanjutkan checkout