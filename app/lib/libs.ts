import {JWTPayload, jwtVerify, SignJWT} from "jose";
import crypto from "crypto";
import Swal, {SweetAlertIcon} from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const secretKey = process.env.NEXT_PUBLIC_JWT_SECRET as string;
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: JWTPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({alg: "HS256"})
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(key);
}

export async function decrypt(input: string): Promise<JWTPayload> {
  try {
    const {payload} = await jwtVerify(input, key, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (err) {
    console.error("JWT verification failed:", err);
    throw new Error("Invalid or expired token");
  }
}

export async function getVerificationToken() {
  const verificationToken = crypto.randomBytes(20).toString("hex");
  const hashedVerificationToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");

  const verifyTokenExpire = new Date(Date.now() + 30 * 60 * 1000);

  return {verificationToken, hashedVerificationToken, verifyTokenExpire};
}

export async function getChangePasswordToken() {
  const changePasswordToken = crypto.randomBytes(25).toString("hex");
  const hashedChangePasswordToken = crypto
    .createHash("sha256")
    .update(changePasswordToken)
    .digest("hex");

  const changePasswordTokenExpire = new Date(Date.now() + 30 * 60 * 1000);

  return {
    changePasswordToken,
    hashedChangePasswordToken,
    changePasswordTokenExpire,
  };
}

export function showSwal(title: string, text: string, icon: SweetAlertIcon) {
  withReactContent(Swal).fire({
    title,
    text,
    icon,
    timerProgressBar: true,
    timer: 5000,
  });
}

export function swalConfirm(title: string, text: string, icon: SweetAlertIcon, buttons: string[]) {
  return withReactContent(Swal).fire({
    title,
    text,
    icon,
    confirmButtonText: buttons[0],
    denyButtonText: buttons[1],
    showConfirmButton: true,
    showDenyButton: true,
    showCloseButton: false,
    allowOutsideClick: false,
    allowEscapeKey: false,
  });
}

export function getBase64(file: File): Promise<string | ArrayBuffer | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

export const x = [
  "Notebooks & Journals",
  "Pens & Pencils",
  "Art Supplies",
  "Office Supplies",
  "Paper Products",
  "Planners & Organizers",
  "Desk Accessories",
  "Markers & Highlighters",
  "Adhesives & Tapes",
  "Craft Supplies",
  "Other",
];

export interface IProduct {
  _id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  stock: number;
  category: string;
  isAvailable: boolean;
}

export interface ICart {
  product: IProduct;
  total: number;
}

export const formatToCurrency = (number: number | undefined) => {
  return number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};
