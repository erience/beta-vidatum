// src/app/admin/layout.jsx
'use client';

import UserHeader from "@/components/userLayout/UserHeader";
import UserSidebar from "@/components/userLayout/UserSidebar";
import { usePathname } from "next/navigation";


export default function UserLayout({ children }) {
    const pathname = usePathname();
    const isLoginPage = pathname === "/user/userLogin";
  
    if (isLoginPage) {
      return <>{children}</>;
    }
  
  return (
  <div className="flex min-h-screen w-full bg-[#f4f6f8]">
      {/* Sidebar */}
      <UserSidebar />

      {/* Content Wrapper */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 z-50">
          <UserHeader />
        </div>

        {/* Main Content */}
        <main className="p-6 overflow-auto h-[calc(100vh-5rem)]">
          <div className="bg-white rounded-lg shadow-md p-6 w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
