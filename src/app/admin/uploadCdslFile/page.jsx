"use client";
import { useState } from "react";
import { apiConnector } from "@/utils/apihelper";
import { toast } from "react-toastify";

const UploadNsdlFile = () => {
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [counts, setCounts] = useState({
    updateCount: 0,
    insertCount: 0,
    existingCount: 0,
  });
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile && !selectedFile.name.endsWith(".txt")) {
      toast.error("Only .txt files are allowed.");
      setFile(null);
    } else {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please upload a .txt file.");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("isin", file);

    try {
      const response = await apiConnector(
        "POST",
        `${apiUrl}/v2/admin/getisincdslupload `,
        formData,
        {
          timeout: 10 * 60 * 1000,
        }
    );
    console.log({response})

      // Destructure counts and message from your response data
      const { updateCount = 0, insertCount = 0, existingCount = 0, message, status } = response.data.result;

      // Update the state with counts
      setCounts({ updateCount, insertCount, existingCount });

      status ? toast.success(message) : toast.error(message);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "An error occurred while uploading."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h5 className="text-xl font-semibold">CDSL ISIN File Upload</h5>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-medium mb-2" htmlFor="isinFile">
            Upload .txt File
          </label>
          <input
            type="file"
            accept=".txt"
            id="isinFile"
            name="isin"
            onChange={handleFileChange}
            required
            className="border p-2 rounded"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
        >
          {isSubmitting ? "Uploading..." : "Submit"}
        </button>
      </form>

      {(counts.updateCount || counts.insertCount || counts.existingCount) > 0 && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <h6 className="font-semibold mb-2">Upload Summary</h6>
          <p>Updated Count: {counts.updateCount}</p>
          <p>Inserted Count: {counts.insertCount}</p>
          <p>Existing Count: {counts.existingCount}</p>
        </div>
      )}
    </div>
  );
};

export default UploadNsdlFile;
