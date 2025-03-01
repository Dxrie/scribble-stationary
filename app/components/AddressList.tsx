"use client";

import {IAddress} from "@/app/lib/models/user";
import {useCallback, useContext, useEffect, useState} from "react";
import {UserContext} from "@/app/context/UserContext";
import {useRouter} from "next/navigation";
import {useQuery} from "@tanstack/react-query";
import getAddress from "../utils/getAddress";
import {Plus} from "lucide-react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import { DialogHeader, Dialog, DialogContent, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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

  const setDefaultAddressCallback = useCallback(
    (address: IAddress) => {
      setDefaultAddress(address);
    },
    [defaultAddress, setDefaultAddress]
  );
  const [formData, setFormData] = useState({
    label: "",
    fullName: "",
    phoneNumber: "",
    streetAddress: "",
    city: "",
    province: "",
    postalCode: ""
  });

  const [error, setError] = useState<string | null>(null);

  const validateForm = () => {
    if (!formData.label) {
      setError("Label is required");
      return false;
    }
    if (!formData.fullName) {
      setError("Full name is required");
      return false;
    }
    if (!formData.phoneNumber) {
      setError("Phone number is required");
      return false;
    }
    if (!formData.streetAddress) {
      setError("Street address is required");
      return false;
    }
    if (!formData.city) {
      setError("City is required");
      return false;
    }
    if (!formData.province) {
      setError("Province is required");
      return false;
    }
    if (!formData.postalCode) {
      setError("Postal code is required");
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Form Data:');
      console.log('Label:', formData.label);
      console.log('Full Name:', formData.fullName);
      console.log('Phone Number:', formData.phoneNumber);
      console.log('Street Address:', formData.streetAddress);
      console.log('City:', formData.city);
      console.log('Province:', formData.province);
      console.log('Postal Code:', formData.postalCode);
      console.log('Complete Form Data:', formData);
    }
  };
  return (
    <>
      <ul className="px-4 py-2 space-y-3">
        {addresses?.map((address) => (
          <li
            key={address._id}
            className="group relative flex items-center gap-4 p-4 rounded-lg border border-gray-200 transition-all duration-200 hover:border-primary hover:shadow-md cursor-pointer bg-white"
            onClick={() => setDefaultAddressCallback(address)}
          >
            <div className="flex items-center gap-4 w-full">
              <div className="relative flex items-center justify-center">
                <input
                  type="radio"
                  name="default"
                  checked={defaultAddress?._id === address._id}
                  onChange={() => {}}
                  disabled={isLoadingUser}
                  className="accent-secondary w-5 h-5 border-2 border-gray-300 rounded-full transition-all duration-200 checked:border-primary checked:border-6 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                />
              </div>
              <div className="flex flex-col space-y-1 flex-1">
                <span className="text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors duration-200">
                  {address.label}
                </span>
                <span className="text-sm text-gray-600">
                  {address.streetAddress}, {address.city}, {address.province},{" "}
                  {address.postalCode}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="w-full flex absolute bottom-5 justify-center">
        <Dialog>
          <DialogTrigger>
            <div className="bg-primary p-3 rounded-full shadow-md hover:bg-black transition-color">
              <Plus className="text-primary-foreground" />
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add new Address</DialogTitle>
              <DialogDescription>Fill in the details for your new address.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div>
                <label className="text-sm font-medium">Label</label>
                <Input 
                  placeholder="Home, Office, etc." 
                  value={formData.label}
                  onChange={(e) => setFormData({...formData, label: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Full Name</label>
                <Input 
                  placeholder="Enter your full name" 
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Phone Number</label>
                <Input 
                  placeholder="Enter your phone number" 
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Street Address</label>
                <Input 
                  placeholder="Enter your street address" 
                  value={formData.streetAddress}
                  onChange={(e) => setFormData({...formData, streetAddress: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium">City</label>
                <Input 
                  placeholder="Enter your city" 
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Province</label>
                <Input 
                  placeholder="Enter your province" 
                  value={formData.province}
                  onChange={(e) => setFormData({...formData, province: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Postal Code</label>
                <Input 
                  placeholder="Enter your postal code" 
                  value={formData.postalCode}
                  onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                />
              </div>
              <Button type="submit" className="w-full">Add Address</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default AddressList;
