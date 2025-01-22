"use client";
import {getCookie, setCookie} from "cookies-next/client";
import Link from "next/link";
import React, {useEffect, useState} from "react";
import {decrypt, showSwal} from "../lib/libs";
import NotLoggedInHeader from "./subcomponents/NotLoggedInHeader";
import LoggedInHeader from "./subcomponents/LoggedInHeader";

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
          setCookie("session", "", {expires: new Date(0)});
        }
      }
    };

    checkCookie();
  }, []);

  return (
    isLoggedIn === false ? <LoggedInHeader /> : <NotLoggedInHeader />
  );
};

export default Header;
