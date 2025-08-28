"use client";
import ViewDataTable from "@/components/dataTables/ViewDataTable";
import { apiConnector } from "@/utils/apihelper";
import { Upload } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

const DepositoryList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  //----------------------fetch depository data-----------------------------
  const fetchDepositoryData = async () => {
    try {
      const response = await apiConnector(
        "GET",
        `${apiUrl}/v2/admin/depository`
      );
      const responseData = response.data.result.data || [];
      console.log({ responseData });
      setData(responseData);
      setLoading(false);
    } catch (error) {
      const errMsg = error.response.data.message;
      toast.error(errMsg || "error fetching data");
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepositoryData();
  }, []);

  const columns = useMemo(
    () => [
      {
        header: "#",
        accessorKey: "index",
        cell: (info) => info.row.index + 1,
      },

      {
        header: "DP",
        accessorKey: "dp",
        cell: (info) => info.row.original.dp || "-",
      },
      {
        header: "Type",
        accessorKey: "type",
        cell: (info) => {
          const depository = info.row.original.type;
          return depository == 2 ? "CDSL" : depository == 1 ? "NSDL" : "Error";
        },
      },
      {
        header: "Name",
        accessorKey: "name",
        cell: (info) => info.row.original.name || "-",
      },
      {
        header: "Address",
        accessorKey: "address",
        cell: (info) => info.row.original.address || "-",
      },
      {
        header: "Email",
        accessorKey: "email",
        cell: (info) => info.row.original.email || "-",
      },
      {
        header: "Contact",
        accessorKey: "contact",
        cell: (info) => info.row.original.contact || "-",
      },
      {
        header: "Web",
        accessorKey: "web",
        cell: (info) => info.row.original.web || "-",
      },
    ],
    []
  );

  return (
    <>
      <div className="card">
        <div className="card-body ">
          <ViewDataTable
            title="Depository List"
            cardHeader="DEPOSITORY LIST"
            columns={columns}
            data={data}
            isLoading={loading}
            headerIcons={
              <div className="flex items-center gap-1">
                {/* <Link href="/admin/depository-upload">
                  <button type="button" title="">
                    <Upload size={25} />
                  </button>
                </Link> */}
              </div>
            }
          />
        </div>
      </div>
    </>
  );
};

export default DepositoryList;
