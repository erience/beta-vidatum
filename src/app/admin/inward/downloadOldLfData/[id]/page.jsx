"use client";
import { apiConnector } from "@/utils/apihelper";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

// Icons
const DownloadIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const FileIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const PrintIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
  </svg>
);

const ChevronDownIcon = ({ isOpen }) => (
  <svg 
    className={`w-6 h-6 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center min-h-[400px]">
    <div className="relative">
      <div className="w-12 h-12 border-4 border-blue-200 rounded-full"></div>
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
    </div>
    <p className="mt-4 text-gray-600 font-medium">Loading historical data...</p>
  </div>
);

const DownloadOldLfData = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCards, setExpandedCards] = useState(new Set());

  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const fetchOldRefData = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const response = await apiConnector(
        "GET",
        `${apiUrl}/v2/admin/viewInward?id=${id}&table=b_inward&isin=b_isin&demattable=b_inward_info`
      );
      if (response.status) {
        setData(response.data.result);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleCard = (cardIndex) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(cardIndex)) {
      newExpanded.delete(cardIndex);
    } else {
      newExpanded.add(cardIndex);
    }
    setExpandedCards(newExpanded);
  };

  // Form field mapping based on your image
  const getFormFields = (data) => {
    return [
      // Left Column
      { label: "Pin", value: data?.pin || "-" },
      { label: "Uid", value: data?.uid || "-" },
      { label: "Fms", value: data?.fms || "-" },
      { label: "Occupation", value: data?.occupation || "-" },
      { label: "Cessation", value: data?.cessation || "-" },
      { label: "Minor Dob", value: data?.minor_dob || "-" },
      { label: "Nomination Date", value: data?.nomination_date || "-" },
      
      // Right Column
      { label: "Email", value: data?.email || "-" },
      { label: "Cin", value: data?.cin || "-" },
      { label: "Category", value: data?.category || "Individual" },
      { label: "Nationality", value: data?.nationality || "-" },
      { label: "Is Minor", value: data?.is_minor ? "Yes" : "No" },
      { label: "Guardian Name", value: data?.guardian_name || "-" },
      { label: "Nominee Name", value: data?.nominee_name || "-" }
    ];
  };

  const renderFormData = (item) => {
    if (!item?.data) return null;

    const fields = getFormFields(item.data);
    const midpoint = Math.ceil(fields.length / 2);
    const leftFields = fields.slice(0, midpoint);
    const rightFields = fields.slice(midpoint);

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
          Personal Information
        </h4>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-4">
            {leftFields.map((field, index) => (
              <div key={index} className="flex items-start">
                <span className="font-medium text-gray-600 w-32 flex-shrink-0 text-sm">
                  {field.label}:
                </span>
                <span className="text-gray-800 text-sm ml-2 break-words">
                  {field.value}
                </span>
              </div>
            ))}
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {rightFields.map((field, index) => (
              <div key={index} className="flex items-start">
                <span className="font-medium text-gray-600 w-32 flex-shrink-0 text-sm">
                  {field.label}:
                </span>
                <span className="text-gray-800 text-sm ml-2 break-words">
                  {field.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Info */}
        {item.data && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-start">
                <span className="font-medium text-gray-600 text-sm w-20 flex-shrink-0">Ref:</span>
                <span className="text-gray-800 text-sm ml-2">{item.data.ref || "-"}</span>
              </div>
              <div className="flex items-start">
                <span className="font-medium text-gray-600 text-sm w-20 flex-shrink-0">ISIN:</span>
                <span className="text-gray-800 text-sm ml-2">{item.data.isin_id || "-"}</span>
              </div>
              <div className="flex items-start">
                <span className="font-medium text-gray-600 text-sm w-20 flex-shrink-0">Type:</span>
                <span className="text-gray-800 text-sm ml-2">{item.data.type || "-"}</span>
              </div>
              <div className="flex items-start">
                <span className="font-medium text-gray-600 text-sm w-20 flex-shrink-0">Status:</span>
                <span className="text-gray-800 text-sm ml-2">{item.data.status || "-"}</span>
              </div>
            </div>
          </div>
        )}

        {/* Remarks */}
        {item.data?.remarks && (
          <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r">
            <h5 className="font-medium text-yellow-800 mb-2 text-sm">Remarks:</h5>
            <p className="text-yellow-700 text-sm leading-relaxed">
              {item.data.remarks}
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderTableData = (dataArray, title, bgColor = "bg-blue-50") => {
    if (!dataArray || dataArray.length === 0) return null;

    return (
      <div className="mb-6">
        <div className={`${bgColor} p-4 rounded-lg border border-gray-200`}>
          <h4 className="text-lg font-semibold text-gray-800 mb-4">
            {title} ({dataArray.length} record{dataArray.length > 1 ? 's' : ''})
          </h4>
          
          <div className="space-y-4">
            {dataArray.map((item, index) => (
              <div key={index} className="bg-white rounded border border-gray-200 p-4">
                <h5 className="font-medium text-gray-700 mb-3 text-sm">
                  Record {index + 1}:
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(item).map(([key, value], idx) => (
                    <div key={idx} className="flex items-start">
                      <span className="font-medium text-gray-600 text-sm w-24 flex-shrink-0">
                        {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:
                      </span>
                      <span className="text-gray-800 text-sm ml-2 break-words">
                        {value !== null && value !== undefined ? String(value) : "-"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const downloadOriginalPDF = () => {
    if (data?.filePath) {
      const pdfUrl = `${apiUrl}/downloads/${data.filePath}`;
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = data.filePath;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const generatePDF = () => {
    const doc = new jsPDF("p", "pt", "a4");
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 40;
    let yPosition = 80;

    // Title
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Historical Data Report", margin, 50);

    // Date
    const currentDate = new Date().toLocaleDateString("en-GB");
    doc.setFontSize(10);
    doc.text(`Date: ${currentDate}`, pageWidth - 120, 50);

    if (data?.oldlfhistory && data.oldlfhistory.length > 0) {
      data.oldlfhistory.forEach((historyItem, historyIndex) => {
        // Check for new page
        if (yPosition > pageHeight - 150) {
          doc.addPage();
          yPosition = 50;
        }

        // Section header
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text(`${historyIndex + 1}. Reference: ${historyItem.message}`, margin, yPosition);
        yPosition += 25;

        if (historyItem.data && historyItem.data.length > 0) {
          historyItem.data.forEach((item, itemIndex) => {
            if (yPosition > pageHeight - 100) {
              doc.addPage();
              yPosition = 50;
            }

            doc.setFontSize(11);
            doc.setFont("helvetica", "bold");
            doc.text(`Record ${itemIndex + 1}:`, margin, yPosition);
            yPosition += 20;

            if (item.data) {
              const fields = getFormFields(item.data);
              doc.setFontSize(9);
              doc.setFont("helvetica", "normal");

              fields.forEach(field => {
                if (yPosition > pageHeight - 50) {
                  doc.addPage();
                  yPosition = 50;
                }
                doc.text(`${field.label}: ${field.value}`, margin + 10, yPosition);
                yPosition += 12;
              });
              yPosition += 15;
            }

            // Add register data
            if (item.c_register && item.c_register.length > 0) {
              doc.setFont("helvetica", "bold");
              doc.text("Register Data:", margin + 10, yPosition);
              yPosition += 15;
              // Add register data details...
            }

            // Add share data
            if (item.c_register_share && item.c_register_share.length > 0) {
              doc.setFont("helvetica", "bold");
              doc.text("Share Data:", margin + 10, yPosition);
              yPosition += 15;
              // Add share data details...
            }

            yPosition += 20;
          });
        }
      });
    }

    doc.save(`Historical-Data-Report-${id}-${new Date().toISOString().split("T")[0]}.pdf`);
  };

  useEffect(() => {
    fetchOldRefData();
  }, [id]);

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-4">
              <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-800">Error Loading Data</h3>
              <p className="text-red-700 mt-1">{error}</p>
              <button 
                onClick={fetchOldRefData}
                className="mt-3 px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentDate = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Action Buttons */}
      <div className="bg-white shadow-sm border-b border-gray-200 print:hidden">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-center space-x-4">
            <button
              onClick={generatePDF}
              className="inline-flex items-center px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors shadow-sm"
            >
              <DownloadIcon />
              <span className="ml-2">Generate PDF</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm"
            >
              <PrintIcon />
              <span className="ml-2">Print</span>
            </button>

            {data?.filePath && (
              <button
                onClick={downloadOriginalPDF}
                className="inline-flex items-center px-6 py-2.5 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors shadow-sm"
              >
                <FileIcon />
                <span className="ml-2">Download Original</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 print:py-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Historical Data Report</h1>
            <div className="text-right">
              <p className="text-sm text-gray-600">Date: {currentDate}</p>
              <p className="text-xs text-gray-500 mt-1">ID: {id}</p>
            </div>
          </div>
        </div>

        {/* Data Content */}
        {data?.oldlfhistory && data.oldlfhistory.length > 0 ? (
          <div className="space-y-6">
            {data.oldlfhistory.map((historyItem, historyIndex) => (
              <div key={historyIndex} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Header */}
                <div 
                  className="bg-gray-50 px-6 py-4 border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => toggleCard(historyIndex)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                        {historyIndex + 1}
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                          Reference: {historyItem.message}
                        </h2>
                        <p className="text-sm text-gray-600">
                          {historyItem.data?.length || 0} record(s) found
                        </p>
                      </div>
                    </div>
                    <ChevronDownIcon isOpen={expandedCards.has(historyIndex)} />
                  </div>
                </div>

                {/* Content */}
                <div className={`transition-all duration-300 ease-in-out ${
                  expandedCards.has(historyIndex) ? 'max-h-none opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                }`}>
                  <div className="p-6">
                    {historyItem.data && historyItem.data.length > 0 ? (
                      <div className="space-y-8">
                        {historyItem.data.map((item, itemIndex) => (
                          <div key={itemIndex}>
                            <div className="flex items-center mb-6">
                              <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-semibold mr-3">
                                {itemIndex + 1}
                              </div>
                              <h3 className="text-xl font-semibold text-gray-800">
                                Data Record {itemIndex + 1}
                              </h3>
                            </div>

                            {/* Form Data */}
                            {renderFormData(item)}

                            {/* Register Data */}
                            {renderTableData(item.c_register, "Register Data", "bg-purple-50")}

                            {/* Share Data */}
                            {renderTableData(item.c_register_share, "Share Data", "bg-red-50")}

                            {itemIndex < historyItem.data.length - 1 && (
                              <hr className="my-8 border-gray-200" />
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-gray-500">No data available for this reference</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Data Available</h3>
            <p className="text-gray-500">No historical data found for the requested period.</p>
          </div>
        )}
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body { background: white !important; }
          .print\\:hidden { display: none !important; }
          .print\\:py-4 { padding-top: 1rem !important; padding-bottom: 1rem !important; }
          .shadow-sm { box-shadow: none !important; }
          .bg-gray-50 { background-color: white !important; }
        }
      `}</style>
    </div>
  );
};

export default DownloadOldLfData;
