"use client";
import ViewDataTable from "@/components/dataTables/ViewDataTable";
import { apiConnector } from "@/utils/apihelper";
import { Eye, Upload } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

const IsinList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  //----------------------fetch KYC data-----------------------------
  useEffect(() => {
    apiConnector("GET", `${apiUrl}/v2/admin/reconciliation/index`)
      .then((response) => {
        const responseData = response.data.result || [];
        console.log({ responseData });
        setData(responseData);
        setLoading(false);
      })
      .catch((error) => {
        const errMsg = error.response.data.message;
        toast.error(
          errMsg || "An error occurred while processing the request."
        );
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    console.log({ data: data.isin });
  }, [data]);

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
        header: "Company Name",
        accessorKey: "cin",
        cell: (info) => info.row.original.cin,
      },
      {
        header: "ISIN",
        accessorKey: "isin",
        cell: (info) => info.row.original.isin,
      },
      {
        header: "CDSL",
        accessorKey: "cdsl",
        cell: (info) => info.row.original.cdsl,
      },
      {
        header: "CDSL Date",
        accessorKey: "c_date",
        cell: (info) => {
          const value = info.row.original.c_date;
          if (!value || value === "0000-00-00") return "-";

          const date = new Date(value);
          if (isNaN(date.getTime())) return "-";
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");

          return `${year}-${month}-${day}`;
        },
      },

      {
        header: "NSDL",
        accessorKey: "nsdl",
        cell: (info) => (info.row.original.nsdl ? info.row.original.nsdl : "-"),
      },
      {
        header: "NSDL Date",
        accessorKey: "n_date",
        cell: (info) => {
          const value = info.row.original.n_date;

          if (!value || value === "0000-00-00") return "-";

          const date = new Date(value);
          if (isNaN(date.getTime())) return "-";

          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");

          return `${year}-${month}-${day}`;
        },
      },
      {
        header: "Remarks",
        accessorKey: "remarks",
        cell: (info) =>
          info.row.original.remarks ? info.row.original.remarks : "-",
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
                <span className="inline-block bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 rounded-full">
                  Delete
                </span>
              );
            default:
              return (
                <span className="inline-block bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 rounded-fullm">
                  Something went wrong
                </span>
              );
          }
        },
      },
      {
        header: "Actions",
        accessorKey: "",
        cell: ({ row }) => {
          const rowData = row.original;
          return (
            <>
              <Link
                href={`/admin/reconciliation/viewReconciliation/${rowData?.isin}`}
                title="Reconciliation List"
              >
                <Eye className="text-green-500" />
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
            title="Reconciliation List"
            cardHeader=" The contents of this table are restricted to Active ISINs, which are
          billable and subject to quarterly maintenance fees. To qualify as
          active, an ISIN must possess an active status in either the CDSL or
          NSDL system."
            columns={columns}
            data={data}
            isLoading={loading}
            // headerIcons={
            //   <div className="flex items-center gap-1">
            //     <Link href="/admin/user/edit-user">
            //       <button type="button" title="">
            //         <Upload size={25} />
            //       </button>
            //     </Link>
            //   </div>
            // }
          />
        </div>
      </div>
    </>
  );
};

export default IsinList;
