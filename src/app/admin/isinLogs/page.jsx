"use client";
import ViewDataTable from "@/components/dataTables/ViewDataTable";
import LogModal from "@/components/logModal/LogModal";
import { apiConnector } from "@/utils/apihelper";
import axios from "axios";
import { Eye } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

const IsinLogs = () => {
  const [data, setData] = useState([]);
  const [displayData, setDisplayData] = useState([]);
  const [activeTab, setActiveTab] = useState("Active");
  const categories = ["Active", "Delete"];
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedLogData, setSelectedLogData] = useState(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    try {
      apiConnector("GET",`${apiUrl}/v2/admin/isin/isin-log`).then((response) => {
        const responseData = response?.data?.result || [];
        const parsedData = responseData.map((item) => {
          let parsed = {};
          try {
            parsed = JSON.parse(item?.data);
          } catch (e) {
            console.error("Error parsing 'data':", e);
          }
          return {
            ...item,
            ...parsed,
          };
        });
        console.log({ parsedData });
        setData(parsedData);
        setLoading(false);
      });
    } catch (error) {
      const errMsg = error?.response?.data?.message;
      toast.error(errMsg || "An error occurred while processing the request.");
      console.log("Error Fetching Data", error);
      setLoading(false);
    }
  }, []);

  //--------------------- dynamic table ----------------------------
  const logsColumns = useMemo(
    () => [
      { header: "#", accessorKey: "index", cell: (info) => info.row.index + 1 },
      {
        header: "table name",
        accessorKey: "table_id",
        cell: (info) => info.row.original.table_id,
      },
      {
        header: "initiated by",
        accessorKey: "username",
        cell: (info) => info.row.original.username,
      },
      {
        header: "activity time",
        accessorKey: "updated_at",
        cell: (info) => info.row.original.updated_at,
      },
      {
        header: "logs remarks",
        accessorKey: "remarks",
        cell: (info) => info.row.original.remarks, // <- add return
      },
      {
        header: "ip address",
        accessorKey: "created_ip",
        cell: (info) => info.row.original.created_ip, // <- add return
      },
      {
        header: "view log data",
        accessorKey: "",
        cell: ({ row }) => {
          const rowData = row.original;
          return (
            <>
              <button
                onClick={() => {
                  setSelectedLogData(rowData);
                  setShowModal(true);
                }}
                title="View Log Data"
                className="text-blue-500 hover:text-blue-700"
              >
                <Eye />
              </button>
            </>
          );
        },
      },
    ],
    []
  );

  useEffect(() => {
    if (activeTab == categories[0]) {
      setDisplayData(data?.filter((i) => i?.status == 1));
    } else if (activeTab == categories[1]) {
      setDisplayData(data?.filter((i) => i?.status == 2));
    } else {
      setDisplayData([]);
    }
  }, [activeTab, data]);

  return (
      <div className="card">
        <div className="card-body p-4">
          {categories && (
            <div className="flex space-x-8 border-b border-gray-200 mb-4">
              {categories.map((tab) => {
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`p-2 text-[13px] font-medium transition-colors
                    ${
                      activeTab === tab
                        ? "border-b-2 border-orange-500 text-orange-500"
                        : "text-black"
                    }
                  `}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>
          )}
          <div className="mb-4">
            The contents of this table are restricted to Active ISINs, which are
            billable and subject to quarterly maintenance fees. To qualify as
            active, an ISIN must possess an active status in either the CDSL or
            NSDL system.
          </div>
          {/* Data Table Component */}
          <ViewDataTable
            title="ISIN Logs"
            columns={logsColumns}
            data={displayData}
            isLoading={loading}
          />
          <LogModal
            showModal={showModal}
            setShowModal={setShowModal}
            logData={selectedLogData}
          />
        </div>
      </div>
  );
};

export default IsinLogs;
