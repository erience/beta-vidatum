"use client";
import { useAuth } from "@/context/AuthContext";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Power } from "react-feather";
import { apiConnector } from "@/utils/apihelper";
import { toast } from "react-toastify";

const AdminHeader = () => {
  const { username } = useAuth();
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [dropdownOpen, setDropdownOpen] = useState(false);

  //------------------------------logout user------------------------------
  const logoutUser = async () => {
    console.log("run");
    try {
      const response = await apiConnector(
        "POST",
        `${apiUrl}/v2/admin/adminLogout`
      );
      console.log({ response });
      if (response.status == 200) {
        localStorage.removeItem("resUsername");
        toast.success(response.message || "User logout sucessfully");
        router.push("/admin/adminLogin");
      }
    } catch (error) {
      console.log(error);
      const errMsg = error.response.data.message;
      toast.error(errMsg);
    }
  };

  return (
    <header className="w-full bg-white shadow-sm flex items-center justify-between px-4 py-4 border-b border-gray-200">
      <div className="text-sm font-medium text-gray-800"></div>

      <div
        className="relative"
        onMouseEnter={() => setDropdownOpen(true)}
        onMouseLeave={() => setDropdownOpen(false)}
      >
        <button className="flex items-center gap-2 rounded-full px-3 py-1.5 bg-white text-gray-800 border border-gray-300 hover:bg-amber-600 transition">
          <img
            src="/assets/images/favicon.svg"
            alt="logo"
            className="w-6 h-6"
          />
          <span className="text-sm font-semibold">{username || "User"}</span>
        </button>

        {dropdownOpen && (
          <ul className="absolute right-0 top-full mt-0 min-w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10">
            <li>
              <button
                onClick={logoutUser}
                className="flex w-full items-center gap-0 px-4 mt-0 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Power size={16} />
                Logout
              </button>
            </li>
          </ul>
        )}
      </div>
    </header>
  );
};

export default AdminHeader;
