"use client";
export const dynamic = "force-dynamic";

import { apiConnector } from "@/utils/apihelper";
import { formatDMY } from "@/utils/helper";
import { useEffect, useMemo, useState } from "react";
import ViewDataTable from "@/components/dataTables/ViewDataTable";
import { toast } from "react-toastify";
import useQueryParams from "../../../../../../hook/useQueryParams";
import { Base64 } from "js-base64";
// import { useSearchParams } from "next/navigation";

const WeeklyChangeReport = () => {
  // const searchParams = useSearchParams();
  const { date, isin, benposType } = useQueryParams();
  // const date = searchParams.get("date");
  // const fetchIsin = searchParams.get("isin");
  // const benposType = searchParams.get("benposType");
  // const isin = Base64.isValid(isin) ? Base64.decode(isin) : isin;
  const [data, setData] = useState([]);
  const [comparedDate, setComparedDate] = useState("");
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    if (!date || !isin || !benposType) return;

    const fetchData = async () => {
      try {
        const submitData = {
          isin: isin,
          bdate: formatDMY(date),
          benposType,
        };

        const response = await apiConnector(
          "POST",
          `${apiUrl}/v2/admin/benpose/change`,
          submitData
        );
        const responseData = response.data.data || [];
        setData(responseData.changealert);
        setComparedDate(responseData.comparedDate);
      } catch (error) {
        const errMsg =
          error.response?.data?.message ||
          error.message ||
          "Something went wrong";
        toast.error(`${errMsg}`);
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [date, isin, benposType]);

  const columns = useMemo(
    () => [
      { header: "#", accessorKey: "index", cell: (info) => info.row.index + 1 },
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
        header: "ACCOUNT NO.",
        accessorKey: "lf",
        cell: (info) => info.row.original.lf || "-",
      },
      {
        header: "NAME",
        accessorKey: "name",
        cell: (info) => info.row.original.name || "-",
      },
      {
        header: "PAN",
        accessorKey: "f_pan",
        cell: (info) => info.row.original.f_pan || "-",
      },
      {
        header: "OPEN",
        accessorKey: "open",
        cell: (info) => info.row.original.open || "-",
      },
      {
        header: "BUY",
        accessorKey: "buy",
        cell: (info) => info.row.original.buy || "-",
      },
      {
        header: "SELL",
        accessorKey: "sell",
        cell: (info) => info.row.original.sell || "-",
      },
      {
        header: "CLOSE",
        accessorKey: "close",
        cell: (info) => info.row.original.close || "-",
      },
    ],
    []
  );

  return (
    <div className="card">
      <div className="card-body p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded shadow">
            <div className="flex h-full">
              <div className="w-1/4 bg-blue-500" />
              <div className="w-3/4 p-4 text-right">
                <h2 className="text-2xl font-normal mb-2">{date || ""}</h2>
                <p className="text-gray-500 m-0">Benpose Date</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded shadow">
            <div className="flex h-full">
              <div className="w-1/4 bg-green-500" />
              <div className="w-3/4 p-4 text-right">
                <h2 className="text-2xl font-normal mb-2">{isin || ""}</h2>
                <p className="text-gray-500 m-0">ISIN</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded shadow">
            <div className="flex h-full">
              <div className="w-1/4 bg-cyan-500" />
              <div className="w-3/4 p-4 text-right">
                <h2 className="text-2xl font-normal mb-2">
                  {comparedDate || "-"}
                </h2>
                <p className="text-gray-500 m-0">Compared Date</p>
              </div>
            </div>
          </div>
        </div>

        <ViewDataTable
          title="Change Benpose"
          columns={columns}
          data={data}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default WeeklyChangeReport;
