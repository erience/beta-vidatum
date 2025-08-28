"use client";
import ViewDataTable from "@/components/dataTables/ViewDataTable";
import { apiConnector } from "@/utils/apihelper";
import { Eye } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

const OutwardProcessv1 = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  //----------------------fetch OutwardProcessv1 data-----------------------------
  const fetchOutwardv1Data = async () => {
    try {
      const response = await apiConnector(
        "GET",
        `${apiUrl}/v2/admin/process/v1/outward-process-v1`
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
    fetchOutwardv1Data();
  }, []);

  const columns = useMemo(
    () => [
      { header: "#", accessorKey: "index", cell: (info) => info.row.index + 1 },
      {
        header: "Date",
        accessorKey: "date",
        cell: (info) => {
          const rawDate = info.row.original.date;

          if (rawDate === "0000-00-00") {
            return "-";
          }

          const date = new Date(rawDate);
          const day = date.getDate();
          const month = date.getMonth() + 1;
          const year = date.getFullYear();

          // Optional: pad day/month with leading zero
          const formattedDate = `${day}/${month}/${year}`;
          return formattedDate;
        },
      },
      {
        header: "ISIN",
        accessorKey: "isin",
        cell: (info) => info.row.original.isin,
      },
      {
        header: "Outward Number",
        accessorKey: "number",
        cell: (info) => info.row.original.number,
      },

      {
        header: "Name/Sender",
        accessorKey: "name",
        cell: (info) => info.row.original.name,
      },
      {
        header: "Inward Reference Number",
        accessorKey: "inward_ref",
        cell: (info) => info.row.original.inward_ref,
      },
      {
        header: "Mode",
        accessorKey: "mode",
        cell: (info) => info.row.original.mode,
      },
      {
        header: "Tracking Id",
        accessorKey: "track_id",
        cell: (info) => info.row.original.track_id,
      },
      {
        header: "ShareHolder Name",
        accessorKey: "name",
        cell: (info) => info.row.original.name,
      },
      {
        header: "Address",
        accessorKey: "address",
        cell: (info) => {
          const { address1, address2, address3 } = info.row.original;
          return `${address1 || ""} ${address2 || ""} ${address3 || ""}`.trim();
        },
      },
      {
        header: "City",
        accessorKey: "city",
        cell: (info) => info.row.original.city,
      },
      {
        header: "State",
        accessorKey: "state",
        cell: (info) => info.row.original.state,
      },
      {
        header: "Pin",
        accessorKey: "pin",
        cell: (info) => info.row.original.pin,
      },
      {
        header: "AWB",
        accessorKey: "awb",
        cell: (info) => info.row.original.awb,
      },
      {
        header: "Reason",
        accessorKey: "reason",
        cell: (info) => info.row.original.reason,
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: (info) => info.row.original.status,
      },

      {
        header: "Action",
        accessorKey: "action",
        cell: ({ row }) => {
          const rowData = row.original;
          return (
            <>
              <Link
                href={`/admin/processv1/viewOutwardv1/${btoa(rowData.id)}/${btoa(
                  rowData.isin
                )}`}
                title="View Outward Data"
              >
                <Eye className="text-green-500" size={20}/>
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
            title="Outward v1.0"
            cardHeader="Outwrard v1.0 data"
            columns={columns}
            data={data}
            isLoading={loading}
          />
        </div>
      </div>
    </>
  );
};

export default OutwardProcessv1;
