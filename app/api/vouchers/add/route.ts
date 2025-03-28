import connect from "@/app/lib/db";
import VoucherModel from "@/app/lib/models/voucher";
import {NextResponse} from "next/server";

function generateVoucherCode(): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters[randomIndex];
  }
  return code;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      voucherName,
      voucherExpiration,
      discountType,
      discountPercentage,
      minOrderValue,
    } = body;

    if (
      !voucherName ||
      !voucherExpiration ||
      !discountType ||
      !discountPercentage ||
      !minOrderValue
    ) {
      return NextResponse.json(
        {message: "Please provide all required fields"},
        {status: 400}
      );
    }

    if (discountType !== "price" && discountType !== "delivery") {
      return NextResponse.json(
        {message: "Invalid discount type"},
        {status: 400}
      );
    }

    await connect();

    const voucher = new VoucherModel({
      voucherName,
      voucherExpiration,
      discountType,
      discountPercentage,
      minOrderValue,
      voucherCode: generateVoucherCode(),
    });

    await voucher.save();

    return NextResponse.json(voucher, {status: 201});
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({message: err.message}, {status: 500});
    } else {
      return NextResponse.json(
        {message: "An unknown error occurred."},
        {status: 500}
      );
    }
  }
}
