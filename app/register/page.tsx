"use client";
import { createHash } from "crypto";
import Link from "next/link";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { showSwal } from "../lib/libs";
import { useRouter } from "next/navigation";
import Transition from "../components/Transition";
import API_KEY from "@/apiKey";
import { UserContext } from "@/app/context/UserContext";

export default function Register() {
  const router = useRouter();
  const userContext = useContext(UserContext);

  if (!userContext) {
    throw new Error("UserContext must be used within a user context");
  }

  const { user } = userContext;

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const register = useCallback(async () => {
    if (isLoading) return;

    if (
      typeof formData.password === "string" &&
      typeof formData.confirmPassword === "string"
    ) {
      if (
        formData.email.trim() !== "" &&
        formData.username.trim() !== "" &&
        formData.password.trim() !== "" &&
        formData.confirmPassword.trim() !== ""
      ) {
        if (formData.password === formData.confirmPassword) {
          try {
            setIsLoading(true);

            const response = await fetch("/api/users/create", {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "x-api-key": `${API_KEY}`,
              },
              body: JSON.stringify({
                email: formData.email,
                username: formData.username,
                password: formData.password,
              }),
            });

            if (response.ok) {
              showSwal(
                "Info",
                "Thank you for signing up to Scribble, please verify your email account.",
                "info",
              );
              router.push("/login");
            } else {
              const errorData = await response.json();
              showSwal("Error", errorData.message, "error");
            }
          } catch (err: unknown) {
            if (err instanceof Error) {
              console.log(err.message);
              showSwal("Error", err.message, "error");
            } else {
              console.log("An error occured.");
            }
          } finally {
            setIsLoading(false);
          }
        } else {
          showSwal("Error", "Your password doesn't match", "error");
        }
      } else {
        showSwal("Error", "Please input a valid credential", "error");
      }
    }
  }, [formData, isLoading, router]);

  return (
    <Transition>
      <div className="w-full h-[100dvh] font-poppins flex flex-col justify-center gap-5 bg-primary">
        <span className="flex justify-center items-center gap-3">
          <img
            alt="logo"
            src="favicon.ico"
            draggable={false}
            width={50}
            height={50}
          />
          <h1 className="text-center text-white text-3xl font-bold">
            Scribble{" "}
          </h1>
        </span>
        <form
          autoComplete="off"
          className="bg-white mx-auto w-[90%] sm:w-[40%] py-6 pb-10 rounded-3xl shadow-2xl flex flex-col items-center text-black gap-4"
        >
          <h1 className="text-2xl font-semibold">Register</h1>
          <input
            name="username"
            className="w-[90%] py-3 px-3 rounded-xl border-black border drop-shadow-xl focus:outline-none text-black"
            type="text"
            placeholder="Username"
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            required
          />
          <input
            name="email"
            className="w-[90%] py-3 px-3 rounded-xl border-black border drop-shadow-xl focus:outline-none text-black"
            type="email"
            placeholder="Email"
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
          <input
            name="password"
            className="w-[90%] py-3 px-3 rounded-xl border-black border drop-shadow-xl focus:outline-none text-black"
            type="password"
            placeholder="Password"
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />
          <input
            name="confirmPassword"
            className="w-[90%] py-3 px-3 rounded-xl border-black border drop-shadow-xl focus:outline-none text-black"
            type="password"
            placeholder="Confirm Password"
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
            required
          />
          <button
            onClick={register}
            type="button"
            className="hover:bg-slate-900 w-[90%] py-3 px-3 rounded-3xl border-black border-1 drop-shadow-xl focus:outline-none text-white bg-black font-semibold cursor-pointer"
            disabled={isLoading}
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
          <p>
            Have an account?{" "}
            <Link
              href={"/login"}
              className="text-[#2A9D8F] underline underline-offset-2"
            >
              Login here
            </Link>
          </p>
        </form>
      </div>
    </Transition>
  );
}
