"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, Eye } from "lucide-react";
import { apiConnector } from "@/utils/apihelper";
import { toast } from "react-toastify";
import Link from "next/link";
import ViewDataTable from "@/components/dataTables/ViewDataTable";
import { useRouter } from "next/navigation";

const KYCInwardProcess = () => {
  const router = useRouter();
  const [data, setData] = useState({});
  const [activeYear, setActiveYear] = useState(null);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchKycData = async () => {
      try {
        const response = await apiConnector(
          "GET",
          `${apiUrl}/v2/admin/process/inward/kyc-inward-process?table=b_inward&&isin=b_isin`
        );
        const result = response?.data?.result?.sortedyear || {};
        setData(result);
        const years = Object.keys(result);
        if (years.length > 0) setActiveYear(years[0]);
        setLoading(false);
      } catch (error) {
        toast.error(
          error?.response?.data?.error || "Error while fetching data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchKycData();
  }, []);

  const stgFunction = async (ref) => {
    try {
      const response = await apiConnector(
        "GET",
        `${apiUrl}/v2/admin/process/download-data-of-inward-final?id=${ref}&table=b_inward&isin=b_isin&demattable=b_inward_info`,
        true
      );

      if (response?.data?.status === 200 || response?.data?.status === true) {
        toast.success(response.data.message || "Download Report");

        const res2 = await apiConnector(
          "GET",
          `${apiUrl}/v2/admin/process/download-data-of-annexure-final?id=${ref}&table=b_inward&isin=b_isin`,
          true
        );

        if (res2?.data?.status === 200 || res2?.data?.status === true) {
          const data = res2?.data?.result;
          const getLink = data?.getLink;
          console.log({ getLink });
          if (getLink) {
            switch (getLink) {
              case "other_inward_outward_letter":
                router.push(
                  `/admin/inward/otherInwardOutwardLetter/${encodeURIComponent(
                    ref
                  )}`
                );
                break;
              case "other_rejection_outward_letter":
                router.push(
                  `/admin/inward/latter/otherRejctionOutwardLatter/${encodeURIComponent(
                    ref
                  )}`
                );
                break;
              case "kyc_approval_outward_letter":
                router.push(
                  `/admin/inward/latter/kycApprovalOutwardLetter/${encodeURIComponent(
                    ref
                  )}`
                );
                break;
              case "approval_outward_letter":
                router.push(
                  `/admin/inward/latter/approvalOutwardLetter/${encodeURIComponent(
                    ref
                  )}`
                );
                break;
              case "rejection_outward_letter":
                router.push(
                  `/admin/inward/latter/rejectionOutwardLetter/${encodeURIComponent(
                    ref
                  )}`
                );
                break;
              case "annexureb":
                router.push(
                  `/admin/inward/annexureB/${encodeURIComponent(ref)}`
                );
                break;
              default:
                router.push(
                  `/admin/inward/otherInwardOutwardLetter/${encodeURIComponent(
                    ref
                  )}`
                );
                break;
            }
          } else {
            toast.error("No valid link found for redirection.");
          }
        }
      }
    } catch (error) {
      const errMsg = error?.response?.data?.message;
      toast.error(errMsg || "An error occurred while processing the request.");
    }
  };

  const columns = useMemo(
    () => [
      { header: "#", accessorKey: "index", cell: (info) => info.row.index + 1 },
      {
        header: "Inward Date",
        accessorKey: "date",
        cell: (info) =>
          new Date(info.row.original.date).toLocaleDateString("en-GB"),
      },
      {
        header: "Process Date",
        accessorKey: "p_date",
        cell: (info) => {
          const rawDate = info.row.original.p_date;

          if (!rawDate) return "-";

          const parsedDate = new Date(Date.parse(rawDate));

          return isNaN(parsedDate)
            ? "-"
            : parsedDate.toLocaleDateString("en-GB");
        },
      },

      { header: "Ref No.", accessorKey: "ref" },
      {
        header: "LF",
        accessorKey: "lf",
        cell: (info) => info.row.original.lf || "-",
      },
      { header: "Company Name", accessorKey: "cin" },
      { header: "ISIN", accessorKey: "isin" },
      { header: "Type", accessorKey: "type" },
      { header: "SubType", accessorKey: "sub_type" },
      { header: "Mode", accessorKey: "mode" },
      { header: "Sender", accessorKey: "sender" },
      { header: "Location", accessorKey: "location" },
      {
        header: "Status",
        accessorKey: "status",
        cell: (info) => {
          const status = (info.row.original.status || "Unknown").toLowerCase();

          const getBadgeClasses = (status) => {
            switch (status) {
              case "active":
                return "bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm";
              case "pending":
                return "bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm";
              case "delete":
                return "bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm";
              case "rejected":
                return "bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm";
              case "none ":
                return "bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-sm";
              default:
                return "bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-sm";
            }
          };

          return (
            <span className={getBadgeClasses(status)}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          );
        },
      },
      {
        header: "View",
        cell: ({ row }) => (
          <Link
            href={`/admin/inward/viewInward/${encodeURIComponent(
              row.original.ref
            )}`}
          >
            <Eye className="text-green-500" size={20} />
          </Link>
        ),
      },
      {
        header: "Actions",
        cell: ({ row }) => {
          const { status, ref } = row.original;

          if (status === "Active") {
            return (
              <div className="flex space-x-2">
                <button
                  onClick={() => stgFunction(ref)}
                  title="Download Letter"
                >
                  <Download size={20} className="text-green-500" />
                </button>
                <button
                  onClick={() => stgFunction(ref, true)}
                  title="Download Alternate Letter"
                >
                  <Download size={20} className="text-green-500" />
                </button>
              </div>
            );
          }

          if (status === "Rejected") {
            return (
              <button onClick={() => stgFunction(ref)} title="Download Letter">
                <Download size={20} className="text-green-500" />
              </button>
            );
          }

          if (
            status === "Delete" ||
            status === "Deleted" ||
            status === "Blocked" ||
            status === "Pending"
          ) {
            return null; // no buttons
          }

          // Optional fallback
          return <span className="text-red-500">Something went wrong</span>;
        },
      },
    ],
    []
  );

  const yearTabs = Object.keys(data).sort((a, b) => {
    const yearA = parseInt(a.replace("year_", ""));
    const yearB = parseInt(b.replace("year_", ""));
    return yearB - yearA;
  });

  return (
    <div className="card">
      <div className="card-body">
        <>
          <div className="flex gap-4 border-b mb-6">
            {yearTabs.map((yearKey) => {
              const year = yearKey.replace("year_", "");
              return (
                <button
                  key={yearKey}
                  onClick={() => setActiveYear(yearKey)}
                  className={`px-4 py-2 font-medium ${
                    activeYear === yearKey
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-500"
                  }`}
                >
                  {year}
                </button>
              );
            })}
          </div>

          {activeYear && (
            <ViewDataTable
              title={`KYC Inward List - ${activeYear.replace("year_", "")}`}
              cardHeader={`Year ${activeYear.replace("year_", "")} Inward Data`}
              columns={columns}
              data={data[activeYear]}
              isLoading={loading}
            />
          )}
        </>
      </div>
    </div>
  );
};

export default KYCInwardProcess;
