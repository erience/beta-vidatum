"use client";
export const dynamic = "force-dynamic";

import ViewDataTable from "@/components/dataTables/ViewDataTable";
import { apiConnector } from "@/utils/apihelper";
// import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import useQueryParams from "../../../../../hook/useQueryParams";

const UserChangeBenpose = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  // const searchParams = useSearchParams();
  const { date, benposType } = useQueryParams();
  // const date = searchParams.get("date");
  // const benposType = searchParams.get("benposType");
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  //----------------------fetch short benpose data-----------------------------
  useEffect(() => {
    const fetchChangeBenposData = async () => {
      try {
        const submitData = {
          bdate: date,
          benposType,
        };
        const response = await apiConnector(
          "POST",
          `${apiUrl}/v2/user/benpose/change`,
          submitData
        );
        const responseData = response.data.data.changealert || [];
        console.log({ responseData });
        setData(responseData);
        setLoading(false);
      } catch (error) {
        const errormessage = error.response.data.message;
        toast.error(errormessage);
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchChangeBenposData();
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
        cell: (info) => info.row.original.date || "-",
      },
      {
        header: "ISIN",
        accessorKey: "isin",
        cell: (info) => info.row.original.isin,
      },
      {
        header: "TYPE",
        accessorKey: "type",
        cell: (info) => (info.row.original.type == 1 ? "NSDL" : "CDSL"),
        cell: (info) => {
          if (info.row.original.type == 1) {
            return "NSDL";
          } else if (info.row.original.type == 2) {
            return "CDSL";
          } else if (info.row.original.type == 3) {
            return "Physical";
          }
          return "";
        },
      },
      {
        header: "LF",
        accessorKey: "lf",
        cell: (info) => info.row.original.lf,
      },
      {
        header: "CATEGORY",
        accessorKey: "label",
        cell: (info) => info.row.original.label,
      },
      {
        header: "ACCOUNT NO.",
        accessorKey: "lf",
        cell: (info) => info.row.original.lf,
      },
      {
        header: "NAME",
        accessorKey: "name",
        cell: (info) => info.row.original.name,
      },
      {
        header: "PAN",
        accessorKey: "f_pan",
        cell: (info) => info.row.original.f_pan,
      },
      {
        header: "OPEN",
        accessorKey: "open",
        cell: (info) => info.row.original.open,
      },
      {
        header: "BUY",
        accessorKey: "buy",
        cell: (info) => info.row.original.buy,
      },
      {
        header: "SELL",
        accessorKey: "sell",
        cell: (info) => info.row.original.sell,
      },
      {
        header: "CLOSE",
        accessorKey: "close",
        cell: (info) => info.row.original.close,
      },
    ],
    []
  );
  return (
    <>
      <div className="card">
        <div className="card-body">
          <ViewDataTable
            title="Change Benpose"
            cardHeader="change benpose data"
            columns={columns}
            data={data}
            isLoading={loading}
          />
        </div>
      </div>
    </>
  );
};

export default UserChangeBenpose;
