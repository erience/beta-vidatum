"use client";
import ViewDataTable from "@/components/dataTables/ViewDataTable";
import { apiConnector } from "@/utils/apihelper";
import { formatDateLong } from "@/utils/helper";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

const UserCaHistory = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  //----------------------fetch KYC data-----------------------------

  const getCaHistory = async () => {
    try {
      const response = await apiConnector(
        "GET",
        `${apiUrl}/v2/user/reconciliation/corporateaction`
      );
      const responseData = response.data.result || [];
      console.log({ responseData });
      setData(responseData);
      setLoading(false);
    } catch (error) {
      const errMsg = error.response.data.message;
      toast.error(errMsg || "An error occurred while processing the request.");
      console.log("Fetching data error", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getCaHistory();
  }, []);

  //---------------------------dynamic column---------------------------
  const columns = useMemo(
    () => [
      { header: "#", accessorKey: "index", cell: (info) => info.row.index + 1 },

      {
        header: "Depository",
        accessorKey: "depository",
        cell: (info) => (info.row.original.depository == 1 ? "NSDL" : "CDSL"),
      },
      {
        header: "ISIN",
        accessorKey: "isin",
        cell: (info) => info.row.original.isin,
      },
      {
        header: "Ref",
        accessorKey: "ref",
        cell: (info) => info.row.original.ref,
      },
      {
        header: "Allotmant Date",
        accessorKey: "date",
        cell: (info) => formatDateLong(info.row.original.date),
      },
      {
        header: "Create Date",
        accessorKey: "date",
        cell: (info) => formatDateLong(info.row.original.date),
      },

      {
        header: "Type",
        accessorKey: "type",
        cell: (info) => info.row.original.type,
      },
      {
        header: "Is Share",
        accessorKey: "is_share",
        cell: (info) => (info.row.original.is_share == 1 ? "NSDL" : "CDSL"),
      },
      {
        header: "Count",
        accessorKey: "count",
        cell: (info) => info.row.original.count,
      },
      {
        header: "Description",
        accessorKey: "des",
        cell: (info) => info.row.original.des,
      },
      {
        header: "Remarks",
        accessorKey: "remarks",
        cell: (info) => info.row.original.remarks,
      },
    ],
    [data]
  );

  return (
    <>
      <div className="card">
        <div className="card-body p-4">
          <ViewDataTable
            title="Corporate Action List"
            cardHeader="corporate-action-list data"
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

export default UserCaHistory;
