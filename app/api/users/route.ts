import connect from "@/app/lib/db";
import UserModel from "@/app/lib/models/user";
import {NextResponse} from "next/server";

export async function GET() {
  try {
    await connect();

    const users = await UserModel.find();
    return NextResponse.json(users, {status: 200});
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({message: err.message}, {status: 500});
    }

    return NextResponse.json(
      {message: "An unexpected error occurred"},
      {status: 500}
    );
  }
}
