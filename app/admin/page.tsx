"use client";

import { PackageSearch, Users, Wallet, ScanLine } from "lucide-react";
import AdminRoute from "../components/AdminRoute";
import { useQuery } from "@tanstack/react-query";
import API_KEY from "@/apiKey";

interface IQuery {
  users: number;
  products: number;
  checkouts: number;
  checkoutTotal: number;
}

export default function AdminPage() {
  const { data: dashboardData, isFetching } = useQuery<IQuery>({
    queryKey: ["dashboardData"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard", {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": `${API_KEY}`,
        },
      });
      return response.json();
    },
    refetchOnWindowFocus: false,
  });

  return (
    <AdminRoute>
      <div className="h-full w-[calc(100dvw-16rem)] flex flex-col px-6 gap-2 pt-5">
        <div className="flex flex-col">
          <h1 className="font-semibold text-4xl">Dashboard</h1>
          <p className="text-xl">View all status from dashboard</p>
        </div>

        <div className="flex w-full gap-5 text-primary-foreground">
          <div className="flex flex-col w-[25%] bg-secondary py-2 px-4 rounded-md shadow-lg">
            <h1>Total Users</h1>
            <div className="flex items-center justify-between w-full">
              <h1 className="text-2xl">
                {isFetching ? "Loading..." : dashboardData?.users}
              </h1>
              <Users />
            </div>
          </div>

          <div className="flex flex-col w-[25%] bg-secondary py-2 px-4 rounded-md shadow-lg">
            <h1>Total Products</h1>
            <div className="flex items-center justify-between w-full">
              <h1 className="text-2xl">
                {isFetching ? "Loading..." : dashboardData?.products}
              </h1>
              <PackageSearch />
            </div>
          </div>

          <div className="flex flex-col w-[25%] bg-secondary py-2 px-4 rounded-md shadow-lg">
            <h1>Total Sales</h1>
            <div className="flex items-center justify-between w-full">
              <h1 className="text-2xl">
                {isFetching
                  ? "Loading..."
                  : `Rp ${dashboardData?.checkoutTotal.toLocaleString()}`}
              </h1>
              <Wallet />
            </div>
          </div>

          <div className="flex flex-col w-[25%] bg-secondary py-2 px-4 rounded-md shadow-lg">
            <h1>Total Checkouts</h1>
            <div className="flex items-center justify-between w-full">
              <h1 className="text-2xl">
                {isFetching ? "Loading..." : dashboardData?.checkouts}
              </h1>
              <ScanLine />
            </div>
          </div>
        </div>
      </div>
    </AdminRoute>
  );
}
