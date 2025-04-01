"use client";
import Link from "next/link";
import { Suspense, useCallback, useEffect, useState } from "react";
import { showSwal } from "../lib/libs";
import { useRouter, useSearchParams } from "next/navigation";
import Loading from "../components/Loading";
import Transition from "../components/Transition";
import API_KEY from "@/apiKey";

function PasswordResetContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const id = searchParams.get("id");
  const token = searchParams.get("token");

  const [email, setEmail] = useState("");
  const [passwordData, setPasswordData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [validToken, setValidToken] = useState(false);

  const checkToken = useCallback(async () => {
    try {
      setIsLoading(true);

      const response = await fetch("/api/users/verify-token", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-api-key": `${API_KEY}`,
        },
        body: JSON.stringify({
          id,
          token,
        }),
      });

      if (response.ok) {
        setValidToken(true);
      } else {
        const errorData = await response.json();
        showSwal("Error", errorData.message, "error");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        showSwal("Error", err.message, "error");
      } else {
        showSwal("Error", "An error occured", "error");
      }
    } finally {
      setIsLoading(false);
    }
  }, [id, token]);

  useEffect(() => {
    if (!validToken && id && token) {
      checkToken();
    }
  }, [checkToken, id, token, validToken]);

  const verifyUser = useCallback(async () => {
    if (isLoading) return;

    if (email) {
      try {
        setIsLoading(true);

        const response = await fetch("/api/users/verify-user", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "x-api-key": `${API_KEY}`,
          },
          body: JSON.stringify({
            email,
          }),
        });

        if (response.ok) {
          showSwal(
            "Success",
            "Please check your email to reset your password.",
            "success",
          );
        } else {
          const errorData = await response.json();
          showSwal("Error", "An error occured: " + errorData.message, "error");
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          showSwal("Error", "An error occured: " + err.message, "error");
        } else {
          showSwal("Error", "An error occured.", "error");
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      showSwal("Error", "Please input a valid credential", "error");
    }
  }, [email, isLoading]);

  const changePassword = useCallback(async () => {
    if (isLoading) return;

    if (
      !(
        passwordData.password.trim() !== "" &&
        passwordData.confirmPassword.trim() !== ""
      )
    )
      return showSwal("Error", "Please input a valid credential", "error");

    if (!(passwordData.password === passwordData.confirmPassword))
      return showSwal("Error", "Your password doesn't match", "error");

    try {
      setIsLoading(true);

      const response = await fetch("/api/users/password-reset", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-api-key": `${API_KEY}`,
        },
        body: JSON.stringify({
          userId: id,
          newPassword: passwordData.password,
        }),
      });

      if (response.ok) {
        showSwal(
          "Success",
          "Password has successfully been changed, please login again.",
          "success",
        );
        router.push("/login");
      } else {
        const errorData = await response.json();
        showSwal("Error", errorData.message, "error");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        showSwal("Error", "An error occured: " + err.message, "error");
      } else {
        showSwal("Error", "An error occured", "error");
      }
    } finally {
      setIsLoading(false);
    }
  }, [id, isLoading, passwordData, router]);

  if (id && token) {
    if (isLoading) {
      return <Loading />;
    }

    if (validToken && isLoading === false) {
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
              <h1 className="text-2xl font-semibold">Reset your password</h1>
              <p className="text-center px-10 mb-[2em]">
                Type a new password different to change your password.
              </p>
              <input
                name="password"
                className="w-[90%] py-3 px-3 rounded-xl border-black border drop-shadow-xl focus:outline-none text-black"
                type="password"
                placeholder="New Password"
                required
                onChange={(e) =>
                  setPasswordData({ ...passwordData, password: e.target.value })
                }
              />
              <input
                name="confirmPassword"
                className="w-[90%] py-3 px-3 rounded-xl border-black border drop-shadow-xl focus:outline-none text-black"
                type="password"
                placeholder="Confirm Password"
                required
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirmPassword: e.target.value,
                  })
                }
              />
              <button
                type="button"
                onClick={changePassword}
                className="hover:bg-slate-900 w-[90%] py-3 px-3 rounded-3xl border-black border-1 drop-shadow-xl focus:outline-none text-white bg-black font-semibold cursor-pointer"
                disabled={isLoading}
              >
                Change Password
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
        </Transition>
      );
    }
  } else {
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
            <h1 className="text-2xl font-semibold">Reset your password</h1>
            <p className="text-center px-10 mb-[2em]">
              Enter the email address linked to your Scribble account and we
              {"'"}ll send you an email.
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
              onClick={verifyUser}
              className="hover:bg-slate-900 w-[90%] py-3 px-3 rounded-3xl border-black border-1 drop-shadow-xl focus:outline-none text-white bg-black font-semibold cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? "Sending Link..." : "Send Link"}
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
      </Transition>
    );
  }
}

export default function PasswordReset() {
  return (
    <Suspense fallback={<Loading />}>
      <PasswordResetContent />
    </Suspense>
  );
}
