import connect from "@/app/lib/db";
import UserModel from "@/app/lib/models/user";
import {NextResponse} from "next/server";

export async function GET() {
  try {
    await connect();

    const users = await UserModel.find();
    return NextResponse.json(users, {status: 200});
  } catch (err: any) {
    return NextResponse.json({message: err.message}, {status: 500});
  }
}
