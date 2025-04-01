import connect from "@/app/lib/db";
import UserModel from "@/app/lib/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, avatar } = body;

    if (!id)
      return NextResponse.json(
        { message: "Please provide all required fields." },
        { status: 400 },
      );

    await connect();

    const user = await UserModel.findById(id);

    if (!user)
      return NextResponse.json(
        { message: "User wasn't found" },
        { status: 404 },
      );

    if (!avatar) {
      user.avatar = null;
      await user.save();

      return NextResponse.json(user, { status: 201 });
    }

    const fd = new FormData();
    fd.append("image", avatar);
    fd.append("type", "base64");
    const response = await fetch("https://api.imgur.com/3/image", {
      method: "POST",
      headers: {
        Authorization: `Client-ID ${process.env.IMGUR_ID}`,
      },
      body: fd,
      redirect: "follow",
    });
    const data = await response.json();

    if (!response.ok)
      return NextResponse.json(
        { message: "Error while updating profile picture" },
        { status: 500 },
      );

    user.avatar = data.data.link;
    await user.save();

    return NextResponse.json(user, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
