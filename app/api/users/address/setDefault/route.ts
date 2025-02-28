import connect from "@/app/lib/db";
import UserModel, {IAddress} from "@/app/lib/models/user";
import {NextResponse} from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {address, id} = body;

    await connect();

    const user = await UserModel.findById(id);

    if (!user)
      return NextResponse.json(
        {message: "User with that id doesn't exist"},
        {status: 404}
      );

    const addressIndex = user.address.findIndex(
      (addr: IAddress) => addr._id.toString() === address
    );

    if (addressIndex === -1) {
      return NextResponse.json(
        {message: "Address doesn't exist in user's address list."},
        {status: 404}
      );
    }

    user.address.forEach((addr: any) => {
      addr.isDefault = false;
    });

    user.address[addressIndex].isDefault = true;
    await user.save();
    return NextResponse.json(
      {message: "Address has been set to default."},
      {status: 201}
    );
  } catch (err: unknown) {
    if (err instanceof Error) {
      return Response.json(
        {
          message: err.message,
        },
        {status: 500}
      );
    } else {
      return Response.json(
        {
          message: "An unknown error occurred.",
        },
        {status: 500}
      );
    }
  }
}
