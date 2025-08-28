"use client";
import { Edit, Eye } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Upload } from "lucide-react";
import { apiConnector } from "@/utils/apihelper";
import { toast } from "react-toastify";
import Link from "next/link";
import ViewDataTable from "@/components/dataTables/ViewDataTable";

const OutwardProcess = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  //----------------------fetch OutwardProcess data-----------------------------
  const fetchOutwardData = async () => {
    try {
      const response = await apiConnector(
        "GET",
        `${apiUrl}/v2/admin/process/outward/outward_process`
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
    fetchOutwardData();
  }, []);

  const columns = useMemo(
    () => [
      { header: "#", accessorKey: "index", cell: (info) => info.row.index + 1 },
      {
        header: "Date",
        accessorKey: "o_date",
        cell: (info) => info.row.original.o_date,
      },

      {
        header: "Delivery Date",
        accessorKey: "d_date",
        cell: (info) => info.row.original.d_date,
      },
      {
        header: "Outward No",
        accessorKey: "outward_ref",
        cell: (info) => info.row.original.outward_ref,
      },

      {
        header: "Inward Ref No",
        accessorKey: "inward_ref",
        cell: (info) => info.row.original.inward_ref,
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
        header: "AWB/Track Id",
        accessorKey: "awb",
        cell: (info) => info.row.original.awb,
      },
      {
        header: "Sender",
        accessorKey: "sender",
        cell: (info) => info.row.original.sender || "-",
      },
      {
        header: "Company Name",
        accessorKey: "cin",
        cell: (info) => info.row.original.cin || "-",
      },
      {
        header: "Holder Name",
        accessorKey: "name",
        cell: (info) => info.row.original.name || "-",
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: (info) => {
          const status = info.row.original.status;
          switch (status) {
            case 3:
              return (
                <span className="inline-block bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 rounded-full">
                  Delete
                </span>
              );
            case 2:
              return (
                <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                  Active
                </span>
              );
            case 1:
              return (
                <span className="inline-block  text-xs font-semibold px-3 py-1 rounded-full text-yellow-500 bg-yellow-100">
                  Pending
                </span>
              );
            default:
              return (
                <span className="px-2 py-1 text-white bg-gray-500 rounded-md">
                  Error
                </span>
              );
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
              <div className="flex gap-2">
                {/* <Link
                  href={`/admin/outward/viewOutwardV2/${btoa(
                    rowData?.id
                  )}/${btoa(rowData?.isin)}`}
                  title="View ISIN Data"
                >
                  <Eye className="text-green-500" size={20} />
                </Link> */}

                <Link
                  href={`/admin/outward/editOutward/${btoa(
                    rowData.outward_ref
                  )}`}
                  title="Edit Outward Data"
                >
                  <Edit className="text-green-500" size={20} />
                </Link>
              </div>
            </>
          );
        },
      },
      {
        header: "Inward",
        accessorKey: "inward",
        cell: ({ row }) => {
          const rowData = row.original;
          return (
            <>
              <Link
                href={`/admin/inward/viewInward/${encodeURIComponent(
                  rowData?.inward_ref
                )}`}
                title="View ISIN Data"
              >
                <Eye className="text-green-500" size={20} />
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
            title="Outward Process"
            cardHeader="outward Process data"
            columns={columns}
            data={data}
            isLoading={loading}
            headerIcons={
              <div className="flex items-center gap-1">
                <Link
                  target="_blank"
                  href={"/admin/outward/uploadOutwardProcess"}
                  title="process"
                >
                  <Upload size={20} />
                </Link>
              </div>
            }
          />
        </div>
      </div>
    </>
  );
};

export default OutwardProcess;
