"use client";
export const dynamic = "force-dynamic";

import ViewDataTable from "@/components/dataTables/ViewDataTable";
import { apiConnector } from "@/utils/apihelper";
import {
  Eye,
  FilePlus,
  Info,
  PencilLine,
  SquarePen,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { useRouter, } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import useQueryParams from "../../../../../hook/useQueryParams";
// import { Link, useLocation, useNavigate } from "react-router";

const InwardReport = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { date } = useQueryParams();
  // const searchParams = useSearchParams();
  // const date = searchParams.get("date");
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  //----------------------fetch inward  data-----------------------------
  const fetchInwardReportData = async () => {
    try {
      const response = await apiConnector(
        "GET",
        `${apiUrl}/v2/admin/inward/report?date=${date}`
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
    fetchInwardReportData();
  }, []);

  const columns = useMemo(
    () => [
      {
        header: "#",
        accessorKey: "index",
        cell: (info) => info.row.index + 1,
      },

      {
        header: "Ref No",
        accessorKey: "ref",
        cell: (info) => info.row.original.ref || "-",
      },
      {
        header: "Info Available",
        accessorKey: "infoAvailable",
        cell: (info) => info.row.original.infoAvailable,
      },
      {
        header: "Range Available",
        accessorKey: "range",
        cell: (info) => info.row.original.range || "-",
      },
      {
        header: "Actions",
        accessorKey: "",
        cell: ({ row }) => {
          const rowData = row.original;

          return (
            <button
              onClick={() =>
                router.push(
                  `/admin/inward/viewInward/${encodeURIComponent(rowData.ref)}`
                )
              }
              title="View ISIN Data"
            >
              <Eye className="text-green-500" />
            </button>
          );
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
            title="ALL INWARD DATE WISE"
            cardHeader="all inward date wise"
            columns={columns}
            data={data}
            isLoading={loading}
            headerIcons={
              <div className="flex items-center gap-1">
                <Link href="/admin/process/add_inward">
                  <button type="button" title="">
                    <Upload size={20} />
                  </button>
                </Link>
                <Link href="/admin/process/multi_inward">
                  <button type="button" title="">
                    <PencilLine size={20} />
                  </button>
                </Link>
                <Link href="/admin/process/edit_inward">
                  <button type="button" title="">
                    <SquarePen size={20} />
                  </button>
                </Link>
                <Link href="/admin/process/add_inward_info">
                  <button type="button" title="">
                    <Info size={20} />
                  </button>
                </Link>
                <Link href="/admin/process/add_inward_range">
                  <button type="button" title="">
                    <FilePlus size={20} />
                  </button>
                </Link>
                <Link href="/admin/process/edit_inward_range">
                  <button type="button" title="">
                    <FilePlus size={20} />
                  </button>
                </Link>
                <Link href="/admin/process/kyc_inward_info">
                  <button type="button" title="">
                    <FilePlus size={20} />
                  </button>
                </Link>
                <Link href="/admin/process/transmission_inward_info">
                  <button type="button" title="">
                    <FilePlus size={20} />
                  </button>
                </Link>
                <Link href="/admin/process/duplicate_inward_info">
                  <button type="button" title="">
                    <FilePlus size={20} />
                  </button>
                </Link>
                <Link href="/admin/process/other_inward_info">
                  <button type="button" title="">
                    <FilePlus size={20} />
                  </button>
                </Link>
                <Link href="/admin/process/upload_inward_pdfs">
                  <button type="button" title="">
                    <FilePlus size={20} />
                  </button>
                </Link>
              </div>
            }
          />
        </div>
      </div>
    </>
  );
};

export default InwardReport;
