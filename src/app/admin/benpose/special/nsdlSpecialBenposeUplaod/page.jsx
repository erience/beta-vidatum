"use client";
import { apiConnector } from "@/utils/apihelper";
import { formatDMY } from "@/utils/helper";
import { useState } from "react";

const NsdlSpecialBenposeUplaod = () => {
  const [date, setDate] = useState("");
  const [files, setFiles] = useState([]);
  const [fileError, setFileError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const handleFileChange = (e) => {
    setFiles(e.target.files);
    setFileError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!date) {
      alert("Please select a Benpose Date.");
      return;
    }

    if (files.length === 0) {
      setFileError("Please upload at least one file.");
      return;
    }

    // Use your helper
    const formattedDate = formatDMY(date);

    const formData = new FormData();
    formData.append("date", formattedDate);
    Array.from(files).forEach((file) => {
      formData.append("files", file);
    });
    setIsSubmitting(true);
    try {
      const response = await apiConnector(
        "POST",
        `${apiUrl}/v2/admin/specialnsdl`,
        formData
      );

      if (response.data.status === true) {
        toast.success("File uploaded successfully");
        setDate("");
        setFiles([]);
      } else {
        toast.error("Failed to upload files.");
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      toast.error("An error occurred while uploading.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="max-w-6xl  p-4">
        {/* Title */}
        <h2 className="text-lg font-semibold mb-6">NSDL Benpose Upload</h2>

        {/* Top row: Benpose Date & File Upload */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Benpose Date */}
          <div className="w-full md:w-1/2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Benpose Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={date}
              onChange={handleDateChange}
              placeholder="dd-mm-yyyy"
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>

          {/* Upload Files */}
          <div className="w-full md:w-1/2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Files <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
            {fileError && (
              <p className="text-red-500 text-sm mt-1">{fileError}</p>
            )}
            <p className="text-gray-500 text-xs mt-1">
              Only files with "RT02" in the name are allowed (e.g.,
              08RT02UX.15112024).
            </p>
          </div>
        </div>

        {/* Submit Button below aligned left */}
        <div className="mt-6">
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

export default NsdlSpecialBenposeUplaod;
