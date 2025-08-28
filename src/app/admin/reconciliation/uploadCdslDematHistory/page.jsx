"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import { apiConnector } from "@/utils/apihelper";

const UploadCdslDematHistory = () => {
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const handleFileChange = (e) => {
    const files = e.target.files;
    const validFilePattern = /^.{2}RT21.*$/;
    let isValid = true;
    let errorMessage = "";

    for (let i = 0; i < files.length; i++) {
      const fileName = files[i].name;
      if (!validFilePattern.test(fileName)) {
        isValid = false;
        errorMessage =
          'Please upload files that contain "RT21" in their name (e.g., 16RT21UINCREMENTAL).';
        toast.error(errorMessage);
        break;
      }
    }

    if (!isValid) {
      setErrorMessage(errorMessage);
      setFile(null);
    } else {
      setErrorMessage("");
      setFile(files);
    }
  };

  const handleScrapeFileChange = (e) => {
    const files = e.target.files;
    let isValid = true;
    let errorMessage = "";

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type !== "text/csv" && file.type !== "application/json") {
        errorMessage = "Only CSV and JSON files are allowed.";
        isValid = false;
        break;
      }

      if (file.size > 5 * 1024 * 1024) {
        errorMessage = "File size must be less than 5 MB.";
        isValid = false;
        break;
      }
    }

    if (!isValid) {
      setErrorMessage(errorMessage);
      setFile(null);
    } else {
      setErrorMessage("");
      setFile(files);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || file.length === 0) {
      toast.error("Please upload a valid file");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("dematcdsl", file[0]);

    try {
      const response = await apiConnector(
        "POST",
        `${apiUrl}/v2/admin/actionHistory/save-demat-cdsl`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const { message, status } = response.data.result;
      toast[status ? "success" : "error"](message);
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCdslScrape = async (e) => {
    e.preventDefault();
    if (!file || file.length === 0) {
      toast.error("Please upload a valid file");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("dematcdslscrape", file[0]);

    try {
      const response = await apiConnector(
        "POST",
        `${apiUrl}/v2/admin/actionHistory/save-demat-cdsl-scrape`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const { message, status } = response.data.result;
      toast[status ? "success" : "error"](message);
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCdslScrapeAll = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please upload a valid file");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("dematcdslscrape", file[0]);

    try {
      const response = await apiConnector(
        "POST",
        `${apiUrl}/v2/admin/actionHistory/save-demat-cdsl-scrape-v2`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const { message, status } = response.data.result;
      toast[status ? "success" : "error"](message);
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen  p-8">
      <div className="max-w-3xl ">
        {/* Page Title */}
        <h4 className="text-2xl font-bold text-gray-800 mb-6">Demat History</h4>

        {/* --- CDSL Demat Upload --- */}
        <div className="bg-white rounded-md shadow-md p-6 mb-6">
          <h5 className="text-lg font-semibold text-gray-700 mb-4">
            CDSL Demat Upload
          </h5>
          <form onSubmit={handleSubmit}>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Demat CDSL File
            </label>
            <input
              type="file"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleFileChange}
              required
              multiple
            />
            <button
              type="submit"
              className={`mt-4 bg-gray-900 hover:bg-gray-600 text-white px-5 py-2 rounded-md font-medium shadow-sm transition ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isSubmitting}
            >
              Submit
            </button>
          </form>
        </div>

        {/* --- CDSL Demat Scrape Upload --- */}
        <div className="bg-white rounded-md shadow-md p-6 mb-6">
          <h5 className="text-lg font-semibold text-gray-700 mb-4">
            CDSL Demat Scrape Upload
          </h5>
          <form onSubmit={handleCdslScrape}>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Demat CDSL Scrape File
            </label>
            <input
              type="file"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleScrapeFileChange}
              required
              multiple
            />
            <button
              type="submit"
              className={`mt-4 bg-gray-900 hover:bg-gray-600 text-white px-5 py-2 rounded-md font-medium shadow-sm transition ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isSubmitting}
            >
              CDSL Scrape
            </button>
          </form>
        </div>

        {/* --- CDSL Demat Scrape All --- */}
        <div className="bg-white rounded-md shadow-md p-6">
          <h5 className="text-lg font-semibold text-gray-700 mb-4">
            CDSL Demat Scrape All
          </h5>
          <form onSubmit={handleCdslScrapeAll}>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Demat CDSL Scrape All File
            </label>
            <input
              type="file"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleScrapeFileChange}
              required
              multiple
            />
            <button
              type="submit"
              className={`mt-4 bg-gray-900 hover:bg-gray-600 text-white px-5 py-2 rounded-md font-medium shadow-sm transition ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isSubmitting}
            >
              CDSL Scrape All
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadCdslDematHistory;
