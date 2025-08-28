"use client";
import ViewDataTable from "@/components/dataTables/ViewDataTable";
import { apiConnector } from "@/utils/apihelper";
import { Archive, Upload } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";

const DemateLog = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";

  //----------------------fetch demat log data-----------------------------
  const fetchDematLogs = async () => {
    try {
      const response = await apiConnector(
        "GET",
        `${apiUrl}/v2/admin/actionHistory/get-demat-log`
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
    fetchDematLogs();
  }, []);

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
        cell: (info) => {
          const type = info.row.original.type;
          if (type === 1) return "NSDL";
          if (type === 2) return "CDSL";
          if (type === 3) return "Physical";
          return type;
        },
      },
      {
        header: "ISIN",
        accessorKey: "isin",
        cell: (info) => info.row.original.isin,
      },
      {
        header: "DP_NAME",
        accessorKey: "dp_name",
        cell: (info) => info.row.original.dp_name,
      },
      {
        header: "DP_ID",
        accessorKey: "dp_id",
        cell: (info) => info.row.original.dp_id,
      },
      {
        header: "C_ID",
        accessorKey: "c_id",
        cell: (info) => info.row.original.c_id,
      },
      {
        header: "DRN",
        accessorKey: "drn",
        cell: (info) => info.row.original.drn,
      },
      {
        header: "S_DATE",
        accessorKey: "s_date",
        cell: (info) =>
          info.row.original.s_date
            ? new Date(info.row.original.s_date).toLocaleDateString("en-US")
            : "",
      },
      {
        header: "INWARD_NO",
        accessorKey: "inward_no",
        cell: (info) => info.row.original.inward_no,
      },
      {
        header: "I_DATE",
        accessorKey: "i_date",
        cell: (info) =>
          info.row.original.i_date
            ? new Date(info.row.original.i_date).toLocaleDateString("en-US")
            : "",
      },
      {
        header: "T_QTY",
        accessorKey: "t_qty",
        cell: (info) => info.row.original.t_qty,
      },
      {
        header: "A_QTY",
        accessorKey: "a_qty",
        cell: (info) => info.row.original.a_qty,
      },
      {
        header: "R_QTY",
        accessorKey: "r_qty",
        cell: (info) => info.row.original.r_qty,
      },
      {
        header: "C_DATE",
        accessorKey: "c_date",
        cell: (info) =>
          info.row.original.c_date
            ? new Date(info.row.original.c_date).toLocaleDateString("en-US")
            : "",
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: (info) => {
          const status = info.row.original.status;
          switch (status) {
            case 1:
              return "Closed & Settled";
            case 2:
              return "Closed & Cancelled by Client";
            case 3:
              return "Closed & Cancelled by RTA";
            case 4:
              return "Partial Closed & Settled";
            default:
              return status;
          }
        },
      },
      {
        header: "IS_VIEW",
        accessorKey: "is_view",
        cell: (info) => (info.row.original.is_view === 1 ? "YES" : "NO"),
      },
    ],
    []
  );

  return (
    <>
      <div className="card">
        <div className="card-body">
          <ViewDataTable
            title="Demat Log"
            columns={columns}
            cardHeader="demat logs data"
            data={data}
            loading={loading}
            headerIcons={
              <div className="flex items-center gap-1">
                <Link href="/admin/actionHistory/demat-cdsl">
                  <button type="button" title="">
                    <Upload size={25} />
                  </button>
                </Link>
                <Link href="/admin/actionHistory/demat-nsdl">
                  <button type="button" title="">
                    <Archive size={25} />
                  </button>
                </Link>
              </div>
            }
          />
        </div>
      </div>
    </>
  );
};

export default DemateLog;
