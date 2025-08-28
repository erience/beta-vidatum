"use client";
import ViewDataTable from "@/components/dataTables/ViewDataTable";
import { apiConnector } from "@/utils/apihelper";
import { formatDateShort, formatDMY } from "@/utils/helper";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

const OutwardDashboardv1 = () => {
  const [outwardData, setOutwardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const fetchPendingInwardData = async () => {
    try {
      const response = await apiConnector(
        "GET",
        `${apiUrl}/v2/admin/process/outwardDashboard?table=b_inward&isin=b_isin&demattable=b_inward_info`
      );
      console.log("data", response.data.result);
      setOutwardData(response.data.result);
      setLoading(false);
    } catch (error) {
      const errMsg = error?.response?.data?.message;
      toast.error(errMsg || "An error occurred while processing the request.");
      console.error("Error fetching ISIN data:", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPendingInwardData();
  }, []);

  const balanceColumns = useMemo(
    () => [
      {
        header: "#",
        accessorKey: "index",
        cell: (info) => info?.row?.index + 1 || "-",
      },
      {
        header: "ISIN",
        accessorKey: "isin",
        cell: (info) => info?.row?.original?.isin,
      },
      {
        header: "REF",
        accessorKey: "ref",
        cell: (info) => info?.row?.original?.ref,
      },
      {
        header: "Date",
        accessorKey: "date",
        cell: (info) => formatDateShort(info?.row?.original?.date),
      },
      {
        header: "Process Date",
        accessorKey: "p_date",
        cell: (info) => formatDateShort(info?.row?.original?.p_date),
      },
      {
        header: "Company",
        accessorKey: "cin",
        cell: (info) => info?.row?.original?.cin,
      },
      {
        header: "Sender",
        accessorKey: "sender",
        cell: (info) => info?.row?.original?.sender,
      },
      {
        header: "Type",
        accessorKey: "type",
        cell: (info) => {
          const value = info.row.original.type;
          return (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              {value}
            </span>
          );
        },
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
    ],
    []
  );

  return (
    <>
      <ViewDataTable
        title="Pending Outward Dashboard V1"
        columns={balanceColumns}
        data={outwardData}
        isLoading={loading}
      />
    </>
  );
};

export default OutwardDashboardv1;
