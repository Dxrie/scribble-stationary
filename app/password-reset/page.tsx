"use client";
import Link from "next/link";
import {useCallback, useState} from "react";

export default function PasswordReset() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const resetPassword = useCallback(async () => {
    if (isLoading) return;

    if (email) {
      try {
        const response = await fetch("/api/users/login", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email
          }),
        });
      } catch (err: unknown) {}
    }
  }, [email, isLoading]);

  return (
    <>
      <div className="w-full h-[100dvh] font-poppins flex flex-col justify-center gap-5 bg-gradient-to-r from-[#264653] to-[#E76F51]">
        <span className="flex justify-center items-center gap-3">
          <img
            alt="logo"
            src="favicon.ico"
            draggable={false}
            height={50}
            width={50}
          />
          <h1 className="text-center text-white text-3xl font-bold">
            Scribble{" "}
          </h1>
        </span>
        <form
          method="post"
          className="bg-white mx-auto w-[90%] sm:w-[40%] py-6 pb-10 rounded-xl shadow-2xl flex flex-col items-center text-black gap-4"
        >
          <h1 className="text-2xl font-semibold">Reset your password</h1>
          <p className="text-center px-10 mb-[2em]">
            Enter the email address linked to your Scribble account and we'll
            send you an email.
          </p>
          <input
            name="email"
            className="w-[90%] py-3 px-3 rounded-xl border-black border drop-shadow-xl focus:outline-none text-black"
            type="email"
            placeholder="Email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            type="button"
            className="hover:bg-slate-900 w-[90%] py-3 px-3 rounded-3xl border-black border-1 drop-shadow-xl focus:outline-none text-white bg-black font-semibold cursor-pointer"
          >
            Send Link
          </button>

          <div className="flex flex-col items-center gap-2">
            <Link
              href={"/login"}
              className="text-[#2A9D8F] underline underline-offset-2"
            >
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}
