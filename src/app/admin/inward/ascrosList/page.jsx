"use client";
import { Edit, Eye } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Upload } from "lucide-react";
import { apiConnector } from "@/utils/apihelper";
import { toast } from "react-toastify";
import Link from "next/link";
import ViewDataTable from "@/components/dataTables/ViewDataTable";
import { formatDMY } from "@/utils/helper";
import moment from "moment";
const ascrosList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  //----------------------fetch OutwardProcess data-----------------------------
  const fetchAcrosList = async () => {
    try {
      const response = await apiConnector(
        "GET",
        `${apiUrl}/v2/admin/getelapsedata`
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
    fetchAcrosList();
  }, []);

  const columns = useMemo(
    () => [
      { header: "#", accessorKey: "index", cell: (info) => info.row.index + 1 },
      {
        header: "ISIN",
        accessorKey: "isin_id",
        cell: (info) => info.row.original.isin_id || "-",
      },
      {
        header: "Approve Date",
        accessorKey: "approve_date",
        cell: (info) => formatDMY(info.row.original.p_date || "-"),
      },
      {
        header: "Transfer Date",
        accessorKey: "transfer_date",
        cell: (info) => {
          const p_date = info.row.original.p_date;
          const resultDate = moment(p_date, "MMM D, YYYY").add(120, "days");
          return resultDate.format("MMM D, YYYY");
        },
      },

      {
        header: "Process Ref No",
        accessorKey: "ref",
        cell: (info) => info.row.original.ref || "-",
      },
      {
        header: "Suspense LF No.",
        accessorKey: "sref",
        cell: (info) => "ESC0001",
      },

      {
        header: "Old Name",
        accessorKey: "sender",
        cell: (info) => info.row.original.sender || "-",
      },

      {
        header: "New Name",
        accessorKey: "newname",
        cell: (info) => "Vidatum Physical Escrow Account",
      },
      {
        header: "Suspense LF No.",
        accessorKey: "suspenself",
        cell: (info) => "ESC0001",
      },

      {
        header: "LOC Type",
        accessorKey: "type",
        cell: (info) => info.row.original.type || "-",
      },
      {
        header: "LOC Sub Type",
        accessorKey: "sub_type",
        cell: (info) => info.row.original.sub_type || "-",
      },
    ],
    []
  );
  return (
    <>
      <div className="card">
        <div className="card-body">
          <ViewDataTable
            title="Escrow Suspense Physical List"
            cardHeader="Escrow Suspense Physical List Data"
            columns={columns}
            data={data}
            isLoading={loading}
          />
        </div>
      </div>
    </>
  );
};

export default ascrosList;
