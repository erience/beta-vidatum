"use client";
import { Edit, Eye } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Upload } from "lucide-react";
import { apiConnector } from "@/utils/apihelper";
import { toast } from "react-toastify";
import Link from "next/link";
import ViewDataTable from "@/components/dataTables/ViewDataTable";
import { formatDMY } from "@/utils/helper";

const OutwardProcessv2 = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  //----------------------fetch OutwardProcess data-----------------------------
  const fetchOutwardData = async () => {
    try {
      const response = await apiConnector(
        "GET",
        `${apiUrl}/v2/admin/process/outward/outward_process_2?table=b_inward_v2`
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
    fetchOutwardData();
  }, []);

  const columns = useMemo(
    () => [
      { header: "#", accessorKey: "index", cell: (info) => info.row.index + 1 },
      {
        header: "Date",
        accessorKey: "o_date",
        cell: (info) => formatDMY(info.row.original.o_date || "-"),
      },

      {
        header: "Delivery Date",
        accessorKey: "d_date",
        cell: (info) => formatDMY(info.row.original.d_date || "-"),
      },
      {
        header: "Outward No",
        accessorKey: "outward_ref",
        cell: (info) => info.row.original.outward_ref || "-",
      },

      {
        header: "Inward Ref No",
        accessorKey: "inward_ref",
        cell: (info) => info.row.original.inward_ref || "-",
      },
      {
        header: "ISIN",
        accessorKey: "isin",
        cell: (info) => info.row.original.isin || "-",
      },
      {
        header: "Mode",
        accessorKey: "mode",
        cell: (info) => info.row.original.mode || "-",
      },
      {
        header: "AWB/Track Id",
        accessorKey: "awb",
        cell: (info) => info.row.original.awb || "-",
      },
      {
        header: "Status",
        accessorKey: "ori_s",
        cell: (info) => info.row.original.ori_s || "-",
      },
    ],
    []
  );
  return (
    <>
      <div className="card">
        <div className="card-body">
          <ViewDataTable
            title="Outward Process Data"
            cardHeader="outward Process data"
            columns={columns}
            data={data}
            isLoading={loading}
            headerIcons={
              <div className="flex items-center gap-1">
                <Link
                  target="_blank"
                  href={"/admin/outward/uploadOutwardProcess"}
                  title="process"
                >
                  <Upload size={20} />
                </Link>
              </div>
            }
          />
        </div>
      </div>
    </>
  );
};

export default OutwardProcessv2;
