"use client";
import ViewDataTable from "@/components/dataTables/ViewDataTable";
import { apiConnector } from "@/utils/apihelper";
import { Archive, Download, Edit, Eye, Upload } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

const SebiList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  //----------------------fetch KYC data-----------------------------

  const fetchRematData = async () => {
    try {
      const response = await apiConnector(
        "GET",
        `${apiUrl}/v2/admin/get-sebi`
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
    fetchRematData();
  }, []);

  const columns = useMemo(
    () => [
      {
        header: "#",
        accessorKey: "index",
        cell: (info) => info.row.index + 1,
      },
      {
        header: "Order",
        accessorKey: "order",
        cell: (info) => info.row.original.order,
      },
      {
        header: "Name",
        accessorKey: "name",
        cell: (info) => info.row.original.name,
      },
      {
        header: "Pan",
        accessorKey: "pan",
        cell: (info) => info.row.original.pan,
      },
      {
        header: "Nature",
        accessorKey: "nature",
        cell: (info) => info.row.original.nature,
      },
      {
        header: "E_Date",
        accessorKey: "eDate",
        cell: (info) => info.row.original.eDate,
      },
      
    ],
    []
  );
  return (
    <>
      <div className="card">
        <div className="card-body">
          <ViewDataTable
            title="SEBI List"
            cardHeader="SEBI List Data"
            columns={columns}
            data={data}
            isLoading={loading}
            
          />
        </div>
      </div>
    </>
  );
};

export default SebiList;
