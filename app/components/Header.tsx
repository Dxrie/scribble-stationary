"use client";
import {getCookie, setCookie} from "cookies-next/client";
import React, {useEffect, useState} from "react";
import {decrypt} from "../lib/libs";
import NotLoggedInHeader from "./NotLoggedInHeader";
import LoggedInHeader from "./LoggedInHeader";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkCookie = async () => {
      const session = getCookie("session");

      if (session) {
        try {
          await decrypt(session);

          setIsLoggedIn(true);
        } catch (err: unknown) {
          if (err instanceof Error) {
            setCookie("session", "", {expires: new Date(0)});
          } else {
            setCookie("session", "", {expires: new Date(0)});
          }
        }
      }
    };

    checkCookie();
  }, []);

  return isLoggedIn ? <LoggedInHeader /> : <NotLoggedInHeader />;
};

export default Header;
