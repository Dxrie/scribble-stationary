import connect from "@/app/lib/db";
import {getChangePasswordToken} from "@/app/lib/libs";
import UserModel from "@/app/lib/models/user";
import {sendResetPassEmail} from "@/app/utils/sendEmail";
import {validate} from "email-validator";
import {NextResponse} from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {email} = body;

    if (!validate(email))
      return NextResponse.json(
          {message: "Please use a valid email."},
          {status: 400}
      );

    await connect();

    const user = await UserModel.findOne({email: email});

    if (!user)
      return NextResponse.json(
        {
          message:
            "User with that email was not found, please make sure you typed the email correctly.",
        },
        {status: 400}
      );

    const data = await getChangePasswordToken();

    const changePasswordToken = data.changePasswordToken;
    const hashedChangePasswordToken = data.hashedChangePasswordToken;
    const changePasswordTokenExpire = data.changePasswordTokenExpire;

    user.changePasswordToken = hashedChangePasswordToken;
    user.changePasswordTokenExpire = changePasswordTokenExpire;

    await user.save();

    const changePasswordLink = `${process.env.NEXT_PUBLIC_URL}/password-reset?id=${user._id}&token=${changePasswordToken}`;

    await sendResetPassEmail(user.email, "Password Reset", changePasswordLink);

    return NextResponse.json({id: user._id}, {status: 200});
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log(err);
      return NextResponse.json(
        {message: "An error occured: " + err.message},
        {status: 500}
      );
    } else {
      return NextResponse.json({message: "An error occured: "}, {status: 500});
    }
  }
}
