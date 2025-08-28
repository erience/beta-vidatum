"use client";
import ViewDataTable from "@/components/dataTables/ViewDataTable";
import { apiConnector } from "@/utils/apihelper";
import { formatDateLong } from "@/utils/helper";
import { Download, Eye } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

const UserAllInward = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  //----------------------fetch inward data-----------------------------

  const fetchAllInwardData = async () => {
    try {
      const response = await apiConnector(
        "GET",
        `${apiUrl}/v2/user/process/inward-indexv2`
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
    fetchAllInwardData();
  }, []);

  //---------------------------dynamic column---------------------------
  const columns = useMemo(
    () => [
      { header: "#", accessorKey: "index", cell: (info) => info.row.index + 1 },
      {
        header: "Inward Date",
        accessorKey: "date",
        cell: (info) => formatDateLong(info.row.original.date),
      },
      {
        header: "Process Date",
        accessorKey: "p_date",
        cell: (info) => formatDateLong(info.row.original.p_date),
      },

      {
        header: "Ref No.",
        accessorKey: "ref",
        cell: (info) => info.row.original.ref,
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
        header: "Location",
        accessorKey: "location",
        cell: (info) => info.row.original.location,
      },
      {
        header: "Sub Type",
        accessorKey: "sub_type",
        cell: (info) =>
          info.row.original.sub_type ? info.row.original.sub_type : "-",
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: (info) => {
          const status = info.row.original.status;
          switch (status) {
            case 1:
              return <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">Approve</span>;
            case 2:
              return (
                <span className="px-2 py-1 text-yellow-500 bg-yellow-100 rounded-md">
                  Pending
                </span>
              );
            case 3:
              return <span className="inline-block bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 rounded-full">Rejected</span>;
            case 4:
              return (
                <span className="px-2 py-1 text-white bg-gray-500 rounded-md">
                  Deleted
                </span>
              );
            case 5:
              return (
             <span className=" inline-block text-white bg-blue-500  inline-block  text-xs font-semibold px-3 py-1 rounded-full">
                  Partial Approved
                </span>
              );
            default:
              return "Unknown";
          }
        },
      },
      {
        header: "Download",
        accessorKey: "filepath",
        cell: ({ row }) => {
          const filepath = row.original.filepath;
          return filepath ? (
            <Link
              target="_blank"
              href={`/inwardpdfs/${filepath}`}
              rel="noopener noreferrer"
            >
              <Download />
            </Link>
          ) : (
            <span></span>
          );
        },
      },

      {
        header: "Action",
        accessorKey: "",
        cell: ({ row }) => {
          const rowData = row.original;
          return (
            <>
              <Link
                target="_blank"
                href={`/user/process/userViewAllInward?ref=${btoa(rowData.ref)}`}
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
            title="All Inward"
            cardHeader="all inward data"
            columns={columns}
            data={data}
            isLoading={loading}
            headerIcons={<div className="flex items-center gap-1"></div>}
          />
        </div>
      </div>
    </>
  );
};

export default UserAllInward;
