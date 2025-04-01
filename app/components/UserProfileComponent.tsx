"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useContext, useLayoutEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { useRouter } from "next/navigation";
import { ArrowForwardIos } from "@mui/icons-material";
import Link from "next/link";
import { Camera, LogOut } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { encrypt, getBase64, showSwal, swalConfirm } from "../lib/libs";
import { setCookie } from "cookies-next/client";
import API_KEY from "@/apiKey";

const UserProfileComponent = () => {
  const userContext = useContext(UserContext);
  const router = useRouter();
  const [isHovering, setIsHovering] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (!userContext) {
    throw new Error("UserContext must be used within a user context");
  }

  const { user, isLoadingUser, setUser } = userContext;

  useLayoutEffect(() => {
    if (!user?._id && !isLoadingUser) router.push("/");
  }, [user, isLoadingUser]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!user?._id) return;

    setIsUploading(true);

    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-api-key": `${API_KEY}`,
    };

    const makeRequest = async (avatarData: string | null) => {
      const response = await fetch("/api/users/change-profile", {
        method: "POST",
        headers,
        body: JSON.stringify({ id: user._id, avatar: avatarData }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      return response.json();
    };

    const updateSession = async (data: any) => {
      const expires = new Date(Date.now() + 60 * 60 * 1000 * 24);
      const session = await encrypt({ data, expires });

      setCookie("session", session, {
        expires,
        path: "/",
        sameSite: "lax",
      });
      setUser(data);
    };

    try {
      let avatarData = null;

      if (selectedFile) {
        const base64Img = await getBase64(selectedFile);
        if (typeof base64Img === "string") {
          avatarData = base64Img.replace(/^data:.+base64,/, "");
        }
      }

      const data = await makeRequest(avatarData);
      await updateSession(data);
    } catch (error) {
      showSwal(
        "Error",
        selectedFile
          ? "Failed to update profile picture"
          : "Failed to remove profile picture",
        "error",
      );
    } finally {
      setIsUploading(false);
      setSelectedFile(null);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="w-full px-3 flex flex-col items-center gap-10">
      <div className="flex flex-col gap-2 items-center px-5 relative">
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => setIsDialogOpen(open)}
        >
          <DialogTrigger asChild>
            <div
              className="relative cursor-pointer"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <Avatar className="size-28 shadow-md">
                <AvatarImage src={previewUrl || user?.avatar} />
                <AvatarFallback className="text-3xl">
                  {user?.username?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {isHovering && (
                <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center">
                  <Camera className="text-white size-6" />
                </div>
              )}
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Change Profile Picture</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center gap-6">
              <div className="relative">
                <Avatar className="size-40 shadow-md">
                  <AvatarImage src={previewUrl || user?.avatar} />
                  <AvatarFallback>
                    {user?.username?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="w-full space-y-4">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
                <Button
                  onClick={handleUpload}
                  disabled={!selectedFile || isUploading}
                  className="w-full"
                >
                  {isUploading ? "Uploading..." : "Upload"}
                </Button>
                {user?.avatar ? (
                  <Button
                    onClick={() => {
                      setSelectedFile(null);
                      handleUpload();
                    }}
                    className="w-full"
                    variant={"destructive"}
                  >
                    Remove Profile Picture
                  </Button>
                ) : (
                  ""
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <span>
          <h1 className="text-2xl text-center line-clamp-1">
            {user?.username}
          </h1>
          <h2 className="underline">{user?.email}</h2>
        </span>
      </div>

      <div className="w-full flex flex-col items-center gap-3">
        <Link href={"/user/address"} className="w-full">
          <div className="w-full bg-primary text-primary-foreground drop-shadow-sm p-5 rounded-xl flex justify-between border">
            <h1>Addresses</h1>
            <ArrowForwardIos className="text-primary-foreground" />
          </div>
        </Link>

        <Link href={"/user/orders"} className="w-full">
          <div className="w-full bg-primary text-primary-foreground drop-shadow-sm p-5 rounded-xl flex justify-between border">
            <h1>My orders</h1>
            <ArrowForwardIos className="text-primary-foreground" />
          </div>
        </Link>

        <Link href={"/vouchers"} className="w-full">
          <div className="w-full bg-primary text-primary-foreground drop-shadow-sm p-5 rounded-xl flex justify-between border">
            <h1>Available Vouchers</h1>
            <ArrowForwardIos className="text-primary-foreground" />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default UserProfileComponent;
