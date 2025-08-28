"use client";
import ViewDataTable from "@/components/dataTables/ViewDataTable";
import { apiConnector } from "@/utils/apihelper";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

const PendingInwardDashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Date formatting function
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    
    try {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return "-";
    }
  };

  const fetchPendingInwardData = async () => {
    try {
      setLoading(true); // Set loading to true at the start
      const response = await apiConnector(
        "GET",
        `${apiUrl}/v2/admin/pendingdematdashboard?table=b_inward_v2&isin=c_isin&demattable=b_inward_info_v2`
      );
      console.log("data", response.data.result);
      setData(response.data.result);
    } catch (error) {
      const errMsg = error?.response?.data?.message;
      toast.error(errMsg || "An error occurred while processing the request.");
      console.error("Error fetching ISIN data:", error);
    } finally {
      setLoading(false); // Always set loading to false
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
        header: "Reference Number",
        accessorKey: "ref",
        cell: (info) => info?.row?.original?.ref || "-",
      },
      {
        header: "Days Elapsed",
        accessorKey: "daysElapsed",
        cell: (info) => info?.row?.original?.daysElapsed || "-",
      },
      {
        header: "Date Created",
        accessorKey: "created_at",
        cell: (info) => {
          const dateValue = info?.row?.original?.created_at;
          return formatDate(dateValue);
        },
      },
      {
        header: "Inward Info",
        accessorKey: "inward_lf",
        cell: (info) => {
          const val = info?.row?.original?.inward_lf;
          return val == null || val === "" ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              pending inward info
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              {val}
            </span>
          );
        },
      },
      {
        header: "Inward Range",
        accessorKey: "certi",
        cell: (info) => {
          const val = info?.row?.original?.certi;
          return val == null || val === "" ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              pending inward range
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              {val}
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
        title="Pending Inward Dashboard"
        columns={balanceColumns}
        data={data}
        isLoading={loading}
      />
    </>
  );
};

export default PendingInwardDashboard;
