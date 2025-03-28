"use client";

import React, {createContext, useEffect, useState} from "react";
import {IAddress, IUser} from "@/app/lib/models/user";
import {getCookie, setCookie} from "cookies-next/client";
import {decrypt, ICart} from "@/app/lib/libs";

interface IUserContext {
  user: IUser | undefined;
  setUser: React.Dispatch<React.SetStateAction<IUser | undefined>>;
  checkoutItems: ICart[];
  setCheckoutItems: React.Dispatch<React.SetStateAction<ICart[]>>;
  isLoadingUser: boolean;
  defaultAddress: IAddress | undefined;
  setDefaultAddress: React.Dispatch<React.SetStateAction<IAddress | undefined>>;
}

export const UserContext = createContext<IUserContext | undefined>(undefined);

export const UserContextProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [user, setUser] = useState<IUser | undefined>(undefined);
  const [defaultAddress, setDefaultAddress] = useState<IAddress | undefined>(
    undefined
  );
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [checkoutItems, setCheckoutItems] = useState<ICart[]>([]);

  useEffect(() => {
    const decryptFunc = async () => {
      setIsLoadingUser(true);
      const cookie = getCookie("session");
      if (!cookie) {
        setUser(undefined);
        return;
      }

      try {
        const payload = (await decrypt(cookie)) as {data: IUser};
        if (payload?.data) setUser(payload.data);

        const defaultAddr = localStorage.getItem("defaultAddress");

        if (defaultAddr && typeof defaultAddr === "string") {
            setDefaultAddress(JSON.parse(defaultAddr));
        } else {
            localStorage.removeItem("defaultAddress");
        }
      } catch (error) {
        console.error("Failed to decrypt session:", error);
        setCookie("session", "", {expires: new Date(0)});
        localStorage.removeItem("defaultAddress");
      }
      setIsLoadingUser(false);
    };

    decryptFunc();
  }, []);

  return (
    <UserContext.Provider
      value={{user, setUser, checkoutItems, setCheckoutItems, isLoadingUser, defaultAddress, setDefaultAddress}}
    >
      {children}
    </UserContext.Provider>
  );
};
