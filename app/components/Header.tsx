"use client";
import React, {useContext} from "react";
import NotLoggedInHeader from "./NotLoggedInHeader";
import LoggedInHeader from "./LoggedInHeader";
import {UserContext} from "@/app/context/UserContext";

const Header = () => {
  const userContext = useContext(UserContext);

  if (!userContext) {
    throw new Error("UserContext must be used within a user context");
  }

  const {user} = userContext;

  return user ? <LoggedInHeader /> : <NotLoggedInHeader />;
};

export default Header;
