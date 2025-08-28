"use client";
import { Download, Eye, Mail } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Upload, PencilLine, SquarePen, Info, FilePlus } from "lucide-react";
import { apiConnector } from "@/utils/apihelper";
import Link from "next/link";
import ViewDataTable from "@/components/dataTables/ViewDataTable";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useBenposeStore } from "../../../../../store/benposeStore";

const DemateInwardProcess = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const router = useRouter();
  const [activeYear, setActiveYear] = useState(null);
  const [formData, setFormData] = useState({});

  //----------------------fetch DemateInwardProcess data-----------------------------

  const fetchDematProcess = async () => {
    try {
      const response = await apiConnector(
        "GET",
        `${apiUrl}/v2/admin/process/inward/demat-inward-process?table=b_inward&isin=b_isin&demattable=b_inward_info`
      );
      console.log({ response });
      const responseData = response?.data?.result?.sortedyear || [];
      setData(responseData);
      const years = Object.keys(responseData);
      if (years.length > 0) setActiveYear(years[0]);
      setLoading(false);
    } catch (error) {
      const errMsg = error.response.data.message;
      toast.error(errMsg || "An error occurred while processing the request.");
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchDematProcess();
  }, []);

  //--------------------------------------Report Download logic-----------------------------

  // Download logic
  const stgFunction = async (ref) => {
    try {
      // Call the first API
      const response = await apiConnector(
        "GET",
        `${apiUrl}/v2/admin/process/download-data-of-inward?id=${ref}&table=b_inward&isin=b_isin&demattable=b_inward_info`,
        true
      );
      console.log({ response });

      if (response?.data?.status === 200 || response?.data?.status === true) {
        // toast.success(response.data.message || "Download Report");

        // Call the second API only if the first API is successful
        const res2 = await apiConnector(
          "GET",
          `${apiUrl}/v2/admin/process/download-data-of-inward-final?id=${ref}&table=b_inward&isin=b_isin&demattable=b_inward_info`,
          true
        );

        if (res2?.data?.status === 200 || res2?.data?.status === true) {
          const data = res2?.data?.result;
          console.log({ data });
          useBenposeStore.getState().setFormData(data);
          const getLink = data?.getLink;
          if (getLink) {
            // Redirect based on the getLink value
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
                  `/admin/inward/annexureb/${encodeURIComponent(ref)}`
                );
                break;
              default:
                3;
                // Handle unknown cases or default route
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
      console.error("Error:", error);
      const errMsg = error.response.data.message;
      toast.error(errMsg || "An error occurred while processing the request.");
      throw error;
    }
  };
  //---------------------------------------mail--------------------------------
  const sendMail = async (id, y = false) => {
    try {
      const response = await apiConnector(
        "GET",
        `${apiUrl}/v2/admin/process/send-email?id=${id}`,
        true
      );

      console.log({ response });

      // show toast based on response.status
      if (response.data.status === true) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      const errMsg = error.response.data.message;
      console.error("sendMail error:", error);
      toast.error(errMsg || "Unable to send email. Please try again later.");
    }
  };

  //---------------------------dynamic column---------------------------
  const columns = useMemo(
    () => [
      { header: "#", accessorKey: "index", cell: (info) => info.row.index + 1 },
      {
        header: "Inward Date",
        accessorKey: "date",
        cell: (info) => {
          const dateStr = info.row.original.date;
          const date = new Date(dateStr);
          return date.toLocaleDateString("en-GB");
        },
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
      // {
      //   header: "Difference Days",
      //   accessorKey: "getdiff",
      //   cell: (info) => info.row.original.getdiff || "-",
      // },

      {
        header: "Ref No.",
        accessorKey: "ref",
        cell: (info) => info.row.original.ref || "-",
      },
      {
        header: "LF",
        accessorKey: "lf",
        cell: (info) => info.row.original.lf || "-",
      },
      {
        header: "ISIN",
        accessorKey: "isin",
        cell: (info) => info.row.original.isin || "-",
      },
      {
        header: "Company Name",
        accessorKey: "cin",
        cell: (info) => info.row.original.cin || "-",
      },
      {
        header: "Type",
        accessorKey: "type",
        cell: (info) => info.row.original.type || "-",
      },
      {
        header: "SubType",
        accessorKey: "sub_type",
        cell: (info) => info.row.original.sub_type || "-",
      },
      {
        header: "Mode",
        accessorKey: "mode",
        cell: (info) => info.row.original.mode || "-",
      },
      {
        header: "Sender",
        accessorKey: "sender",
        cell: (info) => info.row.original.sender || "-",
      },
      {
        header: "Location",
        accessorKey: "location",
        cell: (info) => info.row.original.location || "-",
      },
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
        accessorKey: "",
        cell: ({ row }) => {
          const rowData = row.original;
          return (
            <>
              <Link
                href={`/admin/inward/viewInward/${encodeURIComponent(
                  rowData.ref
                )}`}
                title="View ISIN Data"
              >
                <Eye className="text-green-500" />
              </Link>
            </>
          );
        },
      },
      {
        header: "Actions",
        accessorKey: "actions",
        cell: (info) => {
          const { status, ref } = info.row.original;

          const showDownload = status === "Active" || status === "Rejected";

          if (showDownload) {
            return (
              <button
                onClick={() => stgFunction(ref)}
                title="Download Approval Letter"
                className="text-green-600"
              >
                <Download size={20} className="text-green-500" />
              </button>
            );
          } else if (status === "Pending" || status === "Deleted") {
            return null;
          } else {
            return (
              <span className="inline-block bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 rounded-full">
                Something went wrong
              </span>
            );
          }
        },
      },

      {
        header: "Mail",
        accessorKey: "",
        cell: ({ row }) => {
          const rowData = row.original;
          return (
            <>
              <button onClick={() => sendMail(rowData.ref)}>
                <Mail className="text-green-500" />
              </button>
            </>
          );
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
            title="Demat Inward Process"
            cardHeader="demat inward process data"
            columns={columns}
            data={data[activeYear] || []}
            isLoading={loading}
          />
        )}
      </div>
    </div>
  );
};

export default DemateInwardProcess;
