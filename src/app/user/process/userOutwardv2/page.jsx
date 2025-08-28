"use client";
import ViewDataTable from "@/components/dataTables/ViewDataTable";
import { apiConnector } from "@/utils/apihelper";
import { Eye } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const UserOutwardv2 = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  //----------------------fetch outward data-----------------------------
  const fetchOutwardData = async () => {
    try {
      const response = await apiConnector(
        "GET",
        `${apiUrl}/v2/user/process/outward-indexv1`
      );
      const result = response.data.result || {};
      const inwardData = result.inward || [];

      // Enrich data with ISIN and handle errors
      const enrichedData = inwardData.map((item) => {
        try {
          return {
            ...item,
            isin: result.isin || "",
          };
        } catch (err) {
          console.error("Error enriching item:", item, err);
          return {};
        }
      });
      console.log({ enrichedData });
      setData(enrichedData);
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

  //---------------------------dynamic column---------------------------
  const columns = useMemo(
    () => [
      { header: "#", accessorKey: "index", cell: (info) => info.row.index + 1 },
      {
        header: "Date",
        accessorKey: "date",
        cell: (info) => {
          const dateStr = info.row.original.date;
          const date = new Date(dateStr);
          return date.toLocaleDateString("en-GB");
        },
      },
      {
        header: "ISIN",
        accessorKey: "isin",
        cell: (info) => info.row.original.isin,
      },
      {
        header: "Outward Number ",
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
        accessorKey: "s_name",
        cell: (info) => info.row.original.s_name,
      },
      {
        header: "Address",
        accessorKey: "address1",
        cell: (info) => {
          const { address1, address2, address3 } = info.row.original;
          return `${address1}, ${address2}, ${address3}`;
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
        cell: (info) => {
          const status = info.row.original.status;
          switch (status) {
            case 1:
              return (
                <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                  Active
                </span>
              );
            case 2:
              return (
                <span className="inline-block  text-xs font-semibold px-3 py-1 rounded-full text-yellow-500 bg-yellow-100">
                  Pending
                </span>
              );
            case 3:
              return (
                <span className="inline-block bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 rounded-full">
                  Rejected
                </span>
              );
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
                href={`/user/process/viewoutwardv2/${btoa(rowData.id)}`}
                title="View ISIN Data"
              >
                <Eye />
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
            title="Outward v2.0"
            cardHeader="outward data"
            columns={columns}
            data={data}
            isLoading={loading}
          />
        </div>
      </div>
    </>
  );
};

export default UserOutwardv2;
