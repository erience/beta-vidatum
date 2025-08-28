"use client";
import ViewDataTable from "@/components/dataTables/ViewDataTable";
import { apiConnector } from "@/utils/apihelper";
import { formatDMY } from "@/utils/helper";
import { Download, Edit, Eye, Upload } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

const IDTList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  //----------------------fetch KYC data-----------------------------
  const fetchIdtData = async () => {
    try {
      const response = await apiConnector(
        "GET",
        `${apiUrl}/v2/admin/reconcillation/idt`
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
    fetchIdtData();
  }, []);

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
        cell: (info) => formatDMY(info.row.original.date),
      },
      {
        header: "ISIN",
        accessorKey: "d",
        cell: (info) => info.row.original.d,
      },
      {
        header: "NSDL QTY",
        accessorKey: "e",
        cell: (info) => Number(info.row.original.e) / 1000,
      },
      {
        header: "NSDL Type",
        accessorKey: "n",
        cell: (info) => {
          const n = info.row.original.n;
          if (n === "90") return "IN";
          if (n === "51") return "OUT";
          return "Error";
        },
      },
      {
        header: "CDSL QTY",
        accessorKey: "e",
        cell: (info) => Number(info.row.original.e) / 1000,
      },
      {
        header: "CDSL Type",
        accessorKey: "n",
        cell: (info) => {
          const n = info.row.original.n;
          if (n === "90") return "OUT";
          if (n === "51") return "IN";
          return "Error";
        },
      },
      {
        header: "Mismatch",
        accessorKey: "mismatch",
        cell: () => 0,
      },
    ],
    []
  );

  return (
    <>
      <div className="card">
        <div className="card-body">
          <ViewDataTable
            title="IDT List"
            cardHeader=" The contents of this table are restricted to Active ISINs, which are
            billable and subject to quarterly maintenance fees. To qualify as
            active, an ISIN must possess an active status in either the CDSL or
            NSDL system."
            columns={columns}
            data={data}
            isLoading={loading}
            headerIcons={
              <div className="flex items-center gap-1">
                <Link href="/admin/reconciliation/addIdt">
                  <button type="button" title="">
                    <Upload size={25} />
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

export default IDTList;
