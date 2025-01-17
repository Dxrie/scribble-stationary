"use client";
import {createHash} from "crypto";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Link from "next/link";
import React, {useCallback, useEffect, useState} from "react";
import {decrypt, encrypt} from "../lib/libs";
import {getCookie, setCookie} from "cookies-next/client";
import {useRouter} from "next/navigation";

export default function Register() {
  const router = useRouter();

  useEffect(() => {
    const decryptFunc = async () => {
      const cookie = getCookie("session");

      if (cookie) {
        try {
          const payload = await decrypt(cookie);

          if (payload) {
            console.log("test");
            router.push("/");
          }
        } catch (err: any) {
          console.log(err.message);
          setCookie("session", "", {expires: new Date(0)});
        }
      }
    };

    decryptFunc();
  }, []);

  const showSwal = (message: string, success: boolean) => {
    withReactContent(Swal).fire({
      title: success ? "Success" : "Error",
      text: message,
      icon: success ? "success" : "error",
    });
  };

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
              },
              body: JSON.stringify({
                email: formData.email,
                username: formData.username,
                passwordHash: createHash("sha256")
                  .update(formData.password)
                  .digest("hex"),
              }),
            });

            if (response.ok) {
              const data = await response.json();

              const expires = new Date(Date.now() + 60 * 60 * 1000);
              const session = await encrypt({data, expires});

              setCookie("session", session, {
                expires,
                path: "/",
                sameSite: "lax",
              });
              showSwal("Welcome to Scribble!", true);
              router.push("/");
            } else {
              const errorData = await response.json();
              showSwal(errorData.message, false);
            }
          } catch (err: any) {
            showSwal(err.message, false);
          } finally {
            setIsLoading(false);
          }
        } else {
          showSwal("Your password doesn't match", false);
        }
      } else {
        showSwal("Please input a valid credential", false);
      }
    }
  }, [formData, isLoading]);

  return (
    <>
      <div className="w-full h-[100vh] font-poppins flex flex-col justify-center gap-5 bg-gradient-to-r from-[#264653] to-[#E76F51]">
        <span className="flex justify-center items-center gap-3">
          <img src="favicon.ico" draggable={false} width={50} />
          <h1 className="text-center text-white text-3xl font-bold">
            Scribble{" "}
          </h1>
        </span>
        <form className="bg-white mx-auto w-[90%] sm:w-[40%] py-6 pb-10 rounded-3xl shadow-2xl flex flex-col items-center text-black gap-4">
          <h1 className="text-2xl font-semibold">Register</h1>
          <input
            name="username"
            className="w-[90%] py-3 px-3 rounded-xl border-black border drop-shadow-xl focus:outline-none text-black"
            type="text"
            placeholder="Username"
            onChange={(e) =>
              setFormData({...formData, username: e.target.value})
            }
            required
          />
          <input
            name="email"
            className="w-[90%] py-3 px-3 rounded-xl border-black border drop-shadow-xl focus:outline-none text-black"
            type="text"
            placeholder="Email"
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
          <input
            name="password"
            className="w-[90%] py-3 px-3 rounded-xl border-black border drop-shadow-xl focus:outline-none text-black"
            type="password"
            placeholder="Password"
            onChange={(e) =>
              setFormData({...formData, password: e.target.value})
            }
            required
          />
          <input
            name="confirmPassword"
            className="w-[90%] py-3 px-3 rounded-xl border-black border drop-shadow-xl focus:outline-none text-black"
            type="password"
            placeholder="Confirm Password"
            onChange={(e) =>
              setFormData({...formData, confirmPassword: e.target.value})
            }
            required
          />
          <button
            onClick={register}
            type="button"
            className="hover:bg-slate-900 w-[90%] py-3 px-3 rounded-3xl border-black border-1 drop-shadow-xl focus:outline-none text-white bg-black font-semibold cursor-pointer"
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
          <p>
            Already have an account?{" "}
            <Link
              href={"/login"}
              className="text-[#2A9D8F] underline underline-offset-2"
            >
              Login here
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}
