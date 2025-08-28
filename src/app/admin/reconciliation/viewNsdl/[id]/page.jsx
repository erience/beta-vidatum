"use client";
import { useEffect, useMemo, useState } from "react";
import { Eye } from "lucide-react";
import { useParams } from "next/navigation";
import { apiConnector } from "@/utils/apihelper";
import Link from "next/link";
import ViewDataTable from "@/components/dataTables/ViewDataTable";

const ViewNsdl = () => {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";

  const getNsdl = async () => {
    try {
      const response = await apiConnector(
        "GET",
        `${apiUrl}/v2/admin/reconcillation/getnsdldnr/${id}`
      );
      setData(response.data.result.data || []);
      setLoading(false);
    } catch (error) {
      const errMsg = error.response.data.message;
      toast.error(errMsg || "An error occurred while processing the request.");
      console.error("Error fetching data", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getNsdl();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString || new Date(dateString).toString() === "Invalid Date")
      return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const columns = useMemo(
    () => [
      { header: "#", cell: (info) => info.row.index + 1 },
      { header: "ISIN", accessorKey: "isin" },
      { header: "DP ID", accessorKey: "c" },
      { header: "Beneficiary Account Number", accessorKey: "f" },
      { header: "DRN / RRN/ CRN", accessorKey: "e" },
      { header: "First Holder’s Name", accessorKey: "g" },
      { header: "Second Holder’s Name", accessorKey: "i" },
      { header: "Third Holder’s Name", accessorKey: "j" },
      { header: "Free/Lock Flag", accessorKey: "k" },
      { header: "Requested Quantity", accessorKey: "n" },
      { header: "Internal Reference Number", accessorKey: "o" },
      {
        header: "Instruction receive date",
        cell: (info) => formatDate(info.row.original.p),
      },
      {
        header: "DRF / RRF Receive date/ CRF Receive date",
        cell: (info) => formatDate(info.row.original.q),
      },
      {
        header: "Confirmation date",
        cell: (info) => formatDate(info.row.original.t),
      },
      { header: "Accepted Quantity", accessorKey: "u" },
      { header: "Rejected Quantity", accessorKey: "v" },
      {
        header: "Action",
        cell: ({ row }) => {
          const e = row.original.e;
          return (
            <Link
              href={`/admin/reconciliation/viewNsdl/${e}`}
              title="Demat NSDL History"
            >
              <Eye className="text-green-600" size={20} />
            </Link>
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
            title="Demat NSDL History"
            cardHeader="Demat NSDL History data"
            columns={columns}
            data={data}
            isLoading={loading}
          />
        </div>
      </div>
    </>
  );
};

export default ViewNsdl;
