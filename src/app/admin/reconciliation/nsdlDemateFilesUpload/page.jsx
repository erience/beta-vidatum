"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { apiConnector } from "@/utils/apihelper"; // Assume this is a custom helper function for API calls

const NsdlDemateFilesUpload = () => {
  const [files, setFiles] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Handle file changes for CDSL Demat Upload
  const handleFileChange = (e) => {
    const selectedFiles = e.target.files;
    const validExtension = /\.txt$/;
    let isValid = true;
    let errorMessage = "";
    const invalidFiles = [];

    for (let i = 0; i < selectedFiles.length; i++) {
      const fileName = selectedFiles[i].name;
      if (!validExtension.test(fileName)) {
        isValid = false;
        invalidFiles.push(fileName);
        errorMessage = "Please upload only .txt files.";
      }
    }

    if (!isValid) {
      setErrorMessage(errorMessage);
      setFiles(null);
      toast.error(errorMessage);
    } else {
      setErrorMessage("");
      setFiles(selectedFiles);
    }
  };

  // Handle form submission for CDSL Demat Upload
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!files || files.length === 0) {
      toast.error("Please upload valid .txt files.");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("dematnsdl", files[i]);
    }

    try {
      const response = await apiConnector(
        "POST",
        `${apiUrl}/v2/admin/actionHistory/save-demat-nsdl`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setIsSubmitting(false);
      const { message, status } = response.data.result;
      if (status) {
        toast.success(message);
      } else {
        toast.error(message);
      }
    } catch (error) {
      const errMsg = error.response.data.message;
      toast.error(errMsg || "An error occurred while processing the request.");
      setIsSubmitting(false);
    }
  };

  //---------------------------handle NSDL Scrape Files----------------------------
  const handleScrapeFileChange = (e) => {
    const selectedFiles = e.target.files;
    let errorMessage = "";
    let isValid = true;

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const fileName = file.name;
      const fileType = file.type;
      const fileSize = file.size;

      // Validate file type (CSV or JSON)
      if (fileType !== "text/csv" && fileType !== "application/json") {
        errorMessage = "Only CSV and JSON files are allowed.";
        isValid = false;
        break;
      }

      // Validate file size (5 MB limit)
      if (fileSize > 5 * 1024 * 1024) {
        errorMessage = "File size must be less than 5 MB.";
        isValid = false;
        break;
      }
    }

    if (!isValid) {
      setErrorMessage(errorMessage);
      setFiles(null);
    } else {
      setErrorMessage("");
      setFiles(selectedFiles);
    }
  };

  //-----------------------------NSDL Scrape------------------------------
  const handleCdslScrape = async (e) => {
    e.preventDefault();
    if (!files || files.length === 0) {
      toast.error("Please upload a valid file");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("dematnsdlscrape", files[0]);

    try {
      const response = await apiConnector(
        "POST",
        `${apiUrl}/v2/admin/actionHistory/save-demat-nsdl-scrape`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setIsSubmitting(false);
      const { message, status } = response.data.result;
      if (status) {
        toast.success(message);
      } else {
        toast.error(message);
      }
    } catch (error) {
      const errMsg = error.response.data.message;
      toast.error(errMsg || "An error occurred while processing the request.");
      setIsSubmitting(false);
    }
  };

  //-----------------------------NSDL Scrape All------------------------------
  const handleCdslScrapeAll = async (e) => {
    e.preventDefault();
    if (!files || files.length === 0) {
      toast.error("Please upload a valid file");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("dematnsdlscrape", files[0]);

    try {
      const response = await apiConnector(
        "POST",
        `${apiUrl}/v2/admin/actionHistory/save-demat-nsdl-scrape-v2`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setIsSubmitting(false);
      const { message, status } = response.data.result;
      if (status) {
        toast.success(message);
      } else {
        toast.error(message);
      }
    } catch (error) {
      const errMsg = error.response.data.message;
      toast.error(errMsg || "An error occurred while processing the request.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 flex flex-col space-y-8">
      <div className="">
        <h4 className="text-2xl font-bold text-gray-800 mb-6">Demat History</h4>

        {/* CDSL Demat Upload */}
        <div className="bg-gray-50 p-6 rounded-md shadow-sm">
          <h5 className="text-lg font-semibold text-gray-700 mb-4">
            NSDL Demat Upload
          </h5>
          <form onSubmit={handleSubmit}>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Demat CDSL File
            </label>
            <input
              type="file"
              name="dematnsdl"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleFileChange}
              required
              multiple
            />
            {errorMessage && (
              <p className="text-red-500 mt-2">{errorMessage}</p>
            )}
            <button
              type="submit"
              className={`mt-4 flex bg-gray-900 hover:bg-gray-600 text-white px-5 py-2 rounded-md font-medium shadow-sm transition ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isSubmitting}
            >
              Submit
            </button>
          </form>
        </div>

        {/* NSDL Demat Scrape Upload */}
        <div className="bg-gray-50 p-6 rounded-md shadow-sm mt-8">
          <h5 className="text-lg font-semibold text-gray-700 mb-4">
            NSDL Demat Scrape Upload
          </h5>
          <form onSubmit={handleCdslScrape}>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Demat NSDL Scrape File
            </label>
            <input
              type="file"
              name="dematnsdlscrape"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleScrapeFileChange}
              required
              multiple
            />
            <button
              type="submit"
              className={`mt-4 flex bg-gray-900 hover:bg-gray-600 text-white px-5 py-2 rounded-md font-medium shadow-sm transition ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isSubmitting}
            >
              NSDL Scrape
            </button>
          </form>
        </div>

        {/* NSDL Demat Scrape All */}
        <div className="bg-gray-50 p-6 rounded-md shadow-sm mt-8">
          <h5 className="text-lg font-semibold text-gray-700 mb-4">
            NSDL Demat Scrape All
          </h5>
          <form onSubmit={handleCdslScrapeAll}>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Demat NSDL Scrape All File
            </label>
            <input
              type="file"
              name="dematnsdlscrape"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleScrapeFileChange}
              required
              multiple
            />
            <button
              type="submit"
              className={`mt-4 flex bg-gray-900 hover:bg-gray-600 text-white px-5 py-2 rounded-md font-medium shadow-sm transition ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isSubmitting}
            >
              NSDL Scrape All
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NsdlDemateFilesUpload;
