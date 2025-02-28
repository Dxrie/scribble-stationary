"use client";

import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {useContext, useLayoutEffect} from "react";
import {UserContext} from "../context/UserContext";
import {useRouter} from "next/navigation";
import {ArrowForwardIos} from "@mui/icons-material";
import Link from "next/link";

const UserProfileComponent = () => {
  const userContext = useContext(UserContext);
  const router = useRouter();

  if (!userContext) {
    throw new Error("UserContext must be used within a user context");
  }

  const {user, isLoadingUser} = userContext;

  useLayoutEffect(() => {
    if (!user?._id && !isLoadingUser) router.push("/");
  }, [user, isLoadingUser])

  return (
    <div className="w-full px-3 flex flex-col items-center gap-10">
      <div className="flex flex-col gap-2 items-center px-5">
        <Avatar className="size-28 shadow-md">
          <AvatarImage src={user?.avatar} />
          <AvatarFallback>Profile Picture</AvatarFallback>
        </Avatar>
        <span>
          <h1 className="text-2xl text-center line-clamp-1">
            {user?.username}
          </h1>
          <h2 className="underline">{user?.email}</h2>
        </span>
      </div>

      <div className="w-full flex flex-col items-center gap-3">
        <Link href={"/user/address"} className="w-full">
          <div className="w-full bg-white drop-shadow-sm p-5 rounded-md flex justify-between border">
            <h1>Addresses</h1>
            <ArrowForwardIos className="text-primary" />
          </div>
        </Link>

        <Link href={"/user/orders"} className="w-full">
          <div className="w-full bg-white drop-shadow-sm p-5 rounded-md flex justify-between border">
            <h1>My orders</h1>
            <ArrowForwardIos className="text-primary" />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default UserProfileComponent;
