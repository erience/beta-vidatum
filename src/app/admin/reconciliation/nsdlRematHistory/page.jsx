"use client";
import ViewDataTable from "@/components/dataTables/ViewDataTable";
import { apiConnector } from "@/utils/apihelper";
import { formatDateShort, formatDMY } from "@/utils/helper";
import { Upload } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

const NsdlRematHistory = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  //----------------------fetch KYC data-----------------------------

  const fetchRematData = async () => {
    try {
      const response = await apiConnector(
        "GET",
        `${apiUrl}/v2/admin/actionHistory/getNsdlRemat`
      );
      const responseData = response.data.result || [];
      console.log({ responseData });
      setData(responseData);
      setLoading(false);
    } catch (error) {
      const errMsg = error.response.data.message;
      toast.error(errMsg || "An error occurred while processing the request.");
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRematData();
  }, []);

  const columns = useMemo(
    () => [
      {
        header: "#",
        accessorKey: "index",
        cell: (info) => info.row.index + 1,
      },
      {
        header: "ISIN",
        accessorKey: "isin",
        cell: (info) => info.row.original.isin || "-",
      },
      {
        header: "DP_ID",
        accessorKey: "dp_id",
        cell: (info) => info.row.original.dp_id || "-",
      },
      {
        header: "DP_Name",
        accessorKey: "dp_name",
        cell: (info) => info.row.original.dp_name || "-",
      },
      {
        header: "DRF",
        accessorKey: "drf",
        cell: (info) => info.row.original.drf || "-",
      },
      {
        header: "Inward No",
        accessorKey: "inward_no",
        cell: (info) => info.row.original.inward_no || "-",
      },
      {
        header: "Inward Date",
        accessorKey: "inward_date",
        cell: (info) => formatDateShort(info.row.original.inward_date),
      },
      {
        header: "Process Date",
        accessorKey: "p_date",
        cell: (info) =>
          info.row.original.p_date
            ? new Date(info.row.original.p_date).toLocaleDateString("en-US", {
                month: "numeric",
                day: "numeric",
                year: "numeric",
              })
            : "-",
      },
      {
        header: "NSDL Date",
        accessorKey: "nsdl_date",
        cell: (info) =>
          info.row.original.nsdl_date
            ? new Date(info.row.original.nsdl_date).toLocaleDateString(
                "en-US",
                {
                  month: "numeric",
                  day: "numeric",
                  year: "numeric",
                }
              )
            : "-",
      },
      {
        header: "Count",
        accessorKey: "count",
        cell: (info) => info.row.original.count || "-",
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
              case "rejected ":
                return "bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm";
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
    ],
    []
  );
  return (
    <>
      <div className="card">
        <div className="card-body">
          <ViewDataTable
            title="NSDL Remat History"
            cardHeader="NSDL Remat History Data"
            columns={columns}
            data={data}
            isLoading={loading}
            headerIcons={
              <div className="flex items-center gap-1">
                <Link
                  href="/admin/reconciliation/uploadRematNsdl"
                  title="Upload Remat NSDL"
                >
                  <Upload size={25} />
                </Link>
              </div>
            }
          />
        </div>
      </div>
    </>
  );
};

export default NsdlRematHistory;
