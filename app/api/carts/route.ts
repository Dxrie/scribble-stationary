import connect from "@/app/lib/db";
import ProductModel from "@/app/lib/models/product";
import UserModel from "@/app/lib/models/user";
import {NextResponse} from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {userId, item} = body;
    await connect();

    const user = await UserModel.findById(userId);

    if (!user)
      return NextResponse.json(
        {message: "User with that id wasn't found."},
        {status: 400}
      );

    if (!user.cart.includes(item)) {
      const product = await ProductModel.findById(item._id);

      if (!product)
        return NextResponse.json(
          {message: "That product doesn't exist."},
          {status: 404}
        );

      user.cart.push(item);

      await user.save();

      return NextResponse.json(user, {status: 201});
    }
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
