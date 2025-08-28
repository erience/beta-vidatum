"use client";
import { Eye } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { apiConnector } from "@/utils/apihelper";
import Link from "next/link";
import ViewDataTable from "@/components/dataTables/ViewDataTable";
import { toast } from "react-toastify";

const TransferInward = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [activeYear, setActiveYear] = useState(null);

  // Fetch Transfer Inward Data
  const fetchTransferData = async () => {
    try {
      const response = await apiConnector(
        "GET",
        `${apiUrl}/v2/admin/process/inward/transfer-inward?table=b_inward&isin=b_isin`
      );
      const responseData = response.data.result.sortedyear || {};
      const years = Object.keys(responseData);
      if (years.length > 0) setActiveYear(years[0]);
      setData(responseData);
    } catch (error) {
      const errMsg = error?.response?.data?.message;
      toast.error(errMsg || "An error occurred while fetching data.");
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransferData();
  }, []);

  const columns = useMemo(
    () => [
      { header: "#", accessorKey: "index", cell: (info) => info.row.index + 1 },
      {
        header: "Inward Date",
        accessorKey: "date",
        cell: (info) => {
          const dateStr = info.row.original.date;
          const date = dateStr ? new Date(dateStr) : null;
          return date ? date.toLocaleDateString("en-GB") : "-";
        },
      },
      {
        header: "Process Date",
        accessorKey: "p_date",
        cell: (info) => {
          const rawDate = info.row.original.p_date;

          if (!rawDate) return "-";

          const parsedDate = new Date(Date.parse(rawDate));

          return isNaN(parsedDate)
            ? "-"
            : parsedDate.toLocaleDateString("en-GB");
        },
      },
      {
        header: "Ref No.",
        accessorKey: "ref",
        cell: (info) => info.row.original.ref || "-",
      },
      {
        header: "LF",
        accessorKey: "lf",
        cell: (info) => info.row.original.lf || "-",
      },
      {
        header: "ISIN",
        accessorKey: "isin",
        cell: (info) => info.row.original.isin || "-",
      },
      {
        header: "Company Name",
        accessorKey: "cin",
        cell: (info) => info.row.original.cin || "-",
      },
      {
        header: "Type",
        accessorKey: "type",
        cell: (info) => info.row.original.type || "-",
      },
      {
        header: "Sub Type",
        accessorKey: "sub_type",
        cell: (info) => info.row.original.sub_type || "-",
      },
      {
        header: "Mode",
        accessorKey: "mode",
        cell: (info) => info.row.original.mode || "-",
      },
      {
        header: "Sender",
        accessorKey: "sender",
        cell: (info) => info.row.original.sender || "-",
      },
      {
        header: "Location",
        accessorKey: "location",
        cell: (info) => info.row.original.location || "-",
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
      {
        header: "View",
        accessorKey: "actions",
        cell: ({ row }) => (
          <Link
            href={`/admin/inward/viewInward/${encodeURIComponent(
              row.original.ref
            )}`}
            title="View ISIN Data"
          >
            <Eye className="text-green-500" />
          </Link>
        ),
      },
    ],
    []
  );

  const yearTabs = Object.keys(data).sort((a, b) => {
    const yearA = parseInt(a.replace("year_", ""));
    const yearB = parseInt(b.replace("year_", ""));
    return yearB - yearA;
  });

  return (
    <div className="card">
      <div className="card-body">
        <div className="flex gap-4  mb-6">
          {yearTabs.map((yearKey) => {
            const year = yearKey.replace("year_", "");
            return (
              <button
                key={yearKey}
                onClick={() => setActiveYear(yearKey)}
                className={`px-4 py-2 font-medium ${
                  activeYear === yearKey
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500"
                }`}
              >
                {year}
              </button>
            );
          })}
        </div>

        <ViewDataTable
          title="Transfer Inward Process"
          cardHeader="transferInward"
          columns={columns}
          data={data[activeYear] || []}
          isLoading={loading}
        />
      </div>
    </div>
  );
};

export default TransferInward;
