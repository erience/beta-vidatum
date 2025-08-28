"use client";
import ViewDataTable from "@/components/dataTables/ViewDataTable";
import { apiConnector } from "@/utils/apihelper";
import { Archive, Download, Edit, Eye, Upload } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

const CorporateList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  //----------------------fetch corporate data-----------------------------

  const fetchCorporateData = async () => {
    try {
      const response = await apiConnector(
        "GET",
        `${apiUrl}/v2/admin/reconciliation/ca`
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
    fetchCorporateData();
  }, []);

  const columns = useMemo(
    () => [
      {
        header: "#",
        accessorKey: "index",
        cell: (info) => info.row.index + 1,
      },
      {
        header: "Depository",
        accessorKey: "depository",
        cell: (info) => {
          const depository = info.row.original.depository;
          return depository == "2" ? "CDSL" : depository == "1" ? "NSDL" : "-";
        },
      },
      {
        header: "ISIN",
        accessorKey: "isin",
        cell: (info) => info.row.original.isin || "-",
      },
      {
        header: "ref",
        accessorKey: "ref",
        cell: (info) => info.row.original.ref || "-",
      },
      {
        header: "Allotment Date",
        accessorKey: "a_date",
        cell: (info) => {
          const date = new Date(info.row.original.a_date);
          return date instanceof Date && !isNaN(date)
            ? date.toLocaleDateString()
            : "-";
        },
      },
      {
        header: "Create Date",
        accessorKey: "c_date",
        cell: (info) => {
          const date = new Date(info.row.original.c_date);
          return date instanceof Date && !isNaN(date)
            ? date.toLocaleDateString()
            : "-";
        },
      },
      {
        header: "Type",
        accessorKey: "type",
        cell: (info) => info.row.original.type || "-",
      },
      {
        header: "Is Share",
        accessorKey: "is_share",
        cell: (info) => (info.row.original.is_share === 1 ? "Yes" : "No"),
      },
      {
        header: "Shares",
        accessorKey: "count",
        cell: (info) => info.row.original.count || 0,
      },
      {
        header: "Description",
        accessorKey: "des",
        cell: (info) => info.row.original.des || "-",
      },
      {
        header: "Remarks",
        accessorKey: "remarks",
        cell: (info) => info.row.original.remarks || "-",
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
    ],
    []
  );

  return (
    <>
      <div className="card">
        <div className="card-body">
          <ViewDataTable
            title="Corporate Action List"
            cardHeader="Corporate Action List data"
            columns={columns}
            data={data}
            loading={loading}
            headerIcons={
              <div className="flex items-center gap-1">
                <Link
                  href="/admin/reconciliation/addCorporateAction"
                  title="Add Corporate Action"
                >
                  <Upload size={25} />
                </Link>
                <Link
                  href="/admin/reconciliation/uploadCorporationFile"
                  title=" Upload Corporate Action File"
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

export default CorporateList;
