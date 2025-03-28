import connect from "@/app/lib/db";
import UserModel from "@/app/lib/models/user";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {id} = body;

        if (!id) {
            return NextResponse.json({message: "Missing id."}, {status: 400});
        }

        await connect();

        const user = await UserModel.findById(id);

        if (!user) {
            return NextResponse.json({message: "User not found."}, {status: 404});
        }

        return NextResponse.json(user.address);
    } catch (err: unknown) {
        if (err instanceof Error) {
            return NextResponse.json({message: err.message}, {status: 500});
        } else {
            return NextResponse.json({message: "An unknown error occurred."}, {status: 500});
        }
    }
}