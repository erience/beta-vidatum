"use client";
import { useEffect, useMemo, useState } from "react";
import {
  AlertOctagon,
  CheckCircle,
  Download,
  Eye,
  File,
  Octagon,
  OctagonMinus,
} from "lucide-react";
import { apiConnector } from "@/utils/apihelper";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import FileFormateTable from "@/components/dataTables/FileFormateTable";
import { useBenposeStore } from "../../../../../../store/benposeStore";

const ViewInwardV2 = () => {
  const [data, setData] = useState({});
  const [requests, setRequests] = useState({});
  const [inwardRange, setInwardRange] = useState([]);
  const [inwardInfo, setInwardInfo] = useState({});
  const [bRegisterData, setBRegisterData] = useState([]);
  const [bRegisterShareData, setBRegisterShareData] = useState([]);
  const [oldLfData, setOldLfData] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const fetchInwardData = async () => {
    try {
      const response = await apiConnector(
        "GET",
        `${apiUrl}/v2/admin/viewInward?ref=${id}&tablename=b_inward_v2&getisintable=c_isin&getdemattable=b_inward_info_v2`
      );
      const result = response?.data?.result || {};

      setData(result.data || {});
      setRequests(result.requests || {});
      setInwardInfo(result.b_inward_info || {});
      setInwardRange(result.b_inward_range || []);
      setBRegisterData(result.b_register || []);
      setBRegisterShareData(result.b_register_share || []);

      // Extract oldLfData from different possible locations
      let oldLfDataArray = [];

      // Check if oldLfData exists at root level
      if (result.oldLfData) {
        oldLfDataArray = result.oldLfData;
      }

      // Check if oldLfData exists in transmission registers
      if (result.requests?.transmission?.registers) {
        result.requests.transmission.registers.forEach((register) => {
          if (register.oldLfData && Array.isArray(register.oldLfData)) {
            oldLfDataArray = [...oldLfDataArray, ...register.oldLfData];
          }
        });
      }

      // Check if oldLfData exists in history
      if (result.requests?.transmission?.history) {
        result.requests.transmission.history.forEach((historyItem) => {
          if (historyItem.data && Array.isArray(historyItem.data)) {
            historyItem.data.forEach((dataItem) => {
              if (dataItem.registers && Array.isArray(dataItem.registers)) {
                dataItem.registers.forEach((register) => {
                  if (register.oldLfData && Array.isArray(register.oldLfData)) {
                    oldLfDataArray = [...oldLfDataArray, ...register.oldLfData];
                  }
                });
              }
            });
          }
        });
      }

      setOldLfData(oldLfDataArray);

      // Extract history data if exists
      if (result.requests?.transmission?.history) {
        setHistoryData(result.requests.transmission.history);
      }
    } catch (error) {
      const errMsg = error?.response?.data?.message;
      toast.error(errMsg || "An error occurred while processing the request.");
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInwardData();
  }, []);

  // Helper function to check if remarks contain LOC conditions
  const shouldShowAnnexure = () => {
    const remarks = data.remarks;
    const isStatusActive = data.status === 1;

    if (!isStatusActive) return false;

    if (Array.isArray(remarks)) {
      return remarks.some(
        (remark) =>
          remark?.toLowerCase().includes("loc issued") ||
          remark?.toLowerCase().includes("loc not issued")
      );
    } else if (typeof remarks === "string") {
      return (
        remarks.toLowerCase().includes("loc issued") ||
        remarks.toLowerCase().includes("loc not issued")
      );
    }

    return false;
  };

  const stgFunction = async (x, y = false) => {
    try {
      let documentType;
      if (y) {
        documentType = "Annexure";
      } else {
        documentType = "Inward";
      }

      const response = await apiConnector(
        "GET",
        `${apiUrl}/v2/admin/process/download-data-of-inward?id=${x}&type=${documentType}&table=b_inward_v2&isin=c_isin&demattable=b_inward_info_v2`,
        true
      );
      if (response?.status === 200 || response?.data?.status === 200) {
        if (y) {
          const annexureResponse = await apiConnector(
            "GET",
            `${apiUrl}/v2/admin/process/download-data-of-annexure-final?id=${x}&table=b_inward_v2&isin=c_isin`,
            true
          );

          if (
            annexureResponse?.data?.status === 200 ||
            annexureResponse?.data?.status === true
          ) {
            const downloadData = annexureResponse?.data?.result;
            useBenposeStore.getState().setFormData(downloadData);
            const getLink = downloadData?.getLink;
            const encodedRef = encodeURIComponent(x);

            const routeMap = {
              other_inward_outward_letter: `/admin/inward/otherInwardOutwardLetter/${encodedRef}`,
              other_rejection_outward_letter: `/admin/inward/latter/otherRejctionOutwardLatter/${encodedRef}`,
              kyc_approval_outward_letter: `/admin/inward/latter/kycApprovalOutwardLetter/${encodedRef}`,
              approval_outward_letter: `/admin/inward/latter/approvalOutwardLetter/${encodedRef}`,
              rejection_outward_letter: `/admin/inward/latter/rejectionOutwardLetter/${encodedRef}`,
              annexureb: `/admin/inward/annexureBv2/${encodedRef}`,
            };
            router.push(
              routeMap[getLink] || routeMap.other_inward_outward_letter
            );
          } else {
            toast.error(
              annexureResponse?.data?.message || "Failed to get annexure data"
            );
          }
        } else {
          const res2 = await apiConnector(
            "GET",
            `${apiUrl}/v2/admin/process/download-data-of-inward-final?id=${x}&table=b_inward_v2&isin=c_isin&demattable=b_inward_info_v2`,
            true
          );

          if (res2?.data?.status === 200 || res2?.data?.status === true) {
            const downloadData = res2?.data?.result;
            useBenposeStore.getState().setFormData(downloadData);
            const getLink = downloadData?.getLink;
            const encodedRef = encodeURIComponent(x);

            const routeMap = {
              other_inward_outward_letter: `/admin/inward/otherInwardOutwardLetter/${encodedRef}`,
              other_rejection_outward_letter: `/admin/inward/latter/otherRejctionOutwardLatter/${encodedRef}`,
              kyc_approval_outward_letter: `/admin/inward/latter/kycApprovalOutwardLetter/${encodedRef}`,
              approval_outward_letter: `/admin/inward/latter/approvalOutwardLetter/${encodedRef}`,
              rejection_outward_letter: `/admin/inward/latter/rejectionOutwardLetter/${encodedRef}`,
              annexureb: `/admin/inward/annexureBv2/${encodedRef}`,
            };

            router.push(
              routeMap[getLink] || routeMap.other_inward_outward_letter
            );
          } else {
            toast.error(res2?.data?.message || "Failed to get download data");
          }
        }
      } else {
        const errorMessage =
          response?.data?.message ||
          response?.responseText ||
          "An error occurred";
        toast.error(errorMessage);
      }
    } catch (error) {
      let errorMessage = "An error occurred while processing the request.";

      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
      console.error("Error in stgFunction:", error);
    }
  };

  const inwardForm = async (ref, type) => {
    try {
      const typeToUrl = {
        demat: "/v2/admin/process/download-demat-inward-form",
        transmission: "/v2/admin/process/download-transmission-inward-form",
        kyc: "/v2/admin/process/download-kyc-inward-form",
        duplicate: "/v2/admin/process/download-duplicate-inward-form",
        exchange: "/v2/admin/process/download-exchange-inward-form",
        others: "/v2/admin/process/download-others-inward-form",
      };

      const lowercaseType = type?.toLowerCase();
      if (!lowercaseType || !typeToUrl[lowercaseType]) {
        toast.error("Unknown form type.");
        return;
      }

      const response = await apiConnector(
        "GET",
        `${apiUrl}${typeToUrl[lowercaseType]}?id=${ref}&table=b_inward_v2&isin=c_isin`
      );

      const formData = response?.data?.result?.data;
      if (!formData) {
        toast.error("Failed to get form data.");
        return;
      }

      sessionStorage.setItem(
        "inwardDownload",
        JSON.stringify({ type: lowercaseType, data: formData })
      );

      router.push(
        `/admin/inward/inwardRequestDownload?id=${encodeURIComponent(ref)}`
      );
    } catch (error) {
      toast.error(
        error.response.data.message ||
          "Failed to download form. Please try again."
      );
      console.error("Error downloading inward form:", error);
    }
  };

  const columns = useMemo(
    () => [
      { header: "#", accessorKey: "index", cell: (info) => info.row.index + 1 },
      {
        header: "CERTIFICATE",
        accessorKey: "certi",
        cell: (info) => info.row.original.certi,
      },
      {
        header: "FROM",
        accessorKey: "from",
        cell: (info) => info.row.original.from,
      },
      {
        header: "TO",
        accessorKey: "to",
        cell: (info) => info.row.original.to,
      },
      {
        header: "COUNT",
        accessorKey: "count",
        cell: (info) => info.row.original.count,
      },
      {
        header: "STATUS",
        accessorKey: "status",
        cell: ({ row }) => {
          const status = row.original.status;
          const badgeStyles =
            "inline-block text-xs font-semibold px-3 py-1 rounded-full";

          switch (status) {
            case 1:
              return (
                <span className={`${badgeStyles} bg-green-100 text-green-800`}>
                  Approved
                </span>
              );
            case 2:
              return (
                <span
                  className={`${badgeStyles} bg-yellow-100 text-yellow-500`}
                >
                  Pending
                </span>
              );
            case 3:
              return (
                <span className={`${badgeStyles} bg-red-100 text-red-800`}>
                  Rejected
                </span>
              );
            case 4:
              return (
                <span className={`${badgeStyles} bg-red-100 text-red-800`}>
                  Deleted
                </span>
              );
            case 5:
              return (
                <span className={`${badgeStyles} bg-blue-500 text-white`}>
                  Partial Approved
                </span>
              );
            default:
              return <span className="badge badge-secondary">Unknown</span>;
          }
        },
      },
    ],
    []
  );

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderTransmissionInfo = () => {
    const transmissionInfo = requests?.transmission?.info;
    if (!Array.isArray(transmissionInfo) || transmissionInfo.length === 0)
      return null;

    return (
      <div className="bg-white shadow-md p-4 rounded-lg border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h5 className="text-base font-semibold">Inward Information</h5>
          <span className="bg-cyan-100 text-cyan-800 text-xs font-semibold px-3 py-1 rounded">
            Transmission
          </span>
        </div>

        {transmissionInfo.map((item, idx) => (
          <div key={idx} className="mb-6">
            <div className="mb-4">
              <p className="font-semibold">
                <strong>LEDGER FOLIO:</strong> {item.lf || "N/A"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-700">
              <div>
                <p>
                  <strong>NAME OF DECEASED HOLDER 1:</strong>
                </p>
                <p>{item.nodh1 || "No"}</p>
                <p>
                  <strong>DATE OF DEMISE (HOLDER 1):</strong>
                </p>
                <p>{item.nodh1dod || "N/A"}</p>
                <p>
                  <strong>NAME OF CLAIMANT 1:</strong>
                </p>
                <p>{item.noc1 || "N/A"}</p>
                <p>
                  <strong>PAN CARD OF CLAIMANT 1:</strong>
                </p>
                <p>{item.poc1 || "N/A"}</p>
                <p>
                  <strong>IS MINOR:</strong>
                </p>
                <p>{item.isMinor === 2 ? "No" : "Yes"}</p>
              </div>

              <div>
                <p>
                  <strong>NAME OF DECEASED HOLDER 2:</strong>
                </p>
                <p>{item.nodh2 || "No"}</p>
                <p>
                  <strong>DATE OF DEMISE (HOLDER 2):</strong>
                </p>
                <p>{item.nodh2dod || "N/A"}</p>
                <p>
                  <strong>NAME OF CLAIMANT 2:</strong>
                </p>
                <p>{item.noc2 || "N/A"}</p>
                <p>
                  <strong>PAN CARD OF CLAIMANT 2:</strong>
                </p>
                <p>{item.poc2 || "N/A"}</p>
                <p>
                  <strong>GUARDIAN NAME:</strong>
                </p>
                <p>{item.gName || "No"}</p>
              </div>

              <div>
                <p>
                  <strong>NAME OF DECEASED HOLDER 3:</strong>
                </p>
                <p>{item.nodh3 || "No"}</p>
                <p>
                  <strong>DATE OF DEMISE (HOLDER 3):</strong>
                </p>
                <p>{item.nodh3dod || "N/A"}</p>
                <p>
                  <strong>NAME OF CLAIMANT 3:</strong>
                </p>
                <p>{item.noc3 || "N/A"}</p>
                <p>
                  <strong>PAN CARD OF CLAIMANT 3:</strong>
                </p>
                <p>{item.poc3 || "N/A"}</p>
                <p>
                  <strong>RELATIONSHIP WITH MINOR:</strong>
                </p>
                <p>{item.rStatus || "Other"}</p>
              </div>
            </div>

            {/* Bank Details Section */}
            <div className="mt-6 border-t pt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-700">
                <div>
                  <p>
                    <strong>TAX STATUS:</strong>
                  </p>
                  <p>{item.tStatus || "Resident Individual"}</p>
                  <p>
                    <strong>BANK NAME:</strong>
                  </p>
                  <p>{item.bName || "N/A"}</p>
                  <p>
                    <strong>BANK ACCOUNT:</strong>
                  </p>
                  <p>{item.bAccount || "N/A"}</p>
                  <p>
                    <strong>BANK CITY:</strong>
                  </p>
                  <p>{item.bCity || "N/A"}</p>
                  <p>
                    <strong>OCCUPATION:</strong>
                  </p>
                  <p>{item.occupation || "Business"}</p>
                  <p>
                    <strong>IS FATCA:</strong>
                  </p>
                  <p>{item.isFatca === 1 ? "Yes" : "No"}</p>
                </div>

                <div>
                  <p>
                    <strong>ADDRESS:</strong>
                  </p>
                  <p>{item.address || "N/A"}</p>
                  <p>
                    <strong>BANK BRANCH:</strong>
                  </p>
                  <p>{item.bBranch || "N/A"}</p>
                  <p>
                    <strong>BANK IFSC:</strong>
                  </p>
                  <p>{item.bIFSC || "N/A"}</p>
                  <p>
                    <strong>BANK TYPE:</strong>
                  </p>
                  <p>{item.bType || "Saving"}</p>
                  <p>
                    <strong>BANK PIN:</strong>
                  </p>
                  <p>{item.bPin || "N/A"}</p>
                  <p>
                    <strong>POLITICAL STATUS:</strong>
                  </p>
                  <p>{item.pStatus || "Not Applicable"}</p>
                  <p>
                    <strong>IS NOMINATION:</strong>
                  </p>
                  <p>{item.isNomination === 2 ? "No" : "Yes"}</p>
                </div>

                <div>
                  <p>
                    <strong>BANK MICR:</strong>
                  </p>
                  <p>{item.bMICR || "N/A"}</p>
                  <p>
                    <strong>BANK PROOF:</strong>
                  </p>
                  <p>{item.bProof || "Cancel Cheque"}</p>
                  <p>
                    <strong>ANNUAL INCOME:</strong>
                  </p>
                  <p>{item.aIncome || "1-5 Lacs"}</p>
                  <p>
                    <strong>IS KYC:</strong>
                  </p>
                  <p>{item.isKyc === 1 ? "Yes" : "No"}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderRegisterData = () => {
    const registers = requests?.transmission?.registers;
    if (!Array.isArray(registers) || registers.length === 0) return null;

    return registers.map((register, idx) => (
      <div
        key={idx}
        className="bg-white shadow-md p-4 rounded-lg border border-gray-200"
      >
        <div className="flex justify-between items-center mb-4">
          <h5 className="text-base font-semibold">Register Data</h5>
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded">
            LF: {register.lf}
          </span>
        </div>

        {register.c_register?.map((regItem, regIdx) => (
          <div
            key={regIdx}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-700"
          >
            <div>
              <p>
                <strong>Name:</strong> {regItem.name}
              </p>
              <p>
                <strong>Share:</strong> {regItem.share}
              </p>
              <p>
                <strong>Address:</strong> {regItem.address}
              </p>
              <p>
                <strong>PIN:</strong> {regItem.pin}
              </p>
            </div>
            <div>
              <p>
                <strong>Category:</strong> {regItem.category}
              </p>
              <p>
                <strong>Occupation:</strong> {regItem.occupation}
              </p>
              <p>
                <strong>Father/Mother/Spouse:</strong> {regItem.fms}
              </p>
              <p>
                <strong>Is Minor:</strong> {regItem.is_minor}
              </p>
            </div>
            <div>
              <p>
                <strong>Status:</strong> {regItem.status}
              </p>
              <p>
                <strong>Dump:</strong> {regItem.dump}
              </p>
              <p>
                <strong>Lien:</strong> {regItem.lien}
              </p>
            </div>
          </div>
        ))}
      </div>
    ));
  };

  // Calculate range counts
  const rangeCounts = useMemo(() => {
    if (!inwardRange || inwardRange.length === 0) {
      return { totalCount: 0, approveCount: 0, rejectCount: 0 };
    }

    return inwardRange.reduce(
      (acc, range) => {
        acc.totalCount += range.count || 0;
        if (range.status === 1) {
          acc.approveCount += range.count || 0;
        } else if (range.status === 3) {
          acc.rejectCount += range.count || 0;
        }
        return acc;
      },
      { totalCount: 0, approveCount: 0, rejectCount: 0 }
    );
  }, [inwardRange]);

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Left Panel */}
        <div className="col-span-1">
          <div className="p-4 rounded-lg mb-6 border border-gray-200">
            <h5 className="text-base font-semibold border-b pb-2 mb-3">
              Actions
            </h5>
            <table className="w-full text-sm table-fixed">
              <thead>
                <tr className="text-gray-500 border-b">
                  <th className="text-left w-2/3 py-1">PARTICULARS</th>
                  <th className="text-left w-1/3 py-1">LINK</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2">Change in Register</td>
                  <td>
                    <span className="text-red-500">
                      <OctagonMinus />
                    </span>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">Scanned Request</td>
                  <td>
                    {data.filePath ? (
                      <a
                        href={`/inwardpdfs/${data.filePath}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600"
                      >
                        <File />
                      </a>
                    ) : (
                      <span title="Not Found" className="text-green-600">
                        <File />
                      </span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="py-2">Master Data</td>
                  <td>
                    {inwardInfo?.lf || requests?.transmission?.info?.[0]?.lf ? (
                      <Link
                        href={`/admin/register/viewRegisterShare/${btoa(
                          inwardInfo.lf || requests.transmission.info[0].lf
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600"
                      >
                        <Eye />
                      </Link>
                    ) : (
                      <Eye className="text-green-600" />
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Past Requests */}
          {/* Past Requests */}
          {Array.isArray(oldLfData) && oldLfData.length > 0 && (
            <div className="bg-white shadow-md p-4 rounded-lg border border-gray-200 mb-4">
              <h5 className="text-base font-semibold border-b pb-2 mb-3">
                Past Request(s)
              </h5>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500 border-b">
                    <th className="text-left py-2 font-medium">REF</th>
                    <th className="text-left py-2 font-medium">STATUS</th>
                    <th className="text-left py-2 font-medium">LINK</th>
                  </tr>
                </thead>
                <tbody>
                  {oldLfData.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2">{item.ref}</td>
                      <td className="py-2">{item.lf}</td>
                      <td className="py-2">
                        <Link
                          href={`/admin/inward/viewInwardV2/${encodeURIComponent(
                            item.ref
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-800"
                        >
                          <Eye size={18} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Warning Icons */}
          <div className="bg-white shadow-md p-4 rounded-lg border border-gray-200">
            <div className="flex space-x-6 mt-4">
              {data.filePath &&
                (inwardInfo.lf || requests?.transmission?.info?.[0]?.lf) &&
                inwardRange.length > 0 && (
                  <div className="flex flex-col items-center text-green-500 text-xs">
                    <CheckCircle size={24} />
                    <span>All Done</span>
                  </div>
                )}
              {!data.filePath && (
                <div className="flex flex-col items-center text-red-500 text-xs">
                  <AlertOctagon size={24} />
                  <span>PDF</span>
                </div>
              )}
              {!inwardInfo.lf && !requests?.transmission?.info?.[0]?.lf && (
                <div className="flex flex-col items-center text-red-500 text-xs">
                  <AlertOctagon size={24} />
                  <span>Info</span>
                </div>
              )}
              {inwardRange.length === 0 && (
                <div className="flex flex-col items-center text-yellow-500 text-xs">
                  <AlertOctagon size={24} />
                  <span>Range</span>
                </div>
              )}
            </div>
          </div>

          {/* Downloads */}
          <div className="mt-6">
            <h6 className="font-semibold text-sm mb-2">Downloads</h6>
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => inwardForm(data.ref, data.type)}
                className="flex items-center gap-1 text-green-600 hover:underline"
              >
                <Download size={20} />
                <span>Inward Form</span>
              </button>

              {data.status === 1 && (
                <>
                  {data.type?.toLowerCase() !== "demat" && (
                    <button
                      onClick={() => stgFunction(data.ref)}
                      className="flex items-center gap-1 text-green-600 hover:underline"
                    >
                      <Download size={20} />
                      <span>Approval Letter</span>
                    </button>
                  )}

                  {(["transmission", "duplicate", "exchange"].includes(
                    data.type?.toLowerCase()
                  ) ||
                    shouldShowAnnexure()) && (
                    <button
                      onClick={() => stgFunction(data.ref, true)}
                      className="flex items-center gap-1 text-green-600 hover:underline"
                    >
                      <Download size={20} />
                      <span>Annexure</span>
                    </button>
                  )}
                </>
              )}

              {data.status === 3 && (
                <button
                  onClick={() => stgFunction(data.ref)}
                  className="flex items-center gap-1 text-green-600 hover:underline"
                >
                  <Download size={20} />
                  <span>Rejection Letter</span>
                </button>
              )}
            </div>

            <div className="mt-2 text-xs flex items-center gap-2">
              {data.status === 1 || data.status === 3 ? (
                <div className="flex items-center text-green-600">
                  <CheckCircle size={18} className="mr-1" />
                  <span>Download Ready</span>
                </div>
              ) : (
                <div className="flex items-center text-gray-400">
                  <Octagon size={18} className="mr-1" />
                  <span>No Downloads Available</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="col-span-1 lg:col-span-3 space-y-4">
          {/* Inward Info */}
          <div className="bg-white shadow-md p-4 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h5 className="text-base font-semibold">Inward</h5>
              <button className="bg-green-500 text-white text-xs font-medium px-4 py-2 rounded">
                Approve
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-700">
              <div>
                <p>
                  <strong>INWARD DATE:</strong>
                </p>
                <p>{formatDate(data?.date)}</p>
                <p>
                  <strong>INWARD MODE:</strong>
                </p>
                <p>{data?.mode}</p>
                <p>
                  <strong>SENDER:</strong>
                </p>
                <p>{data?.sender}</p>
              </div>
              <div>
                <p>
                  <strong>INWARD NO.:</strong>
                </p>
                <p>{data?.ref}</p>
                <p>
                  <strong>TYPE:</strong>
                </p>
                <p>{data?.type}</p>
                <p>
                  <strong>LOCATION:</strong>
                </p>
                <p>{data?.location}</p>
              </div>
              <div>
                <p>
                  <strong>PROCESSING DATE:</strong>
                </p>
                <p>{formatDate(data?.p_date)}</p>
                <p>
                  <strong>SUB TYPE:</strong>
                </p>
                <p>{data?.sub_type || "Not Applicable"}</p>
              </div>
            </div>

            <div className="mt-4">
              <p>
                <strong>REMARKS:</strong>
              </p>
              {Array.isArray(data.remarks) ? (
                <ul className="list-disc ml-5 text-gray-600">
                  {data.remarks.map((remark, idx) => (
                    <li key={idx}>{remark}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">{data.remarks || ""}</p>
              )}
            </div>
          </div>

          {/* Transmission Request Information */}
          {renderTransmissionInfo()}

          {/* Register Data */}
          {renderRegisterData()}

          {/* Inward Range */}
          <div className="bg-white shadow-md p-4 rounded-lg border border-gray-200">
            <h5 className="font-semibold text-base mb-3">Inward Range</h5>

            <div className="mb-4 text-sm">
              <span>
                Total Count: <strong>{rangeCounts.totalCount}</strong>
              </span>
              <span className="ml-4">
                Approved Count: <strong>{rangeCounts.approveCount}</strong>
              </span>
              <span className="ml-4">
                Rejected Count: <strong>{rangeCounts.rejectCount}</strong>
              </span>
            </div>

            <FileFormateTable
              title=""
              columns={columns}
              data={inwardRange}
              isLoading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewInwardV2;
