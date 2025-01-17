import {jwtVerify, SignJWT} from "jose";
import crypto from "crypto";

const secretKey = "scribble";
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({alg: "HS256"})
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
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
