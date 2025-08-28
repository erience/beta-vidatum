// src/app/admin/layout.jsx
"use client";

import AdminHeader from "@/components/appLayout/AdminHeader";
import AdminSideBarMerged from "@/components/appLayout/AdminSideBar";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  const isLoginPage = pathname === "/admin/adminLogin";
  const isKycReport = pathname.startsWith(
    "/admin/inward/report/KycApprovalOutwardLetter"
  );
  const isInwardReportDownload = pathname.startsWith(
    "/admin/inward/inwardRequestDownload"
  );
  const isAnnexureReportDownload = pathname.startsWith(
    "/admin/inward/annexureB"
  );
  const is745ReportDownload = pathname.startsWith(
    "/admin/report/downlaodReport745"
  );
  const is55aReportDownload = pathname.startsWith(
    "/admin/report/downloadReport55a"
  );
  const is55uReportDownload = pathname.startsWith(
    "/admin/report/downloadReport55u"
  );
  const is73ReportDownload = pathname.startsWith(
    "/admin/report/downloadReport73"
  );
  const is76ReportDownload = pathname.startsWith(
    "/admin/report/downloadReport76"
  );
  const is133ReportDownload = pathname.startsWith(
    "/admin/report/downloadReport133"
  );
  const is409ReportDownload = pathname.startsWith(
    "/admin/report/downloadReport409"
  );
  const otherRejctionOutwardLatter = pathname.startsWith(
    "/admin/inward/latter/otherRejctionOutwardLatter"
  );
  const rejectionOutwardLetter = pathname.startsWith(
    "/admin/inward/latter/rejectionOutwardLetter"
  );
  const approvalOutwardLetter = pathname.startsWith(
    "/admin/inward/latter/approvalOutwardLetter"
  );
  const otherInwardOutwardLetter = pathname.startsWith(
    "/admin/inward/otherInwardOutwardLetter"
  );

  const KycApprovalOutwardLetter = pathname.startsWith(
    "/admin/inward/latter/kycApprovalOutwardLetter"
  );

  // If it's one of the pages that shouldn't have layout
  if (
    isLoginPage ||
    isKycReport ||
    isInwardReportDownload ||
    isAnnexureReportDownload ||
    is745ReportDownload ||
    is55aReportDownload ||
    is55uReportDownload ||
    is73ReportDownload ||
    is76ReportDownload ||
    is133ReportDownload ||
    is409ReportDownload ||
    KycApprovalOutwardLetter ||
    otherRejctionOutwardLatter ||
    rejectionOutwardLetter ||
    approvalOutwardLetter ||
    otherInwardOutwardLetter
  ) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen w-full bg-[#f4f6f8]">
      {/* Sidebar */}
      <AdminSideBarMerged />

      {/* Content Wrapper */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 z-50">
          <AdminHeader />
        </div>

        {/* Main Content */}
        <main className="p-2 sm:p-6 overflow-auto h-[calc(100vh-5rem)]">
          <Breadcrumb />
          <div className="bg-white rounded-lg shadow-md p-2 sm:p-6 w-full min-h-[300px] relative">
            {isLoading ? (
              <div className="flex justify-center items-center m-auto h-[33rem]">
                <PageLoader p_color="#000" />
              </div>
            ) : (
              children
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
