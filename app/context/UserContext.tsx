"use client";

import React, { createContext, useEffect, useState } from "react";
import { IAddress, IUser } from "@/app/lib/models/user";
import { getCookie, setCookie } from "cookies-next/client";
import { decrypt, encrypt, ICart } from "@/app/lib/libs";

interface IUserContext {
  user: IUser | undefined;
  setUser: React.Dispatch<React.SetStateAction<IUser | undefined>>;
  checkoutItems: ICart[];
  setCheckoutItems: React.Dispatch<React.SetStateAction<ICart[]>>;
  isLoadingUser: boolean;
  defaultAddress: IAddress | undefined;
  setDefaultAddress: React.Dispatch<React.SetStateAction<IAddress | undefined>>;
  role: "User" | "Admin" | "Guest";
  login: (userData: IUser) => void;
  logout: () => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const UserContext = createContext<IUserContext | undefined>(undefined);

export const UserContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<IUser | undefined>(undefined);
  const [role, setRole] = useState<"User" | "Admin" | "Guest">("Guest");
  const [defaultAddress, setDefaultAddress] = useState<IAddress | undefined>(
    undefined,
  );
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [checkoutItems, setCheckoutItems] = useState<ICart[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const decryptFunc = async () => {
      setIsLoadingUser(true);
      const cookie = getCookie("session");
      if (!cookie) {
        setUser(undefined);
        return;
      }

      try {
        const payload = (await decrypt(cookie)) as { data: IUser };
        if (payload?.data) {
          setUser(payload.data);

          if (payload.data.isAdmin) {
            setRole("Admin");
          } else {
            setRole("User");
          }
        }

        const defaultAddr = localStorage.getItem("defaultAddress");

        if (defaultAddr && typeof defaultAddr === "string") {
          setDefaultAddress(JSON.parse(defaultAddr));
        } else {
          localStorage.removeItem("defaultAddress");
        }
      } catch (error) {
        console.error("Failed to decrypt session:", error);
        setCookie("session", "", { expires: new Date(0) });
        localStorage.removeItem("defaultAddress");
      }
      setIsLoadingUser(false);
    };

    decryptFunc();
  }, []);

  const login = async (userData: IUser) => {
    const expires = new Date(Date.now() + 60 * 60 * 1000 * 24);
    const session = await encrypt({ data: userData, expires });

    setCookie("session", session, {
      expires,
      path: "/",
      sameSite: "lax",
    });

    if (userData.isAdmin) {
      setRole("Admin");
      setUser(userData);
    } else {
      setRole("User");
      setUser(userData);
    }
  };

  const logout = () => {
    setCookie("session", "", { expires: new Date(0) });
    setUser(undefined);
    setRole("Guest");
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        checkoutItems,
        setCheckoutItems,
        isLoadingUser,
        defaultAddress,
        setDefaultAddress,
        role,
        login,
        logout,
        isSidebarOpen,
        setIsSidebarOpen,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
