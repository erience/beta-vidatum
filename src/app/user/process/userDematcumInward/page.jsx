"use client";
import ViewDataTable from "@/components/dataTables/ViewDataTable";
import { apiConnector } from "@/utils/apihelper";
import { Eye } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

const UserDematcumInward = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  //----------------------fetch dematCum data-----------------------------
  const fetchDematCumData = async () => {
    try {
      const response = await apiConnector(
        "GET",
        `${apiUrl}/v2/user/process/dematcuminward`
      );
      const responseData = response.data.result.inward || [];
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
    fetchDematCumData();
  }, []);

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
        header: "Status",
        accessorKey: "status",
        cell: (info) => {
          const status = info.row.original.status;
          switch (status) {
            case 1:
              return <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">Active</span>;
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
                <Eye className="text-green-500" />
              </Link>
            </>
          );
        },
      },
    ],
    [data]
  );

  return (
    <>
      <div className="card">
        <div className="card-body">
          <ViewDataTable
            title="Demat Cum Transmission Inward Process"
            cardHeader="Demat Cum Transmission Inward Process data"
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

export default UserDematcumInward;
