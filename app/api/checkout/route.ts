import {NextResponse} from "next/server";
import UserModel from "@/app/lib/models/user";
import CheckoutModel from "@/app/lib/models/checkout";
import connect from "@/app/lib/db";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {userId} = body;

        await connect();

        const user = await UserModel.findById(userId);

        if (!user) return NextResponse.json({message: "User with that id wasn't found."});

        const checkout = await CheckoutModel.find({userId: userId});
        return NextResponse.json(checkout, {status: 200});
    } catch (err: unknown) {
        if (err instanceof Error) {
            return NextResponse.json({message: err.message}, {status: 500});
        }
    }
}
