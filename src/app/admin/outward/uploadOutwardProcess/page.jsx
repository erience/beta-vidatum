"use client";
import { apiConnector } from "@/utils/apihelper";
import { importCSV } from "@/utils/helper";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { useOutwardStore } from "../storage/store";

const UploadOutwardProcess = () => {
  const [refValue, setRefValue] = useState("");
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
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const handleRefChange = (e) => {
    setRefValue(e.target.value);
  };

  const searchOutward = async () => {
    if (!refValue.trim()) {
      toast.error("Please enter an Inward/Ref number.");
      return;
    }

    try {
      const { data } = await apiConnector(
        "GET",
        `${apiUrl}/v2/admin/process/outward/create_outward?ref=${encodeURIComponent(
          refValue
        )}`
      );

      if (data?.status === true) {
        const apiRecord = data.result.data;
        const { setPayload } = useOutwardStore.getState();
        setPayload(apiRecord);
        const apiPageLink = data.result.pagelink;

        const routeMap = {
          "process/outward/create_outward": "/outward/createOutward",
          "process/outward/edit_outward": "/outward/editOutward",
        };

        const matchedRoute = routeMap[apiPageLink];
        if (!matchedRoute) {
          toast.error("Page route not supported.");
          return;
        }

        router.push(`${matchedRoute}/${encodeURIComponent(refValue)}`);
      } else {
        toast.error(data.result?.message || "Inward number not found");
      }
    } catch (error) {
      console.error("Fetching Data error:", error);
      toast.error(
        error.response?.data?.message ||
          "An unexpected error occurred. Please try again."
      );
    }
  };

  // Handle CSV file upload
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
      console.log({ result: result.entries });
      setCsvData(result.entries);
      setCurrentData(result.entries[0]);

      toast.success("CSV loaded successfully. Click submit to proceed.");
    } catch (error) {
      toast.error("Error reading file: " + error.message);
      console.error(error);
    }
  };

  // Render form inputs for each field in the current data
  const renderInputFields = (data) => {
    if (!data) return null;

    const headerMap = csvHeaders.processedHeaders.reduce((map, hdr, i) => {
      map[hdr] = csvHeaders.originalHeaders[i];
      return map;
    }, {});

    return Object.entries(data).map(([key, val]) => {
      const label =
        headerMap[key] || key.charAt(0).toUpperCase() + key.slice(1);
      return (
        <div key={key} className="mt-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            {label}
          </label>
          <input
            type="text"
            name={key}
            id={key}
            className="border rounded w-full py-2 px-3 text-gray-700 bg-gray-100"
            value={val || ""}
            readOnly
          />
        </div>
      );
    });
  };

  //--------------------handle submit---------------------------
  const handleSubmit = (e) => {
    e.preventDefault();
    if (csvData.length === 0) {
      toast.error("No CSV data loaded!");
      return;
    }
    setCurrentIndex(0);
    console.log(csvData[0]);
    setCurrentData(csvData[0]);
    setShowModal(true);
  };

  // Equivalent of saveCsvData function from EJS
  const saveCsvData = async (dataId) => {
    console.log({ currentIndex });
    if (currentIndex < totalData && csvData[currentIndex]) {
      if (dataId === 1) {
        const formData = {
          inward_ref: currentData?.inwardref || "",
          mode: currentData?.mode || "",
          o_date: currentData?.outwarddate || "",
          d_date: currentData?.deliverydate || "",
          agency: currentData?.agency || "",
          awb: currentData?.trackid || "",
          remarks: currentData?.remarks || "",
          status: currentData.status || "Active",
        };

        try {
          const res = await apiConnector(
            "POST",
            `${apiUrl}/v2/admin/process/outward/create_outward`,
            formData
          );
          toast[res.data.status ? "success" : "error"](
            res.data.result?.message
          );
          handleNextRecord();
        } catch (err) {
          const msg =
            err.response?.data?.message ||
            "An error occurred while processing the request.";
          toast.error(msg);
          console.error(err);
        }
      } else {
        toast.error("This data has been rejected.");
        handleNextRecord();
      }
    } else {
      setShowModal(false);
      resetForm();
    }
  };

  // Move to next record or close modal
  const handleNextRecord = () => {
    const next = currentIndex + 1;
    if (next < totalData) {
      setCurrentIndex(next);
      setCurrentData(csvData[next]);
    } else {
      setShowModal(false);
      resetForm();
    }
  };

  // Reset form state
  const resetForm = () => {
    setCsvData([]);
    setCurrentIndex(0);
    setCurrentData({});
    fileInputRef.current && (fileInputRef.current.value = "");
  };

  return (
    <>
      <div className="space-y-8">
        {/* Create Outward Card */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 ">
            <h4 className="text-lg font-semibold text-gray-800">
              Create Outward By Inward No.
            </h4>
          </div>
          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                placeholder="Inward ID / Ref No / Outward No"
                value={refValue}
                onChange={handleRefChange}
                className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={searchOutward}
                className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-500 transition"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Upload Files Card */}
        <div className="bg-white rounded-lg shadow-md ">
          <div className="px-6 py-4 ">
            <h4 className="text-lg font-semibold text-gray-800">
              Upload Files
            </h4>
            <p className="text-sm text-red-500 mt-1">Only .CSV file allowed</p>
          </div>
          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <input
                type="file"
                accept=".csv"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="border border-gray-300 rounded-md px-4 py-2 w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-500  transition"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-start justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">
            <div className="flex justify-between items-center border-b px-6 py-3">
              <h3 className="text-lg font-medium">
                Confirm Data (Row {currentIndex + 1} of {totalData})
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>

            <div className="px-6 py-4 max-h-80 overflow-y-auto">
              {renderInputFields(currentData)}
            </div>

            <div className="flex justify-end space-x-4 px-6 py-4 border-t">
              <button
                onClick={() => saveCsvData(2)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Reject
              </button>
              <button
                onClick={() => saveCsvData(1)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UploadOutwardProcess;
