"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  PackageSearch,
  ArrowRightLeft,
  Bell,
  Users,
  Wrench,
  LogOut,
  ArrowLeft,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useContext } from "react";
import { UserContext } from "@/app/context/UserContext";
import Link from "next/link";

export function AppSidebar() {
  const userContext = useContext(UserContext);
  const router = useRouter();

  if (!userContext) {
    throw new Error("UserContext must be used within a user context");
  }

  const { logout } = userContext;

  const pathname = usePathname();
  const sidebarVisibleEndpoints = ["/admin"];

  const items = [
    {
      title: "Dashboard",
      url: "/admin",
      icon: LayoutDashboard,
    },
    {
      title: "Products",
      url: "/admin/products",
      icon: PackageSearch,
    },
    {
      title: "Transactions",
      url: "/admin/transactions",
      icon: ArrowRightLeft,
    },
    {
      title: "Notifications",
      url: "/admin/notifications",
      icon: Bell,
    },
    {
      title: "Users",
      url: "/admin/users",
      icon: Users,
    },
    {
      title: "Settings",
      url: "/admin/settings",
      icon: Wrench,
    },
  ];

  if (
    !sidebarVisibleEndpoints.some((endpoint) => pathname.startsWith(endpoint))
  ) {
    return null;
  }

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={
                      pathname === item.url
                        ? "bg-muted text-white hover:bg-muted hover:text-white"
                        : ""
                    }
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Button
          variant={"ghost"}
          onClick={() => {
            router.push("/user");
          }}
          className="hover:bg-gray-100"
        >
          <ArrowLeft />
          Back to User Page
        </Button>
        <Button
          variant={"ghost"}
          onClick={() => {
            logout();
            router.push("/login");
          }}
          className="hover:bg-gray-100"
        >
          <LogOut />
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
