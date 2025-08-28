"use client";
import ViewDataTable from "@/components/dataTables/ViewDataTable";
import { apiConnector } from "@/utils/apihelper";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

const IDTAnalytics = () => {
  const [data, setData] = useState([]);
  const [idtData, setIdtData] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  //----------------------fetch idt analytics data-----------------------------
  const fetchIdtAnalyticsData = async () => {
    try {
      const response = await apiConnector(
        "GET",
        `${apiUrl}/v2/admin/reconciliation/idt-analytics`
      );
      const { data = [], dataArray = [] } = response.data.result || {};
      setData(data);
      setIdtData(dataArray);
      setLoading(false);
    } catch (error) {
      const errMsg = error.response.data.message;
      toast.error(errMsg || "An error occurred while processing the request.");
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIdtAnalyticsData();
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
        cell: (info) => info.row.original.date,
      },
      {
        header: "Day",
        accessorKey: "dayOfWeek",
        cell: (info) => info.row.original.dayOfWeek,
      },
    ],
    []
  );

  const idtColumns = useMemo(
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
        header: "COUNT OF 51",
        accessorKey: "count51",
        cell: (info) => {
          const values = info.row.original.values;
          return values && values["51"] ? values["51"].count : 0;
        },
      },
      {
        header: "COUNT OF 90",
        accessorKey: "count90",
        cell: (info) => {
          const values = info.row.original.values;
          return values && values["90"] ? values["90"].count : 0;
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
            title="IDT Analytics"
            cardHeader="analytics"
            columns={columns}
            data={data}
            isLoading={loading}
          />
        </div>
      </div>

      <div className="card mt-2">
        <div className="card-body">
          <ViewDataTable
            title="IDT Detailed Counts"
            cardHeader="details counts"
            columns={idtColumns}
            data={idtData}
            isLoading={loading}
          />
        </div>
      </div>
    </>
  );
};

export default IDTAnalytics;
