"use client";
import {
  AlertOctagon,
  ArrowDownCircle,
  Check,
  Download,
  DownloadCloud,
  Eye,
  Trash2,
  Unlock,
  Lock,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useBenposeStore } from "../../../../../store/benposeStore";
import { apiConnector } from "@/utils/apihelper";
import ViewDataTable from "@/components/dataTables/ViewDataTable";

const SearchInwardData = () => {
  const [loading, setLoading] = useState(true);
  const dataStore = useBenposeStore((state) => state.formData);
  const data = dataStore?.result?.data?.All || [];
  const admin = dataStore?.result?.isMaker || "";
  const [modalData, setModalData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedRef, setSelectedRef] = useState(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  console.log({ dataStore });

  useEffect(() => {
    if (dataStore?.result && Array.isArray(dataStore?.result?.data?.All)) {
      setLoading(false);
    }
  }, [dataStore]);

  //-------------------------dynamic columns------------------------------
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
        cell: (info) => info.row.original.date || "-",
      },
      {
        header: "Process Date",
        accessorKey: "p_date",
        cell: (info) => info.row.original.p_date || "-",
      },
      {
        header: "Ref No.",
        accessorKey: "ref",
        cell: (info) => info.row.original.ref,
      },
      {
        header: "ISIN",
        accessorKey: "isin",
        cell: (info) => info.row.original.isin,
      },
      {
        header: "Company",
        accessorKey: "cin",
        cell: (info) => info.row.original.cin,
      },
      {
        header: "LF",
        accessorKey: "inward_lf",
        cell: (info) => info.row.original.inward_lf || "-",
      },
      {
        header: "Mode",
        accessorKey: "mode",
        cell: (info) => info.row.original.mode,
      },
      {
        header: "Sender",
        accessorKey: "sender",
        cell: (info) => info.row.original.sender,
      },
      {
        header: "Type",
        accessorKey: "type",
        cell: (info) => info.row.original.type,
      },
      {
        header: "Location",
        accessorKey: "location",
        cell: (info) => info.row.original.location,
      },
      {
        header: "Sub Type",
        accessorKey: "sub_type",
        cell: (info) =>
          info.row.original.sub_type?.length > 0
            ? info.row.original.sub_type
            : "-",
      },
      {
        header: "Inwarded By",
        accessorKey: "username",
        cell: (info) =>
          info.row.original.username?.length > 0
            ? info.row.original.username
            : "-",
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: (info) => {
          const status = info.row.original.status;
          switch (status) {
            case 1:
              return (
                <span className="badge bg-green-500 text-white px-2 py-1 text-xs rounded">
                  Approved
                </span>
              );
            case 2:
              return (
                <span className="badge bg-yellow-500 text-white px-2 py-1 text-xs rounded">
                  Pending
                </span>
              );
            case 3:
              return (
                <span className="badge bg-red-500 text-white px-2 py-1 text-xs rounded">
                  Rejected
                </span>
              );
            case 4:
              return (
                <span className="badge bg-red-500 text-white px-2 py-1 text-xs rounded">
                  Delete
                </span>
              );
            case 5:
              return (
                <span className="badge bg-green-500 text-white px-2 py-1 text-xs rounded">
                  Partial Approved
                </span>
              );
            default:
              return "Something Went Wrong";
          }
        },
      },
      {
        header: "Verify",
        accessorKey: "verify",
        cell: (info) => {
          const data = info.row.original;
          if (admin) {
            if (data.verify === 2) {
              return (
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded flex items-center text-xs"
                  onClick={() => lockUnlockRef(data)}
                >
                  Verified <Lock className="ml-1" size={16} />
                </button>
              );
            } else {
              return (
                <button
                  className="bg-green-500 text-white px-2 py-1 rounded flex items-center text-xs"
                  onClick={() => lockUnlockRef(data)}
                >
                  Not Verified <Unlock className="ml-1" size={16} />
                </button>
              );
            }
          } else {
            if (data.verify === 2) {
              return (
                <span className="bg-red-500 text-white px-2 py-1 rounded flex items-center text-xs">
                  Verified <Lock className="ml-1" size={16} />
                </span>
              );
            } else {
              return (
                <span className="bg-green-500 text-white px-2 py-1 rounded flex items-center text-xs">
                  Not Verified <Unlock className="ml-1" size={16} />
                </span>
              );
            }
          }
        },
      },
      {
        header: "INFO",
        accessorKey: "info",
        cell: (info) => {
          const data = info.row.original;
          return (
            <a
              href={`/admin/inward/viewInward/${encodeURIComponent(data.ref)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="action-icon"
            >
              <Eye size={25} className="text-green-500" />
            </a>
          );
        },
      },
      {
        header: "Missing",
        accessorKey: "missing",
        cell: (info) => {
          const data = info.row.original;
          if (!data.missing) return null;

          const allFalse = Object.keys(data.missing).every(
            (field) => !data.missing[field].status
          );

          if (allFalse) {
            return (
              <div className="flex flex-col items-center justify-center space-y-1">
                <Check className="text-green-500" size={24} />
                <span className="text-green-500">All Done</span>
              </div>
            );
          }

          return (
            <div className="flex gap-3 justify-evenly items-center">
              {Object.keys(data.missing).map((field) => {
                if (data.missing[field].status) {
                  return (
                    <div
                      key={field}
                      className={`flex gap-1 ${
                        Object.keys(data.missing).length === 1
                          ? "flex-row"
                          : "flex-col"
                      } mr-1 justify-center`}
                    >
                      <a
                        href="#"
                        className="action-icon"
                        title={data.missing[field].message}
                      >
                        <AlertOctagon
                          className={`${
                            field === "range"
                              ? "text-yellow-500"
                              : "text-red-500"
                          }`}
                          size={24}
                        />
                      </a>
                      <span
                        className={
                          field === "range" ? "text-yellow-500" : "text-red-500"
                        }
                      >
                        {data.missing[field].label}
                      </span>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          );
        },
      },
      //   {
      //     header: "Action",
      //     accessorKey: "action",
      //     cell: (info) => {
      //       const data = info.row.original;

      //       if (data.status === 2) {
      //         return null;
      //       } else if (data.status === 1) {
      //         if (data.type === "Demat") {
      //           return null;
      //         } else {
      //           return (
      //             <div className="flex gap-2">
      //               <button
      //                 onClick={() => stgFunction(data.ref)}
      //                 className="action-icon"
      //                 title="Download Approval Letter"
      //               >
      //                 <Download className="text-green-500" size={24} />
      //               </button>
      //               <button
      //                 onClick={() => stgFunction(data.ref, true)}
      //                 className="action-icon"
      //                 title="Download Annexure Letter"
      //               >
      //                 <Download className="text-green-500" size={24} />
      //               </button>
      //             </div>
      //           );
      //         }
      //       } else if (data.status === 3) {
      //         return (
      //           <button
      //             onClick={() => stgFunction(data.ref)}
      //             className="action-icon"
      //             title="Download Rejection Letter"
      //           >
      //             <Download className="text-green-500" size={24} />
      //           </button>
      //         );
      //       }

      //       return null;
      //     },
      //   },
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

  //--------------------------locked data-----------------------------------
  const lockUnlockRef = (data) => {
    if (!admin) {
      toast.error("Invalid Action.");
      return;
    }

    // Open modal and store data
    setModalData(data);
  };

  const handleConfirm = async () => {
    if (!modalData) return;

    try {
      const response = await apiConnector(
        "POST",
        `${apiUrl}/v2/admin/process/inward/lockVerified?table=b_inward`,
        { ref: modalData.ref, table: "b_isin", demattable: "b_inward_info" }
      );
      const jsonResponse = response.data;

      if (jsonResponse.status === true) {
        toast.success(jsonResponse.result.message);
        refreshData();
      } else {
        toast.error(jsonResponse.result.message || "Verification failed.");
      }
    } catch (error) {
      let errorMessage = "An error occurred while processing the request.";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      toast.error(errorMessage);
      console.error("Error:", error);
    } finally {
      setModalData(null); // close modal
    }
  };

  const handleCancel = () => {
    setModalData(null);
  };

  // Function to fetch KYC letter data and show it
  const stgFunction = (ref, annexure = false) => {
    const documentType = annexure ? "Annexure" : "Inward";
    console.log({ documentType, ref });
    axios
      .get(
        `/v2/admin/process/download-data-of-inward?id=${ref}&type=${documentType}&table=b_inward&demattable=b_inward_info`
      )
      .then((response) => {
        if (response.data.status) {
          console.log(response.data.status);
          if (!annexure) {
            axios
              .get(
                `/v2/admin/process/download-data-of-inward?id=${ref}&table=b_inward&demattable=b_inward_info`,
                "_blank"
              )
              .then((kycResponse) => {
                if (kycResponse.data.status) {
                  console.log("kycreport", kycResponse.data.result);
                  navigate(
                    `/admin/process/download-data-of-inward-final/${encodeURIComponent(
                      ref
                    )}`,
                    "_blank"
                  );
                } else {
                  toast.error(
                    kycResponse.data.message || "Failed to fetch KYC data"
                  );
                }
              })
              .catch((error) => {
                const errMsg = error.response.data.message;
                toast.error(errMsg || "Failed to fetch KYC data");
                console.error("KYC data fetch error:", error);
              });
          } else {
            navigate(
              `/admin/process/download-data-of-annexure-final/${encodeURIComponent(
                ref
              )}`,
              "_blank"
            );
          }
        } else {
          toast.error(response.data.message || "Download preparation failed");
        }
      })
      .catch((error) => {
        toast.dismiss();
        const errorMessage = error.response?.data?.message || "Download failed";
        toast.error(errorMessage);
        console.error("Download error:", error);
      });
  };

  //-----------------------download csv file------------------------------
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
      const data = await response.json();
      console.log({ datacsv: data });

      if (response.ok) {
        toast.success(data?.result?.message);
        downloadCSV(data, data?.result?.fileName);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  const downloadInwardInfoFile = async (ref) => {
    try {
      const response = await apiConnector(
        "GET",
        `${apiUrl}/v2/admin/process/downloadInwardInfoFile?ref=${ref}`
      );
      const data = await response.json();

      if (response.ok) {
        toast.success(data?.result?.message);
        downloadCSV(data, data?.result?.fileName);
      } else {
        toast.error(data?.result?.message);
      }
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  const downloadInwardRangeFile = async (ref) => {
    try {
      const response = await apiConnector(
        "GET",
        `${apiUrl}/v2/admin/process/downloadInwardRangeFile?ref=${ref}`
      );
      const data = await response.json();

      if (response.ok) {
        toast.success(data?.result?.message);
        downloadCSV(data, data?.result?.fileName);
      } else {
        console.log(data?.result?.message);
      }
    } catch (error) {
      console.error("Download error:", error);
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
      const data = await response.json();

      if (response.ok) {
        toast.success(data?.result?.message);
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
    <div className="relative">
      <ViewDataTable
        title="Serach Inward Data"
        columns={columns}
        data={data}
        columnFilter={true}
        isLoading={loading}
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

      {/* Confirmation Modal */}
      {modalData && (
        <div
          className={`fixed inset-0 w-full h-full min-h-screen px-3 flex items-center justify-center bg-black/50 z-[9999] transition duration-300 modal-backdrop`}
        >
          <div
            className="fixed inset-0 w-full h-full min-h-screen"
            onClick={handleCancel}
          ></div>
          <div
            className={`relative w-full max-w-md max-h-[90%] text-black bg-white shadow shadow-black/5 rounded-lg overflow-hidden z-[99999] transition duration-300 modal-animation`}
          >
            <div className="p-4">
              <h2 className="text-lg font-semibold">Confirm Action</h2>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to{" "}
                <span className="font-bold text-blue-600">
                  {modalData.verify === 1 ? "Lock" : "UnLock"}
                </span>{" "}
                Activity <span className="text-gray-800">{modalData.ref}</span>?
              </p>

              <div className="flex justify-end space-x-3">
                <button onClick={handleCancel} className="btn btn-secondary">
                  Cancel
                </button>
                <button onClick={handleConfirm} className="btn btn-success">
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchInwardData;
