"use client";

import { getCookie, setCookie } from "cookies-next/client";
import { useEffect, useState } from "react";
import { decrypt } from "../lib/libs";
import { IUser } from "../lib/models/user";
import { useRouter } from "next/navigation";
import Loading from "./Loading";

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const decryptFunc = async () => {
      const cookie = getCookie("session");

      if (!cookie) {
        setIsLoading(false);
        router.push("/");
        return;
      }

      try {
        const payload = (await decrypt(cookie)) as { data: IUser };
        if (payload?.data.isAdmin) {
          setIsLoggedIn(true);
        } else {
          router.push("/");
        }
      } catch (error) {
        console.error("Failed to decrypt session:", error);
        setCookie("session", "", { expires: new Date(0) });
        localStorage.removeItem("defaultAddress");
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    decryptFunc();
  }, [router]);

  if (isLoading) {
    return <Loading />;
  }

  return isLoggedIn ? children : null;
};

export default AdminRoute;
