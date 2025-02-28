"use client";

import {IAddress} from "@/app/lib/models/user";
import {useCallback, useContext, useEffect} from "react";
import {UserContext} from "@/app/context/UserContext";
import {useRouter} from "next/navigation";
import {useQuery} from "@tanstack/react-query";
import getAddress from "../utils/getAddress";

const AddressList = () => {
  const router = useRouter();
  const userContext = useContext(UserContext);

  if (!userContext) {
    throw new Error("UserContext must be used within a user context");
  }

  const {user, isLoadingUser, defaultAddress, setDefaultAddress} = userContext;

  const {
    data: addresses,
    // isFetching,
    // error,
  } = useQuery<IAddress[]>({
    queryFn: () => getAddress(user?._id),
    queryKey: ["addresses"],
    initialData: [],
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!user?._id,
  });

  useEffect(() => {
    if (!user?._id && !isLoadingUser) router.push("/");
  }, [user, router]);

  const setDefaultAddressCallback = useCallback((addressId: string) => {
    setDefaultAddress(addressId);
  }, [defaultAddress, setDefaultAddress]);

  return (
    <ul className="px-1">
      {addresses?.map((address) => (
        <li
          key={address._id}
          className="flex items-center justify-between gap-2 py-2 px-2 border-b border-gray-200 cursor-pointer hover:bg-gray-100"
          onClick={() => setDefaultAddressCallback(address._id)}
        >
          <div className="flex items-center gap-2">
            <input
              type="radio"
              name="default"
              // checked={address.isDefault}
              onChange={() => {}}
              disabled={isLoadingUser}
            />
            <div className="flex flex-col">
              <span className="text-sm font-medium">{address.label}</span>
              <span className="text-xs text-gray-500">
                {address.streetAddress}, {address.city}, {address.province},{" "}
                {address.postalCode}
              </span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default AddressList;
