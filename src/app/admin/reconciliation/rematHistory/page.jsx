"use client";
import ViewDataTable from "@/components/dataTables/ViewDataTable";
import { apiConnector } from "@/utils/apihelper";
import { formatDMY } from "@/utils/helper";
import { Archive, Download, Edit, Eye, Upload } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

const RemateHistory = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  //----------------------fetch KYC data-----------------------------

  const fetchRematData = async () => {
    try {
      const response = await apiConnector(
        "GET",
        `${apiUrl}/v2/admin/reconciliation/remat`
      );
      const responseData = response.data.result.data || [];
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
        header: "Type",
        accessorKey: "type",
        cell: (info) => info.row.original.type,
      },
      {
        header: "ISIN",
        accessorKey: "isin",
        cell: (info) => info.row.original.isin,
      },
      {
        header: "Inward Date",
        accessorKey: "inward_date",
        cell: (info) => formatDMY(info.row.original.inward_date),
      },
      {
        header: "Count",
        accessorKey: "count",
        cell: (info) => info.row.original.count,
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
      {
        header: "IS_VIEW",
        accessorKey: "is_view",
        cell: (info) => (info.row.original.is_view === 1 ? "YES" : "NO"),
      },
    ],
    []
  );
  return (
    <>
      <div className="card">
        <div className="card-body">
          <ViewDataTable
            title="Remate History"
            cardHeader="Remat History Data"
            columns={columns}
            data={data}
            isLoading={loading}
            headerIcons={
              <div className="flex items-center gap-1">
                <Link
                  href="/admin/reconciliation/uploadRematCdsl"
                  title="Upload Remat CDSL"
                >
                  <Upload size={25} />
                </Link>
                <Link
                  href="/admin/reconciliation/uploadRematNsdl"
                  title="Upload Remat NSDL"
                >
                  <Archive size={25} />
                </Link>
              </div>
            }
          />
        </div>
      </div>
    </>
  );
};

export default RemateHistory;
