"use client";
import { useEffect, useMemo, useState } from "react";
import { Activity, Archive, Eye, Upload } from "lucide-react";
import { apiConnector } from "@/utils/apihelper";
import { toast } from "react-toastify";
import Link from "next/link";
import ViewDataTable from "@/components/dataTables/ViewDataTable";

const NsdlDematHistory = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const fetchNsdlData = async () => {
    try {
      const response = await apiConnector(
        "GET",
        `${apiUrl}/v2/admin/api/reconciliation/demat-nsdl`
      );
      const responseData = response.data.result.data || [];
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
    fetchNsdlData();
  }, []);

  const columns = useMemo(
    () => [
      {
        header: "#",
        accessorKey: "index",
        cell: (info) => info.row.index + 1,
      },
      { header: "Isin", accessorKey: "isin" },
      { header: "DP ID", accessorKey: "c" },
      { header: "Beneficiary Account Number", accessorKey: "f" },
      { header: "DRN / RRN / CRN", accessorKey: "e" },
      { header: "First Holder’s Name", accessorKey: "g" },
      { header: "Second Holder’s Name", accessorKey: "i" },
      { header: "Third Holder’s Name", accessorKey: "j" },
      { header: "Free/Lock Flag", accessorKey: "k" },
      {
        header: "Requested Quantity",
        accessorKey: "n",
        cell: (info) => info.row.original.n,
      },
      { header: "Internal Reference Number", accessorKey: "o" },
      {
        header: "Instruction receive date",
        accessorKey: "p",
        cell: (info) =>
          info.row.original.p
            ? new Date(info.row.original.p).toLocaleDateString("en-US", {
                month: "numeric",
                day: "numeric",
                year: "numeric",
              })
            : "-",
      },
      {
        header: "DRF / RRF Receive date/ CRF Receive date",
        accessorKey: "q",
        cell: (info) =>
          info.row.original.q
            ? new Date(info.row.original.q).toLocaleDateString("en-US", {
                month: "numeric",
                day: "numeric",
                year: "numeric",
              })
            : "-",
      },
      {
        header: "Confirmation date",
        accessorKey: "t",
        cell: (info) =>
          info.row.original.t
            ? new Date(info.row.original.t).toLocaleDateString("en-US", {
                month: "numeric",
                day: "numeric",
                year: "numeric",
              })
            : "-",
      },
      {
        header: "Accepted Quantity",
        accessorKey: "u",
        cell: (info) => info.row.original.u,
      },
      {
        header: "Rejected Quantity",
        accessorKey: "v",
        cell: (info) => info.row.original.v,
      },
      {
        header: "Action",
        accessorKey: "action",
        cell: (info) => {
          const e = info.row.original.e;
          return (
            <Link href={`/admin/reconciliation/viewNsdl/${e}`} title="View Record">
              <Eye className="text-green-600" size={20} />
            </Link>
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
            title="NSDL Demat History"
            columns={columns}
            cardHeader="NSDL demat history data "
            data={data}
            isLoading={loading}
            headerIcons={
              <div className="flex items-center gap-3">
                <Link
                  href="/admin/reconciliation/getNsdlDemateAnalytics"
                  title="Demat History NSDL Analytics"
                >
                  <Activity size={20} />
                </Link>
                <Link
                  href="/admin/reconciliation/uploadCdslDematHistory"
                  title="Add/Update Demat CDSL"
                >
                  <Upload size={20} />
                </Link>
                <Link
                  href="/admin/reconciliation/nsdlDemateFilesUpload"
                  title="Add/Update Demat NSDL"
                >
                  <Archive size={20} />
                </Link>
              </div>
            }
          />
        </div>
      </div>
    </>
  );
};

export default NsdlDematHistory;
