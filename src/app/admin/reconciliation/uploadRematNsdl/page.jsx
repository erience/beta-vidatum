"use client";
import { apiConnector } from "@/utils/apihelper";
import { importCSV } from "@/utils/helper";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

const UploadRematNsdl = () => {
  const [showModal, setShowModal] = useState(false);
  const [csvData, setCsvData] = useState([]);
  const [csvHeaders, setCsvHeaders] = useState({
    originalHeaders: [],
    processedHeaders: [],
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentData, setCurrentData] = useState({});
  const fileInputRef = useRef(null);
  const totalData = csvData.length;
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const regex = /^([a-zA-Z0-9\s_()\\.\-:])+(.csv)$/;
    if (!regex.test(file.name.toLowerCase())) {
      toast.error("Please upload a valid CSV file!");
      e.target.value = "";
      return;
    }

    try {
      const result = await importCSV(file);

      if (result.entries.length === 0) {
        toast.error("CSV file is empty or invalid!");
        return;
      }
      setCsvHeaders({
        originalHeaders: result.originalHeaders,
        processedHeaders: result.processedHeaders,
      });
      console.log("csvdata", result.entries);

      setCsvData(result.entries);
      console.log("csv", result.entries[0]);

      setCurrentData(result.entries[0]);

      toast.success("CSV loaded successfully. Click submit to proceed.");
    } catch (error) {
      toast.error("Error reading file: " + error);
      console.error(error);
    }
  };

  const renderInputFields = (data) => {
    const keys = Object.keys(data);
    const headerMapping = {};
    csvHeaders.processedHeaders.forEach((header, index) => {
      headerMapping[header] = csvHeaders.originalHeaders[index];
    });

    return keys.map((key) => {
      const displayLabel =
        headerMapping[key] || key.charAt(0).toUpperCase() + key.slice(1);

      return (
        <div key={key} className="mt-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            {displayLabel}
          </label>
          <input
            type="text"
            className="border rounded w-full py-2 px-3 text-gray-700 bg-gray-100"
            value={data[key] || ""}
            readOnly
          />
        </div>
      );
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!csvData || csvData.length === 0) {
      toast.error("No CSV data loaded!");
      return;
    }

    setCurrentData(csvData[0]);
    setCurrentIndex(0);
    setShowModal(true);
  };

  const handleAcceptReject = async (isAccepted) => {
    console.log("currentDatafunction", currentData.company);

    const formData = {
      ...currentData,
      status: isAccepted ? "Accepted" : "Rejected",
    };
    console.log({ formData });

    const backenduploadData = {
      isin: currentData?.isin || "",
      dp_id: currentData?.dp_id || "",
      dp_name: currentData?.dp_name || "",
      drf: currentData?.drf || "",
      inward_no: currentData?.inward_no || "",
      count: currentData?.count || "",
      inward_date: currentData?.inward_date || "",
      nsdl_date: currentData?.nsdl_date || "",
      p_date: currentData?.p_date || "",
      status: currentData?.status || "",
    };

    console.log("backenduploadData:", backenduploadData);

    if (isAccepted) {
      try {
        const cleanedData = Object.fromEntries(
          Object.entries(backenduploadData).map(([key, value]) => [
            key,
            value === undefined ? null : value,
          ])
        );
        const response = await apiConnector(
          "POST",
          `${apiUrl}/v2/admin/actionHistory/save-remat-nsdl`,
          cleanedData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.status) {
          toast.success(response.data.result.message);
          setShowModal(false);
        } else {
          toast.error(response.data.result.message);
        }
      } catch (error) {
        const errMsg = error.response.data.message;
        toast.error(
          errMsg || "An error occurred while processing the request."
        );
        console.error(error);
      }
    } else {
      toast.error("This Data Rejected");
    }

    // Move to the next row or close the modal if the last row
    if (currentIndex + 1 < totalData) {
      setCurrentIndex(currentIndex + 1);
      setCurrentData(csvData[currentIndex + 1]);
    } else {
      setShowModal(false);
      setCsvData([]);
      setCsvHeaders({ originalHeaders: [], processedHeaders: [] });
      setCurrentIndex(0);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Upload NSDL Remat History</h2>
      </div>

      <div className="">
        <form id="add-isin" encType="multipart/form-data">
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-semibold mb-2"
              htmlFor="isin_csv"
            >
              Select File
              <span className="text-xs text-red-500 ml-2">
                only .CSV file allowed
              </span>
            </label>
            <input
              type="file"
              className="border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              id="remat-csv"
              name="remat-csv"
              accept=".csv"
              ref={fileInputRef}
              onChange={handleFileChange}
              required
            />
          </div>

          <div className="flex ">
            <button
              type="submit"
              className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleSubmit}
            >
              Submit &gt;&gt;
            </button>
          </div>
        </form>
      </div>

      {/* Confirm Data Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-medium">
                Confirm Data (Row {currentIndex + 1} of {totalData})
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setCsvData([]);
                  setCsvHeaders({ originalHeaders: [], processedHeaders: [] });
                  setCurrentIndex(0);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>

            <div className="mt-4 max-h-96 overflow-y-auto">
              {renderInputFields(currentData)}
            </div>

            <div className="mt-6 flex space-x-4 justify-center">
              <button
                className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
                onClick={() => handleAcceptReject(true)}
              >
                Accept
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={() => handleAcceptReject(false)}
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadRematNsdl;
