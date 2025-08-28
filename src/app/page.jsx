"use client";
import ViewDataTable from "@/components/dataTables/ViewDataTable";
import { apiConnector } from "@/utils/apihelper";
import { formatDMY } from "@/utils/helper";
import { CheckLine, Eye, File, Upload } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import AdminLayout from "./admin/layout";

const Home = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [searchTerm, setSearchTerm] = useState("");
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const fetchIsinData = async () => {
    try {
      const response = await apiConnector(
        "GET",
        `${apiUrl}/v2/admin/view-isin-reportData`
      );
      console.log({ response });
      const responseData = response.data?.result || [];
      console.log({ responseData });
      setData(responseData);
      setLoading(false);
    } catch (error) {
      const errMsg = error?.response?.data?.message;
      toast.error(errMsg || "An error occurred while processing the request.");
      console.log("Error Fetching Data", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIsinData();
  }, []);

  const checkAddressFunction = async (x, id) => {
    try {
      const response = await apiConnector(
        "POST",
        `${apiUrl}/v2/admin/report/checkAddressv2`,
        { isin: x },
        { "Content-Type": "application/json" }
      );
      toast.success(response.data.result.message);
    } catch (error) {
      toast.error(`Error: Address is not available for isin ${x}`);
    }
  };

  const columns = useMemo(
    () => [
      {
        header: "#",
        accessorKey: "index",
        cell: (info) =>
          pagination.pageIndex * pagination.pageSize + info.row.index + 1,
      },
      {
        header: "Name",
        accessorKey: "cin",
        cell: (info) => info.row.original.cin || "-",
      },
      {
        header: "Type",
        accessorKey: "type",
        cell: (info) => info.row.original.type || "-",
      },
      {
        header: "Isin",
        accessorKey: "isin",
        cell: (info) => info.row.original.isin || "-",
      },
      {
        header: "Cdsl",
        accessorKey: "cdsl",
        cell: (info) => info.row.original.cdsl || "-",
      },
      {
        header: "CDSL Date",
        accessorKey: "c_date",
        cell: (info) => info.row.original.c_date || "-",
      },
      {
        header: "Nsdl",
        accessorKey: "nsdl",
        cell: (info) => info.row.original.nsdl || "-",
      },
      {
        header: "NSDL Date",
        accessorKey: "n_date",
        cell: (info) => info.row.original.n_date || "-",
      },
      {
        header: "Facev",
        accessorKey: "facev",
        cell: (info) => info.row.original.facev || "-",
      },
      {
        header: "Paidv",
        accessorKey: "paidv",
        cell: (info) => info.row.original.paidv || "-",
      },
      {
        header: "Instrument",
        accessorKey: "instrument",
        cell: (info) => info.row.original.instrument || "-",
      },
      {
        header: "Connect",
        accessorKey: "connect",
        cell: (info) => info.row.original.connect || "-",
      },
      {
        header: "Transfer",
        accessorKey: "transfer",
        cell: (info) => info.row.original.transfer || "-",
      },

      {
        header: "Primary Email",
        accessorKey: "email",
        cell: (info) => info.row.original.email || "-",
      },
      {
        header: "Secondary Email",
        accessorKey: "s_email",
        cell: (info) => info.row.original.s_email || "-",
      },
      {
        header: "Primary Phone",
        accessorKey: "p_phone",
        cell: (info) => info.row.original.p_phone || "-",
      },
      {
        header: "Secondary Phone",
        accessorKey: "s_phone",
        cell: (info) => info.row.original.s_phone || "-",
      },
      {
        header: "Address",
        accessorKey: "address",
        cell: (info) => info.row.original.address || "-",
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: (info) => {
          const status = info.row.original.status;
          return (
            <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
              {status}
            </span>
          );
        },
      },
      {
        header: "Actions",
        accessorKey: "view",
        cell: ({ row }) => {
          const rowData = row.original;
          return (
            <Link
              href={`/admin/isin/viewIsin/${rowData.isin}`}
              title="View ISIN Data"
            >
              <Eye className="text-green-500" />
            </Link>
          );
        },
      },
      {
        header: "View Isin List",
        accessorKey: "viewisinlist",
        cell: ({ row }) => {
          const rowData = row.original;
          return (
            <Link
              href={"/admin/reconciliation/isinList"}
              title="View ISIN Data"
            >
              <Eye className="text-green-500" />
            </Link>
          );
        },
      },
      {
        header: "Fetch Address",
        accessorKey: "action",
        cell: (info) => {
          const { isin, id } = info.row.original;
          return (
            <button
              onClick={() => checkAddressFunction(isin, id)}
              className="text-green-600"
              title="Check Address"
            >
              <CheckLine size={20} />
            </button>
          );
        },
      },
    ],
    [pagination]
  );

  return (
    <>
      <AdminLayout>
        <div className="card">
          <div className="card-body">
            <ViewDataTable
              title="All ISINs"
              cardHeader="The contents of this table are restricted to Active ISINs, which are billable and subject to quarterly maintenance fees. To qualify as active, an ISIN must possess an active status in either the CDSL or NSDL system."
              columns={columns}
              data={data}
              isLoading={loading}
              // totalCount={totalCount}
              // pagination={pagination}
              // setPagination={setPagination}
              // onPageChange={handlePaginationChange}
              // onSearch={handleSearch}
              // searchTerm={searchTerm}
              headerIcons={
                <div className="flex items-center gap-1">
                  <Link
                    href={"/admin/uploadNsdlFile"}
                    title="Upload NSDL ISIN File"
                  >
                    <Upload size={20} />
                  </Link>
                  <Link
                    href={"/admin/uploadCdslFile"}
                    title="Upload CDSL ISIN File"
                  >
                    <Upload size={20} />
                  </Link>
                </div>
              }
            />
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default Home;
