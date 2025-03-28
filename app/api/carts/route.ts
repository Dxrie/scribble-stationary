import {NextResponse} from "next/server";
import UserModel from "@/app/lib/models/user";
import connect from "@/app/lib/db";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {id} = body;

        await connect();

        const user = await UserModel.findById(id).populate("cart.product");

        if (!user) return NextResponse.json({message: "User with that id wasn't found"}, {status: 404});

        return NextResponse.json(user.cart, {status: 200});
    } catch (err: unknown) {
        if (err instanceof Error) {
            return NextResponse.json({message: "An error occured: " + err.message}, {status: 500});
        } else {
            return NextResponse.json({message: "An unexpected error occured."}, {status: 500});
        }
    }
}