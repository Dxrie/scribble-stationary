import connect from "@/app/lib/db";
import UserModel from "@/app/lib/models/user";
import {NextResponse} from "next/server";

export async function GET(request: Request) {
  try {
    const body = await request.json();
    const {userId} = body;

    await connect();

    const user = await UserModel.findById(userId);

    if (!user)
      return NextResponse.json(
        {message: "User with that id wasn't found."},
        {status: 400}
      );

    return NextResponse.json(user.cart);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json(
        {message: "An error occured: " + err.message},
        {status: 500}
      );
    } else {
      return NextResponse.json({message: "An error occured"}, {status: 500});
    }
  }
}
