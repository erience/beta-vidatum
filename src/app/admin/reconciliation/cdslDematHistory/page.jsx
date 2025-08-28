"use client";
import { useEffect, useMemo, useState } from "react";
import { Activity, Archive, Upload, View } from "lucide-react";
import axios from "axios";
import ViewDataTable from "@/components/dataTables/ViewDataTable";
import Link from "next/link";
import { toast } from "react-toastify";
import { apiConnector } from "@/utils/apihelper";

const tabLabels = {
  P: "Pending",
  S: "Setup",
  C: "Closed",
  R: "Rejected",
};

const CdslDemateHistory = () => {
  const [data, setData] = useState({});
  const [filteredData, setFilteredData] = useState([]);
  const [activeTab, setActiveTab] = useState("");
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Fetch data from backend

  const fetchCdslData = async () => {
    try {
      const response = await apiConnector(
        "GET",
        `${apiUrl}/v2/admin/actionHistory/get-demat`
      );
      const grouped = response?.data?.result?.data || {};
      console.log({ grouped });
      setData(grouped);
      const firstTab = Object.keys(grouped)[0] || "";
      console.log({ firstTab });
      setActiveTab(firstTab);
      setLoading(false);
    } catch (error) {
      const errMsg = error.response.data.message;
      toast.error(errMsg || "An error occurred while processing the request.");
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCdslData();
  }, []);

  // Filter data when tab changes
  useEffect(() => {
    if (activeTab && data[activeTab]) {
      console.log("data", data[activeTab]);
      setFilteredData(data[activeTab]);
    }
  }, [activeTab, data]);

  // Define columns for table
  const columns = useMemo(
    () => [
      { header: "#", accessorKey: "index", cell: (info) => info.row.index + 1 },
      { header: "RTA ID", accessorKey: "a" },
      { header: "DP ID", accessorKey: "b" },
      { header: "DRN", accessorKey: "c" },
      { header: "d", accessorKey: "d" },
      { header: "e", accessorKey: "e" },
      {
        header: "REQUEST QTY",
        accessorKey: "f",
        cell: (info) => Number(info.row.original.f),
      },
      {
        header: "ACCEPTED QTY",
        accessorKey: "g",
        cell: (info) => Number(info.row.original.g),
      },
      {
        header: "REJECT QTY",
        accessorKey: "h",
        cell: (info) => Number(info.row.original.h),
      },
      {
        header: "i",
        accessorKey: "i",
        cell: (info) => Number(info.row.original.i),
      },
      { header: "j", accessorKey: "j" },
      { header: "k", accessorKey: "k" },
      {
        header: "NO. OF CERTIFICATES",
        accessorKey: "l",
        cell: (info) => Number(info.row.original.l),
      },
      { header: "m", accessorKey: "m" },
      { header: "STATUS", accessorKey: "n" },
      { header: "ISIN", accessorKey: "o" },
      { header: "p", accessorKey: "p" },
      { header: "q", accessorKey: "q" },
      { header: "r", accessorKey: "r" },
      {
        header: "SET UP DATE",
        accessorKey: "s",
        cell: (info) =>
          info.row.original.s
            ? new Date(info.row.original.s).toLocaleDateString("en-GB")
            : "-",
      },
      {
        header: "RECEIVE DATE",
        accessorKey: "t",
        cell: (info) =>
          info.row.original.t
            ? new Date(info.row.original.t).toLocaleDateString("en-GB")
            : "-",
      },
      {
        header: "APPROVAL / REJ. DATE",
        accessorKey: "u",
        cell: (info) =>
          info.row.original.u
            ? new Date(info.row.original.u).toLocaleDateString("en-GB")
            : "-",
      },
      { header: "DPID AND CLIENT ID", accessorKey: "v" },
      { header: "DRF NO.", accessorKey: "w" },
      { header: "IN. REF NO", accessorKey: "x" },
      { header: "y", accessorKey: "y" },
      { header: "z", accessorKey: "z" },
      {
        header: "Address",
        accessorKey: "address",
        cell: (info) => {
          const d = info.row.original;
          return `${d.aa || ""}, ${d.ab || ""} ${d.ac || ""}, ${d.ad || ""}, ${
            d.ae || ""
          }, ${d.af || ""}, ${d.ag || ""}, ${d.ah || ""}, ${d.ai || ""}, ${
            d.aj || ""
          }`;
        },
      },
    ],
    []
  );

  return (
    <>
      <div className="card">
        <div className="card-body">
          <div className="flex space-x-8 border-b border-gray-200 mb-4">
            {Object.keys(data).map((key) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`pb-2 px-3 h-10 text-sm font-medium transition-all ${
                  activeTab === key
                    ? "border-b-2 border-black text-black"
                    : "text-red-500"
                }`}
              >
                {tabLabels[key] || key}
              </button>
            ))}
          </div>

          <ViewDataTable
            title="CDSL Demat History"
            cardHeader="cdsl demat history data"
            columns={columns}
            data={filteredData}
            isLoading={loading}
            headerIcons={
              <div className="flex items-center gap-1">
                <Link href="/admin/reconciliation/getDematAnalytics">
                  <button type="button" title="Demat History CDSL Analytics">
                    <Activity size={25} />
                  </button>
                </Link>
                <Link href="/admin/reconciliation/uploadCdslDematHistory">
                  <button type="button" title="Add/Update Demat CDSL">
                    <Upload size={25} />
                  </button>
                </Link>
                <Link href="/admin/reconciliation/nsdlDemateFilesUpload">
                  <button type="button" title="Add/Update Demat NSDL">
                    <Archive size={25} />
                  </button>
                </Link>
                <Link href="/admin/reconciliation/getDematAnalytics">
                  <button type="button" title="Demat History CDSL Merge">
                    <View size={25} />
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

export default CdslDemateHistory;
