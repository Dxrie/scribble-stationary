"use client";

import { setCookie } from "cookies-next/client";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { UserContext } from "../context/UserContext";
import { useContext } from "react";
import { swalConfirm } from "../lib/libs";

export default function UserHeader() {
  const router = useRouter();
  const userContext = useContext(UserContext);

  if (!userContext) {
    throw new Error("UserContext must be used within a user context");
  }

  const { setUser } = userContext;

  const handleLogout = async () => {
    const response = await swalConfirm(
      "Confirmation",
      "Are you sure you want to logout?",
      "warning",
      ["Yes", "No"],
    );

    if (response.isConfirmed) {
      setCookie("session", "", {
        expires: new Date(0),
        path: "/",
      });
      setUser(undefined);
      router.push("/");
    }
  };

  return (
    <div className="w-full py-4 pb-5 px-5 flex items-center justify-center relative">
      <h1 className="text-[18px]">My Account</h1>
      <div
        className="p-2 rounded-full cursor-pointer absolute right-3"
        onClick={handleLogout}
      >
        <LogOut />
      </div>
    </div>
  );
}
