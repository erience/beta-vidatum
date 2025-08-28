"use client";
import ViewDataTable from "@/components/dataTables/ViewDataTable";
import { apiConnector } from "@/utils/apihelper";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

const Benpose250Holders = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { date, benposType } = useParams();
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  //----------------------fetch short benpose data-----------------------------
  const fetchReport250Data = async () => {
    try {
      const response = await apiConnector(
        "GET",
        `${apiUrl}/v2/user/benpose/report-250/${date}/${benposType}`
      );
      const rawData = response.data.data || {};

      const formattedData = Object.keys(rawData)
        .filter((key) => !isNaN(key))
        .map((key) => rawData[key]);

      setData(formattedData);
      setLoading(false);
    } catch (error) {
      const errMsg = error.response.data.message;
      toast.error(errMsg || "An error occurred while processing the request.");
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport250Data();
  }, []);

  //--------------------------------dynamic columns--------------------------------
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
        cell: (info) => info.row.original.date || "-",
      },
      {
        header: "ISIN",
        accessorKey: "isin",
        cell: (info) => info.row.original.isin || "-",
      },
      {
        header: "Category",
        accessorKey: "label",
        cell: (info) => info.row.original.label || "-",
      },
      {
        header: "LF",
        accessorKey: "lf",
        cell: (info) => info.row.original.lf || "-",
      },
      {
        header: "First Holder Name",
        accessorKey: "f_holder",
        cell: (info) => info.row.original.f_holder || "-",
      },
      {
        header: "First Holder PAN",
        accessorKey: "f_pan",
        cell: (info) => info.row.original.f_pan || "-",
      },
      {
        header: "Total Shares",
        accessorKey: "total_sum",
        cell: (info) => info.row.original.total_sum || "-",
      },
      {
        header: "Lock-In Shares",
        accessorKey: "lock",
        cell: (info) => info.row.original.lock || "-",
      },
      {
        header: "Pledged Shares",
        accessorKey: "pledge",
        cell: (info) => info.row.original.pledge || "-",
      },
      {
        header: "Remat Shares",
        accessorKey: "remat",
        cell: (info) => info.row.original.remat || "-",
      },
    ],
    []
  );
  return (
    <>
      <div className="card">
        <div className="card-body">
          <ViewDataTable
            title="Benpose 250 Holders"
            cardHeader="Benpose 250 Holders data"
            columns={columns}
            data={data}
            isLoading={loading}
          />
        </div>
      </div>
    </>
  );
};

export default Benpose250Holders;
