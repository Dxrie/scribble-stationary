"use client";
import React, {useEffect, useState} from "react";
import {decrypt} from "../lib/libs";
import {getCookie, setCookie} from "cookies-next/client";

const Name = () => {
  const [data, setData] = useState({
    username: "",
    email: "",
    passwordHash: "",
  });

  useEffect(() => {
    const loadCookie = async () => {
      try {
        const session = getCookie("session");

        if (!session) return;

        const payload = await decrypt(session);

        if (payload) {
          setData(payload.data);
        }
      } catch (err: any) {
        console.log(err.message);
        setCookie("session", "", {expires: new Date(0)});
      }
    };

    loadCookie();
  }, []);

  return <div>{data.username}</div>;
};

export default Name;
