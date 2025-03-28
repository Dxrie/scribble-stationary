import connect from "@/app/lib/db";
import UserModel, {IAddress} from "@/app/lib/models/user";
import {NextResponse} from "next/server";

export async function POST(request: Request) {
  try {
    const {id, address} = await request.json();

    if (!id || !address)
      return NextResponse.json(
        {message: "Missing required fields"},
        {status: 400}
      );

    await connect();

    const user = await UserModel.findById(id);

    if (!user)
      return NextResponse.json({message: "User not found"}, {status: 404});

    const newAddress = user.address.find(
      (addr: IAddress) => addr.label === address.label
    );

    if (newAddress)
      return NextResponse.json(
        {message: "Address with that label already exists"},
        {status: 400}
      );

    user.address.push(address);

    await user.save();

    return NextResponse.json(
      {message: "Successfully added new address"},
      {status: 201}
    );
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({message: err.message}, {status: 500});
    } else {
      return NextResponse.json(
        {message: "An unknown error occurred"},
        {status: 500}
      );
    }
  }
}
