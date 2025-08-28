"use client";
import ViewDataTable from "@/components/dataTables/ViewDataTable";
import { apiConnector } from "@/utils/apihelper";
import { useEffect, useMemo, useState } from "react";

const UserIdtList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  //----------------------fetch KYC data-----------------------------
  const fetchIdtData = async () => {
    try {
      const response = await apiConnector(
        "GET",
        `${apiUrl}/v2/user/reconciliation/idt`
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
    fetchIdtData();
  }, []);

  //---------------------------dynamic column---------------------------
  const columns = useMemo(
    () => [
      { header: "#", accessorKey: "index", cell: (info) => info.row.index + 1 },
      {
        header: " Date",
        accessorKey: "date",
        cell: (info) => {
          const dateStr = info.row.original.date;
          const date = new Date(dateStr);
          return date.toLocaleDateString("en-GB");
        },
      },

      {
        header: "ISIN",
        accessorKey: "d",
        cell: (info) => info.row.original.d,
      },
      {
        header: "NSDL QTY",
        accessorKey: "e",
        cell: (info) => (Number(info.row.original.e) / 1000).toFixed(2),
      },
      {
        header: "NSDL Type",
        accessorKey: "n",
        cell: (info) => {
          const n = info.row.original.n;
          return n === "90" ? "IN" : n === "51" ? "OUT" : "Error";
        },
      },
      {
        header: "CDSL QTY",
        accessorKey: "e",
        cell: (info) => (Number(info.row.original.e) / 1000).toFixed(2),
      },
      {
        header: "CDSL Type",
        accessorKey: "n",
        cell: (info) => {
          const n = info.row.original.n;
          return n === "90" ? "OUT" : n === "51" ? "IN" : "Error";
        },
      },
      {
        header: "Mismatch",
        accessorKey: "mismatch",
        cell: () => 0,
      },
    ],
    [data]
  );

  return (
    <>
      <div className="card">
        <div className="card-body">
          <ViewDataTable
            title="IDT List"
            cardHeader="IDT List data"
            columns={columns}
            data={data}
            isLoading={loading}
            headerIcons={<div className="flex items-center gap-1"></div>}
          />
        </div>
      </div>
    </>
  );
};

export default UserIdtList;
