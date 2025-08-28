"use client";

import {
  Eye,
  Lock,
  Unlock,
  Check,
  AlertOctagon,
  Download,
  DownloadCloud,
  ArrowDownCircle,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { apiConnector } from "@/utils/apihelper";
import Link from "next/link";
import ViewDataTable from "@/components/dataTables/ViewDataTable";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const tabLabels = {
  All: "All",
  Demat: "Demat",
  Transmission: "Transmission",
  Duplicate: "Duplicate",
  KYC: "KYC",
  Exchange: "Exchange",
  Remat: "Remat",
  Others: "Others",
  Extra: "Extra",
};

const InwardDateWise = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState("");
  const router = useRouter();
  const [modalData, setModalData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedRef, setSelectedRef] = useState(null);
  const [activeTab, setActiveTab] = useState("");
  const [activeYear, setActiveYear] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [yearWiseData, setYearWiseData] = useState({});
  const [availableYears, setAvailableYears] = useState([]);
  const [showAutomationModal, setShowAutomationModal] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const fetchInwardData = async () => {
    setLoading(true);
    try {
      const response = await apiConnector(
        "GET",
        `${apiUrl}/v2/admin/process/inward/inward-datewise?table=b_inward&isin=b_isin&demattable=b_inward_info`
      );
      const responseData = response?.data?.result?.data || {};
      const yearwiseData = response?.data?.result?.yearwise || {};
      const maker = response?.data?.result?.isMaker || "";

      setAdmin(maker);
      setData(responseData);
      setYearWiseData(yearwiseData);

      const years = Object.keys(yearwiseData)
        .map((key) => key.replace("year_", ""))
        .sort((a, b) => b - a);
      setAvailableYears(years);

      if (years.length > 0) {
        const defaultYear = years[0];
        setActiveYear(defaultYear);
        const yearData = yearwiseData[`year_${defaultYear}`] || {};
        const firstTab = Object.keys(yearData)[0] || "All";
        setActiveTab(firstTab);
        setFilteredData(yearData[firstTab] || []);
      } else {
        const firstKey = Object.keys(responseData)[0];
        if (firstKey) {
          setActiveTab(firstKey);
          setFilteredData(responseData[firstKey]);
        }
      }
    } catch (error) {
      toast.error("Failed to load data.");
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInwardData();
  }, []);

  useEffect(() => {
    if (activeYear && activeTab) {
      const yearData = yearWiseData[`year_${activeYear}`] || {};
      setFilteredData(yearData[activeTab] || []);
    } else if (activeTab && Object.keys(yearWiseData).length === 0) {
      setFilteredData(data[activeTab] || []);
    }
  }, [activeYear, activeTab, yearWiseData, data]);

  const getAvailableTabsForYear = () => {
    if (!activeYear || !yearWiseData[`year_${activeYear}`]) {
      return Object.keys(tabLabels);
    }
    return Object.keys(yearWiseData[`year_${activeYear}`]);
  };

  //---------------------------------info automation functionality---------------------------
  const infoAutomation = async () => {
    try {
      const response = await apiConnector(
        "POST",
        `${apiUrl}/v2/admin/process/trigger-info-automation`
      );
      const jsonResponse = response.data;

      if (jsonResponse.status === true) {
        toast.success(jsonResponse.message);
        setTimeout(() => window.location.reload(), 3000);
      } else {
        toast.error(jsonResponse.message || "Trigger failed.");
      }
    } catch (error) {
      console.error("Error occurred:", error);
      const errMsg = error?.response?.data?.message;
      toast.error(errMsg || "Failed to trigger Info Automation");
    }
  };

  //---------------------------------inward automation functionality---------------------------
  const inwardAutomation = async () => {
    try {
      const response = await apiConnector(
        "POST",
        `${apiUrl}/v2/admin/process/trigger-inward-automation`
      );
      const jsonResponse = response.data;

      if (jsonResponse.status === true) {
        toast.success(jsonResponse.message);
        setTimeout(() => window.location.reload(), 3000);
      } else {
        toast.error(jsonResponse.message || "Trigger failed.");
      }
    } catch (error) {
      console.error("Error occurred:", error);
      const errMsg = error?.response?.data?.message;
      toast.error(errMsg || "Failed to trigger Info Automation");
    }
  };

  const columns = useMemo(
    () => [
      {
        header: "#",
        accessorKey: "index",
        cell: (info) => {
          const isLocked = info.row.original.verify === 2;
          return (
            <div className="flex items-center gap-2">
              {info.row.index + 1}
              {isLocked && <Lock size={16} className="text-red-600" />}
            </div>
          );
        },
      },
      {
        header: "Inward Date",
        accessorKey: "date",
      },
      {
        header: "Process Date",
        accessorKey: "p_date",
        cell: (info) => {
          const rawDate = info.row.original.p_date;

          if (!rawDate) return "-";

          const parsedDate = new Date(Date.parse(rawDate));

          return isNaN(parsedDate)
            ? "-"
            : parsedDate.toLocaleDateString("en-GB");
        },
      },
      {
        header: "Ref No.",
        accessorKey: "ref",
      },
      {
        header: "ISIN",
        accessorKey: "isin",
      },
      {
        header: "Company",
        accessorKey: "cin",
      },
      {
        header: "Type",
        accessorKey: "type",
      },
      {
        header: "Sub Type",
        accessorKey: "sub_type",
        cell: (info) => info.row.original.sub_type || "-",
      },
      {
        header: "Mode",
        accessorKey: "mode",
      },
      {
        header: "Sender",
        accessorKey: "sender",
      },
      {
        header: "Location",
        accessorKey: "location",
      },
      {
        header: "Inwarded By",
        accessorKey: "username",
        cell: (info) => info.row.original.username || "-",
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: (info) => {
          const status = (info.row.original.status || "Unknown").toLowerCase();

          const getBadgeClasses = (status) => {
            switch (status) {
              case "active":
                return "bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm";
              case "pending":
                return "bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm";
              case "delete":
                return "bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm";
              case "rejected ":
                return "bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm";
              case "none ":
                return "bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-sm";
              default:
                return "bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-sm";
            }
          };

          return (
            <span className={getBadgeClasses(status)}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          );
        },
      },
      {
        header: "Verify",
        accessorKey: "verify",
        cell: (info) => {
          const data = info.row.original;
          const locked = data.verify === 2;
          const buttonClass = locked
            ? "bg-red-100 text-red-800"
            : "bg-green-100 text-green-800";

          return admin ? (
            <button
              className={`flex text-xs font-semibold px-3 py-1 rounded-full items-center ${buttonClass}`}
              onClick={() => setModalData(data)}
            >
              {locked ? "Verified" : "Not Verified"}{" "}
              {locked ? (
                <Lock size={16} className="ml-1" />
              ) : (
                <Unlock size={16} className="ml-1" />
              )}
            </button>
          ) : (
            <span
              className={`flex text-xs px-2 py-1 rounded items-center ${
                locked ? "bg-red-500 text-white" : "bg-green-500 text-white"
              }`}
            >
              {locked ? "Verified" : "Not Verified"}
              {locked ? (
                <Lock size={16} className="ml-1" />
              ) : (
                <Unlock size={16} className="ml-1" />
              )}
            </span>
          );
        },
      },
      {
        header: "INFO",
        accessorKey: "info",
        cell: (info) => {
          const data = info.row.original;
          return (
            <Link
              href={`/admin/inward/viewInward/${encodeURIComponent(data.ref)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="action-icon"
            >
              <Eye className="text-green-500" size={25} />
            </Link>
          );
        },
      },
      {
        header: "Download",
        accessorKey: "download",
        cell: (info) => {
          const ref = info.row.original.ref;
          return (
            <div className="flex items-center gap-2">
              <button
                onClick={() => downloadInwardFile(ref)}
                title="Download File"
                className="action-icon"
              >
                <Download className="text-green-500" size={24} />
              </button>
              <button
                onClick={() => downloadInwardInfoFile(ref)}
                title="Download Info"
                className="action-icon"
              >
                <DownloadCloud className="text-green-500" size={24} />
              </button>
              <button
                onClick={() => downloadInwardRangeFile(ref)}
                title="Download Range"
                className="action-icon"
              >
                <ArrowDownCircle className="text-green-500" size={24} />
              </button>
              <button
                onClick={() => {
                  console.log("run");

                  setSelectedRef(ref);
                  setShowModal(true);
                }}
                title="Delete Range"
                className="action-icon"
              >
                <Trash2 className="text-green-500" size={24} />
              </button>
            </div>
          );
        },
      },
    ],
    [admin]
  );

  const downloadCSV = (data, fileName = "edit_inward") => {
    console.log({ fileName });

    const header = data?.result?.header;

    const value = data?.result?.value;

    const csvContent = `${header}\n${value}`;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `${fileName}.csv`);
      link.style.visibility = "hidden";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const downloadInwardFile = async (ref) => {
    try {
      const response = await apiConnector(
        "GET",
        `${apiUrl}/v2/admin/process/downloadinwardfile?ref=${ref}`
      );

      // Access data from axios response
      const data = response.data;
      console.log({ datacsv: data });

      if (data.status) {
        toast.success(data?.result?.message);
        downloadCSV(data, data?.result?.fileName);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download file");
    }
  };

  const downloadInwardInfoFile = async (ref) => {
    try {
      const response = await apiConnector(
        "GET",
        `${apiUrl}/v2/admin/process/downloadInwardInfoFile?ref=${ref}`
      );

      // Access data from axios response
      const data = response.data;

      if (data.status) {
        toast.success(data?.result?.message);
        downloadCSV(data, data?.result?.fileName);
      } else {
        toast.error(data?.result?.message);
      }
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download info file");
    }
  };

  const downloadInwardRangeFile = async (ref) => {
    try {
      const response = await apiConnector(
        "GET",
        `${apiUrl}/v2/admin/process/downloadInwardRangeFile?ref=${ref}`
      );

      // Access data from axios response
      const data = response.data;

      if (data.status) {
        toast.success(data?.result?.message);
        downloadCSV(data, data?.result?.fileName);
      } else {
        toast.error(data?.result?.message);
      }
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download range file");
    }
  };

  const deleteInwardRangeData = async () => {
    if (!selectedRef) return;

    setIsDeleting(true);
    try {
      const response = await apiConnector(
        "GET",
        `${apiUrl}/v2/admin/process/deleteInwardRangeData?ref=${selectedRef}&table=b_inward`
      );

      // Access data from axios response
      const data = response.data;

      if (data.status) {
        toast.success(data?.result?.message);
        // Optionally refresh the data after successful deletion
        fetchInwardData();
      } else {
        toast.error(data?.result?.message || "Delete failed.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Something went wrong.");
    } finally {
      setIsDeleting(false);
      setShowModal(false);
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <div className="relative">
          {availableYears.length > 0 && (
            <div className="flex space-x-4 mb-4 border-b border-gray-300">
              <span className="text-sm font-medium text-gray-700 py-2 px-1">
                Years:
              </span>
              {availableYears.map((year) => (
                <button
                  key={year}
                  onClick={() => {
                    setActiveYear(year);
                    const yearData = yearWiseData[`year_${year}`] || {};
                    const firstTab = Object.keys(yearData)[0] || "All";
                    setActiveTab(firstTab);
                  }}
                  className={`pb-2 px-3 text-sm font-medium ${
                    activeYear === year
                      ? "border-b-2 border-blue-500 text-blue-600"
                      : "text-gray-500 hover:text-blue-500"
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          )}

          <div className="flex space-x-4 mb-4 border-b border-gray-300">
            <span className="text-sm font-medium text-gray-700 py-2 px-1">
              Categories:
            </span>
            {getAvailableTabsForYear().map((key) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`pb-2 px-3 text-sm font-medium ${
                  activeTab === key
                    ? "border-b-2 border-green-500 text-green-600"
                    : "text-gray-500 hover:text-green-500"
                }`}
              >
                {tabLabels[key] || key}
              </button>
            ))}
          </div>

          <ViewDataTable
            title={`${activeYear ? `${activeYear} - ` : ""}${
              tabLabels[activeTab] || activeTab
            } Inward Datewise`}
            cardHeader="inward datewise"
            columns={columns}
            isLoading={loading}
            data={filteredData}
            columnFilter={true}
          />

          {/* delete confirmation modal */}

          {showModal && (
            <div
              className={`fixed inset-0 w-full h-full min-h-screen px-3 flex items-center justify-center bg-black/50 z-[9999] transition duration-300 modal-backdrop`}
            >
              <div
                className="fixed inset-0 w-full h-full min-h-screen"
                onClick={() => setShowModal(false)}
              ></div>
              <div
                className={`relative w-full max-w-md max-h-[90%] text-black bg-white shadow shadow-black/5 rounded-lg overflow-hidden z-[99999] transition duration-300 modal-animation`}
              >
                <div className="p-4">
                  <h2 className="text-lg font-semibold">Are you sure?</h2>
                  <p className="text-sm text-gray-600 mb-6">
                    This action will delete the inward range.
                  </p>
                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={() => setShowModal(false)}
                      disabled={isDeleting}
                      className="btn btn-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={deleteInwardRangeData}
                      disabled={isDeleting}
                      className="btn btn-danger"
                    >
                      {isDeleting ? "Deleting..." : "Confirm Delete"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* automation modal */}
          {showAutomationModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
              <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative z-[99999]">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Automation Options</h2>
                  <button
                    onClick={() => setShowAutomationModal(false)}
                    className="text-gray-500 hover:text-gray-800 text-2xl"
                  >
                    &times;
                  </button>
                </div>
                <div className="space-y-4">
                  <button
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                    onClick={() => {
                      setShowAutomationModal(false);
                      infoAutomation();
                    }}
                  >
                    Info Automation
                  </button>
                  <button
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
                    onClick={() => {
                      setShowAutomationModal(false);
                      inwardAutomation();
                    }}
                  >
                    Inward Automation
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InwardDateWise;
