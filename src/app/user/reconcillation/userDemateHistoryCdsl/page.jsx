"use client";
import ViewDataTable from "@/components/dataTables/ViewDataTable";
import { apiConnector } from "@/utils/apihelper";
import { formatDateShort } from "@/utils/helper";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

const UserDemateHistoryCdsl = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  //----------------------fetch KYC data-----------------------------
  const fetchDemateHistory = async () => {
    try {
      const response = await apiConnector(
        "GET",
        `${apiUrl}/v2/user/reconciliation/demat-cdsl`
      );

      if (!response || !response.data) {
        throw new Error("Invalid response structure");
      }

      const responseData = response.data.result || [];
      console.log({ responseData });
      setData(responseData);
    } catch (error) {
      const errMsg =
        error?.response?.data?.message || error.message || "Unknown error";
      toast.error(errMsg);
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDemateHistory();
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
        header: "a",
        accessorKey: "a",
        cell: (info) => info.row.original.a,
      },
      {
        header: "b",
        accessorKey: "b",
        cell: (info) => info.row.original.b,
      },
      {
        header: "c",
        accessorKey: "c",
        cell: (info) => info.row.original.c,
      },
      {
        header: "d",
        accessorKey: "d",
        cell: (info) => info.row.original.d,
      },
      {
        header: "e",
        accessorKey: "e",
        cell: (info) => info.row.original.e,
      },
      {
        header: "f",
        accessorKey: "f",
        cell: (info) => info.row.original.f,
      },
      {
        header: "g",
        accessorKey: "g",
        cell: (info) => info.row.original.g,
      },
      {
        header: "h",
        accessorKey: "h",
        cell: (info) => info.row.original.h,
      },
      {
        header: "i",
        accessorKey: "i",
        cell: (info) => info.row.original.i,
      },
      {
        header: "j",
        accessorKey: "j",
        cell: (info) => info.row.original.j,
      },
      {
        header: "k",
        accessorKey: "k",
        cell: (info) => info.row.original.k,
      },
      {
        header: "l",
        accessorKey: "l",
        cell: (info) => info.row.original.l,
      },
      {
        header: "m",
        accessorKey: "m",
        cell: (info) => info.row.original.m,
      },
      {
        header: "n",
        accessorKey: "n",
        cell: (info) => info.row.original.n,
      },
      {
        header: "o",
        accessorKey: "o",
        cell: (info) => info.row.original.o,
      },
      {
        header: "p",
        accessorKey: "p",
        cell: (info) => info.row.original.p,
      },
      {
        header: "q",
        accessorKey: "q",
        cell: (info) => info.row.original.q,
      },
      {
        header: "r",
        accessorKey: "r",
        cell: (info) => info.row.original.r,
      },
      {
        header: "s",
        accessorKey: "s",
        cell: (info) => formatDateShort(info.row.original.s),
      },
      {
        header: "t",
        accessorKey: "t",
        cell: (info) => info.row.original.t,
      },
      {
        header: "u",
        accessorKey: "u",
        cell: (info) => info.row.original.u,
      },
      {
        header: "v",
        accessorKey: "v",
        cell: (info) => info.row.original.v,
      },
      {
        header: "w",
        accessorKey: "w",
        cell: (info) => info.row.original.w,
      },
      {
        header: "x",
        accessorKey: "x",
        cell: (info) => info.row.original.x,
      },
      {
        header: "y",
        accessorKey: "y",
        cell: (info) => info.row.original.y,
      },
      {
        header: "z",
        accessorKey: "z",
        cell: (info) => info.row.original.z,
      },
      {
        header: "aa",
        accessorKey: "aa",
        cell: (info) => info.row.original.aa,
      },
      {
        header: "ab",
        accessorKey: "ab",
        cell: (info) => info.row.original.ab,
      },
      {
        header: "ac",
        accessorKey: "ac",
        cell: (info) => info.row.original.ac,
      },
      {
        header: "ad",
        accessorKey: "ad",
        cell: (info) => info.row.original.ad,
      },
      {
        header: "ae",
        accessorKey: "ae",
        cell: (info) => info.row.original.ae,
      },
      {
        header: "af",
        accessorKey: "af",
        cell: (info) => info.row.original.af,
      },
      {
        header: "ag",
        accessorKey: "ag",
        cell: (info) => info.row.original.ag,
      },
      {
        header: "ah",
        accessorKey: "ah",
        cell: (info) => info.row.original.ah,
      },
      {
        header: "ai",
        accessorKey: "ai",
        cell: (info) => info.row.original.ai,
      },
      {
        header: "aj",
        accessorKey: "aj",
        cell: (info) => info.row.original.aj,
      },
    ],
    [data]
  );

  return (
    <>
      <div className="card">
        <div className="card-body">
          <ViewDataTable
            title="Demat CDSL History"
            cardHeader="demat cdsl history data"
            columns={columns}
            data={data}
            isLoading={loading}
          />
        </div>
      </div>
    </>
  );
};

export default UserDemateHistoryCdsl;
