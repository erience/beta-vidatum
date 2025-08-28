"use client";
import ViewDataTable from "@/components/dataTables/ViewDataTable";
import { apiConnector } from "@/utils/apihelper";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

const BenposeAnalytics = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { date, benposType } = useParams();
  const [isin, setIsin] = useState("");
  const [benposeDate, setBenposeDate] = useState("");
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  //----------------------fetch benpos analytics data-----------------------------
  useEffect(() => {
    const fetchBenposAnalyticsData = async () => {
      try {
        const response = await apiConnector(
          "GET",
          `${apiUrl}/v2/user/benpose/analytics/${date}/${benposType}`
        );
        const responseData = response.data.data || [];
        setData(responseData.data);
        setIsin(responseData.isin);
        setBenposeDate(responseData.date);
        setLoading(false);
      } catch (error) {
        const errorMsg = error.response.data.message || "error fetching data";
        toast.error(errorMsg);
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchBenposAnalyticsData();
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
        header: "Number of Shares",
        accessorKey: "ange",
        cell: (info) => info.row.original.ange || "-",
      },
      {
        header: "Number of ShareHolders",
        accessorKey: "Count",
        cell: (info) => info.row.original.Count || "-",
      },
      {
        header: "% of total ShareHolders",
        accessorKey: "Percentage",
        cell: (info) => info.row.original.Percentage || "-",
      },
      {
        header: "No. of Shares",
        accessorKey: "TotalShares",
        cell: (info) => info.row.original.TotalShares || "-",
      },
      {
        header: "% of Total Shares",
        accessorKey: "tsharePercentage",
        cell: (info) => info.row.original.tsharePercentage || "-",
      },
    ],
    []
  );
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Benpose Date Card */}
        <div className="bg-white rounded shadow">
          <div className="flex h-full">
            <div className="w-1/4 bg-blue-500 flex items-center justify-center text-white">
              {/* <Calendar size={40} /> */}
            </div>
            <div className="w-3/4 p-4 text-right">
              <h2 className="text-2xl font-normal mb-2">{benposeDate || ""}</h2>
              <p className="text-gray-500 m-0">Benpose Date</p>
            </div>
          </div>
        </div>

        {/* ISIN Card */}
        <div className="bg-white rounded shadow">
          <div className="flex h-full">
            <div className="w-1/4 bg-green-500 flex items-center justify-center text-white">
              {/* <BookOpen size={40} /> */}
            </div>
            <div className="w-3/4 p-4 text-right">
              <h2 className="text-2xl font-normal mb-2">{isin || ""}</h2>
              <p className="text-gray-500 m-0">ISIN</p>
            </div>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          <ViewDataTable
            title="View Benpose"
            cardHeader="view benpose data"
            columns={columns}
            data={data}
            isLoading={loading}
          />
        </div>
      </div>
    </>
  );
};

export default BenposeAnalytics;
