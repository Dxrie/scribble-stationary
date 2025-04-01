"use client";
import Link from "next/link";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { encrypt, showSwal, swalConfirm } from "../lib/libs";
import { setCookie } from "cookies-next/client";
import { useRouter } from "next/navigation";
import Transition from "../components/Transition";
import API_KEY from "@/apiKey";
import { UserContext } from "@/app/context/UserContext";

export default function Login() {
  const router = useRouter();
  const userContext = useContext(UserContext);

  if (!userContext) {
    throw new Error("UserContext must be used within a user context");
  }

  const { user, setUser } = userContext;

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async () => {
    if (isLoading) return;

    if (typeof formData.password === "string") {
      if (formData.username.trim() !== "" && formData.password.trim() !== "") {
        try {
          setIsLoading(true);

          const response = await fetch("/api/users/login", {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "x-api-key": `${API_KEY}`,
            },
            body: JSON.stringify({
              username: formData.username,
              password: formData.password,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            const expires = new Date(Date.now() + 60 * 60 * 1000 * 24);

            if (data.isAdmin) {
              console.log("Admin user logged in");

              const adminSession = await encrypt({ data, expires });

              setCookie("session", adminSession, {
                expires,
                path: "/",
                sameSite: "lax",
              });
              setUser(data);

              router.push("/admin/dashboard");
              return;
            }

            if (
              !data.isVerified &&
              new Date(data.verifyTokenExpire) > new Date()
            ) {
              return showSwal(
                "Error",
                "Please check your email inbox to verify your account before logging in.",
                "error",
              );
            }

            if (
              !data.isVerified &&
              new Date(data.verifyTokenExpire) <= new Date()
            ) {
              const response = await swalConfirm(
                "Error",
                "Your verification token has expired, do you want to create a new one?",
                "error",
                ["Yes", "No"],
              );

              if (response.isConfirmed) {
                const response = await fetch("/api/email/updateVerifyToken", {
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "x-api-key": `${API_KEY}`,
                  },
                  method: "POST",
                  body: JSON.stringify({
                    id: data._id.toString(),
                  }),
                });

                if (!response.ok) {
                  const errorData = await response.json();

                  return showSwal(
                    "Error",
                    "An error occurred while creating a new verification token: " +
                      errorData.message,
                    "error",
                  );
                }
              } else {
                return showSwal("Error", "Login cancelled.", "error");
              }
            }

            const session = await encrypt({ data, expires });

            setCookie("session", session, {
              expires,
              path: "/",
              sameSite: "lax",
            });
            setUser(data);
          } else {
            const errorData = await response.json();
            showSwal("Error", errorData.message, "error");
          }
        } catch (err: unknown) {
          if (err instanceof Error) {
            console.log(err);
            showSwal("Error", "An error occured: " + err.message, "error");
          } else {
            console.log("An error occured.");
          }
        } finally {
          setIsLoading(false);
        }
      } else {
        showSwal("Error", "Please input a valid credential", "error");
      }
    }
  }, [formData.password, formData.username, isLoading, router, setUser]);

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
          className="bg-white mx-auto w-[90%] sm:w-[40%] py-6 pb-10 rounded-xl shadow-2xl flex flex-col items-center text-black gap-4"
        >
          <h1 className="text-2xl font-semibold">Login</h1>
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
            name="password"
            className="w-[90%] py-3 px-3 rounded-xl border-black border drop-shadow-xl focus:outline-none text-black"
            type="password"
            placeholder="Password"
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />
          <button
            onClick={login}
            type="button"
            className="hover:bg-slate-900 w-[90%] py-3 px-3 rounded-3xl border-black border-1 drop-shadow-xl focus:outline-none text-white bg-black font-semibold cursor-pointer"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>

          <div className="flex flex-col items-center gap-2">
            <Link
              href={"/password-reset"}
              className="text-[#2A9D8F] underline underline-offset-2 tracking-tight"
            >
              Forgot your password?
            </Link>
            <p className="tracking-tight">
              Don{"'"}t have an account?{" "}
              <Link
                href={"/register"}
                className="text-[#2A9D8F] underline underline-offset-2"
              >
                Register here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </Transition>
  );
}
