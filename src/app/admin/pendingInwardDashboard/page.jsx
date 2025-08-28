"use client";
import ViewDataTable from "@/components/dataTables/ViewDataTable";
import { apiConnector } from "@/utils/apihelper";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

const PendingInwardDashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const fetchPendingInwardData = async () => {
    try {
      const response = await apiConnector(
        "GET",
        `${apiUrl}/v2/admin/pendingdematdashboard?table=b_inward&isin=b_isin&demattable=b_inward_info`
      );
      console.log("data", response.data.result);
      setData(response.data.result);
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
        header: "Reference Number",
        accessorKey: "ref",
        cell: (info) => info?.row?.original?.ref,
      },
      {
        header: "DaysElapsed",
        accessorKey: "daysElapsed",
        cell: (info) => info?.row?.original?.daysElapsed,
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
              Completed
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
              Completed
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
