"use client";
import Link from "next/link";
import {Suspense, useCallback, useEffect, useState} from "react";
import {showSwal} from "../lib/libs";
import {useRouter, useSearchParams} from "next/navigation";
import Loading from "../components/Loading";

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
          },
          body: JSON.stringify({
            email,
          }),
        });

        if (response.ok) {
          showSwal(
            "Success",
            "Please check your email to reset your password.",
            "success"
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
          "success"
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
                  setPasswordData({...passwordData, password: e.target.value})
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
        </>
      );
    }
  } else {
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
      </>
    );
  }
}

export default function PasswordReset() {
  return (
    <Suspense
      fallback={
        <div role="status">
          <svg
            aria-hidden="true"
            className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      }
    >
      <PasswordResetContent />
    </Suspense>
  );
}
