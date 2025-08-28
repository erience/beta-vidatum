"use client"
import ViewDataTable from "@/components/dataTables/ViewDataTable";
import { apiConnector } from "@/utils/apihelper";
import {  Eye } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

const InwardProcessv1 = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  //----------------------fetch InwardProcessv1 data-----------------------------
  const fetchInwardv1Data = async () => {
    try {
      const response = await apiConnector(
        "GET",
        `${apiUrl}/v2/admin/process/v1/inward-process-v1`
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
    fetchInwardv1Data();
  }, []);

  const columns = useMemo(
    () => [
      { header: "#", accessorKey: "index", cell: (info) => info.row.index + 1 },
      {
        header: "Inward Date",
        accessorKey: "date",
        cell: (info) => {
          const rawDate = info.row.original.date;

          if (!rawDate || rawDate === "0000-00-00") {
            return "-";
          }

          const date = new Date(rawDate);

          // Check for invalid date
          if (isNaN(date.getTime())) {
            return "-";
          }

          // Format date as DD-MM-YYYY (or customize as needed)
          const formattedDate = date.toLocaleDateString("en-GB"); // e.g., 07/04/2025

          return formattedDate;
        },
      },

      {
        header: "Ref No.",
        accessorKey: "ref",
        cell: (info) => info.row.original.ref,
      },
      {
        header: "ISIN",
        accessorKey: "isino",
        cell: (info) => info.row.original.isino,
      },

      {
        header: "Mode",
        accessorKey: "mode",
        cell: (info) => info.row.original.mode,
      },
      {
        header: "ISIN",
        accessorKey: "isin",
        cell: (info) => info.row.original.isin,
      },
      {
        header: "Mode",
        accessorKey: "mode",
        cell: (info) => info.row.original.mode,
      },
      {
        header: "Sender",
        accessorKey: "sender",
        cell: (info) => info.row.original.sender,
      },
      {
        header: "Type",
        accessorKey: "type",
        cell: (info) => info.row.original.type,
      },
      {
        header: "No. Of Shares",
        accessorKey: "count",
        cell: (info) => info.row.original.count,
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: () => (
          <span className="px-2 py-1 text-white bg-green-600 rounded-md">
            Approved
          </span>
        ),
      },
      {
        header: "",
        accessorKey: "action",
        cell: ({ row }) => {
          const rowData = row.original;
          return (
            <>
              <Link
                href={`/processv1/viewInwardv1/${btoa(
                  rowData?.id
                )}/${btoa(rowData?.isin)}`}
                title="View ISIN Data"
              >
                <Eye />
              </Link>
            </>
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
            title="Inward v1.0"
            cardHeader="Inward v1.0 data"
            columns={columns}
            data={data}
            isLoading={loading}
          />
        </div>
      </div>
    </>
  );
};

export default InwardProcessv1;
