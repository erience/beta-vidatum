"use client";
import { apiConnector } from "@/utils/apihelper";
import { useState } from "react";
import { toast } from "react-toastify";

const CheckPreAllotmentHolding = () => {
  const [file, setFile] = useState("");
  const [fileError, setFileError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  //--------------------------handle onchange for file--------------------------------
  const handleFileChange = (e) => {
    setFile(e.target.files);
    setFileError("");
  };

  //------------------------------upload file----------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setFileError("Please select a file.");
      return;
    }

    const allowedExtensions = /(\.csv)$/i;
    if (!allowedExtensions.exec(file.name)) {
      setFileError("Invalid file type. Please upload a .csv file.");
      return;
    }
    // if (file.type !== "text/csv") {
    //     setFileError("Invalid file type. Please upload a .csv file.");
    //     return;
    //   }
    const formData = new FormData();
    formData.append("preferential_share_holding", file);
    setIsSubmitting(true);
    setFileError("");
    try {
      const responseData = await apiConnector(
        "POST",
        `${apiUrl}/v2/admin/benpos/checkPreferentialShareHolding`,
        formData
      );
      if (responseData.data.status == true) {
        toast.success(responseData.data.mesasge || "Upload File Successfully");
      } else {
        toast.error(responseData.data.mesasge || "Error uploading file");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="max-w-4xl p-2">
        <h2 className="text-lg font-semibold mb-6">
          Upload Preferential Allotnment File
        </h2>

        {/* File input row */}
        <div className="mb-4">
          <label
            htmlFor="checkPreferentialShareHolding"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Select File <span className="text-red-500">*</span>
            <small className="ml-1 text-red-500 font-normal">
              only .CSV file allowed
            </small>
          </label>

          <input
            type="file"
            name="preferential_share_holding"
            id="checkPreferentialShareHolding"
            accept=".csv"
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
            onChange={handleFileChange}
          />

          {fileError && (
            <p className="text-red-500 text-sm mt-1">{fileError}</p>
          )}
        </div>

        {/* Submit button */}
        <div>
          <button
            type="submit"
            className="bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Uploading..." : "Submit"}
          </button>
        </div>
      </form>
    </>
  );
};

export default CheckPreAllotmentHolding;
