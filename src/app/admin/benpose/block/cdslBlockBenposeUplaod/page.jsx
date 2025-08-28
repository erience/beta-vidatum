"use client";
import { apiConnector } from "@/utils/apihelper";
import { useState, useRef } from "react";

const CdslBlockBenposeUplaod = () => {
  const [files, setFiles] = useState([]);
  const [fileError, setFileError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const handleFileChange = (e) => {
    setFiles(e.target.files);
    setFileError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (files.length === 0) {
      setFileError("Please upload at least one file.");
      return;
    }

    const invalidFiles = Array.from(files).filter(
      (file) => !file.name.includes("RT02")
    );

    if (invalidFiles.length > 0) {
      setFileError('Only files with "RT02" in the name are allowed.');
      return;
    }

    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append("files", file);
    });
    console.log({ formData });

    setIsSubmitting(true);

    try {
      const response = await apiConnector(
        "POST",
        `${apiUrl}/v2/admin/benpose/saveblockcdslbenpose`,
        formData
      );

      if (response.data.status === true) {
        toast.success("File uploaded successfully!");
        setFiles([]);
        // if (fileInputRef.current) {
        //   fileInputRef.current.value = "";
        // }
      } else {
        toast.error(response.data.message || "Failed to upload files.");
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
      <form onSubmit={handleSubmit} className="max-w-4xl p-2">
        <h2 className="text-lg font-semibold mb-6">
          Block CDSL Benpose Upload
        </h2>

        {/* File input + note vertically stacked */}
        <div className="mb-6">
          <label
            htmlFor="fileInput"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Upload Files <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            name="files"
            id="fileInput"
            multiple
            onChange={handleFileChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
          {fileError && (
            <p className="text-red-500 text-sm mt-1">{fileError}</p>
          )}
          <p className="text-gray-500 text-sm mt-2">
            Only files with <strong>"RT02"</strong> in the name are allowed
            (e.g., <em>08RT02UX.15112024</em>).
          </p>
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

export default CdslBlockBenposeUplaod;
