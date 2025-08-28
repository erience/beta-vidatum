"use client";
import ViewDataTable from "@/components/dataTables/ViewDataTable";
import { apiConnector } from "@/utils/apihelper";
import formatPeriodToDMY from "@/utils/helper";
import { Download, Upload } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

const Report55a = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  //----------------------fetch report55a data-----------------------------

  const fetchReport55a = async () => {
    try {
      const response = await apiConnector(
        "GET",
        `${apiUrl}/v2/admin/report/report55a`
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
    fetchReport55a();
  }, []);
  //------------------------------check address functionality----------------------
  const checkAddressFunction = async (isin, id) => {
    try {
      const response = await apiConnector(
        "POST",
        `${apiUrl}/v2/admin/report/checkAddress`,
        {
          isin,
        }
      );
      const data = response.data;
      if (data.status) {
        toast.success(response.data.result.message);
        const url = `/admin/report/downloadReport55a/${btoa(id)}`;
        window.open(url, "_blank");
      } else {
        toast.error(response.data.result.message);
      }
    } catch (error) {
      toast.error(
        "Address is not avaiable",
        error.response.data.result.message
      );
    }
  };

  //---------------------------dynamic column---------------------------
  const columns = useMemo(
    () => [
      {
        header: "#",
        accessorKey: "index",
        cell: (info) => info.row.index + 1,
      },
      {
        header: "Date",
        accessorKey: "date",
        cell: (info) => {
          const value = info.row.original.date;
          return value ? new Date(value).toLocaleDateString("en-GB") : "";
        },
      },
      {
        header: "ISIN",
        accessorKey: "isin",
        cell: (info) => info.row.original.isin,
      },

      {
        header: "Period",
        accessorKey: "period",
        cell: (info) => formatPeriodToDMY(info.row.original.period),
      },
      {
        header: "CDSL",
        accessorKey: "cdsl",
        cell: (info) => info.row.original.cdsl,
      },
      {
        header: "NSDL",
        accessorKey: "nsdl",
        cell: (info) => info.row.original.nsdl,
      },
      {
        header: "Physical",
        accessorKey: "phy",
        cell: (info) => info.row.original.phy,
      },

      {
        header: "Note",
        accessorKey: "notes",
        cell: (info) => (info.row.original.note ? info.row.original.note : "-"),
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
        header: "Actions",
        accessorKey: "",
        cell: ({ row }) => {
          const rowData = row.original;
          return (
            <>
              <button
                className="position-relative mx-3"
                onClick={() => checkAddressFunction(rowData.isin, rowData.id)}
              >
                <Download className="text-green-500" />
              </button>
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
            title="Upload Report 55a"
            cardHeader="Upload Report 55a"
            columns={columns}
            data={data}
            isLoading={loading}
          />
        </div>
      </div>
    </>
  );
};

export default Report55a;
