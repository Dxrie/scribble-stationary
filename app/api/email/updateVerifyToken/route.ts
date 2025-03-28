import {NextResponse} from "next/server";
import connect from "@/app/lib/db";
import UserModel from "@/app/lib/models/user";
import {getVerificationToken} from "@/app/lib/libs";
import {sendEmail} from "@/app/utils/sendEmail";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {id} = body;

        if (!id) return NextResponse.json({message: "Please provide all required fields"}, {status: 400});

        await connect();

        const user = await UserModel.findById(id);

        if (!user) return NextResponse.json({message: "User with that id doesn't exist."}, {status: 404});

        if (user.isVerified) return NextResponse.json({message: "User has already been verified"}, {status: 400});

        if (new Date(user.verifyTokenExpire) > new Date()) return NextResponse.json({message: "Verification token is still valid"}, {status: 400});

        const data = await getVerificationToken();

        const verifyToken = data.hashedVerificationToken;
        const verifyTokenExpire = data.verifyTokenExpire;

        user.verifyToken = verifyToken;
        user.verifyTokenExpire = verifyTokenExpire;

        await user.save();

        const verificationLink = `${process.env.NEXT_PUBLIC_URL}/verifyEmail?verifyToken=${data.verificationToken}&id=${user._id}`;
        await sendEmail(user.email, "Email Verification", verificationLink);

        return NextResponse.json({message: "Success"}, {status: 201});
    } catch (err: unknown) {
        if (err instanceof Error) {
            return NextResponse.json({message: "An error occurred: " + err.message}, {status: 500});
        } else {
            return NextResponse.json({message: "An unknown error occurred."}, {status: 500})
        }
    }
}