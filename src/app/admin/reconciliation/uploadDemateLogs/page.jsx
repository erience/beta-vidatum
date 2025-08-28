"use client";
import { apiConnector } from "@/utils/apihelper";
import axios from "axios";
import { useState } from "react";

const UploadDemateLogs = () => {
  const [file, setFile] = useState(null);
  const [uploadResult, setUploadResult] = useState({
    type: null,
    message: "",
    errorArray: [],
    dpExists: [],
    details: [],
  });

  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setUploadResult({
        type: "danger",
        message: "Please select a CSV file.",
        errorArray: [],
        dpExists: [],
        details: [],
      });
      return;
    }

    const formData = new FormData();
    formData.append("demat_log_csv", file);

    try {
      const { data: resp } = await apiConnector(
        "POST",
        `${apiUrl}/v2/admin/reconcillation/upload-demat-log`,
        formData
      );

      const success = Boolean(resp.status);
      setUploadResult({
        type: success ? "success" : "danger",
        message: resp.result?.message || resp.message || "",
        errorArray: resp.result?.errorArray || [],
        dpExists: resp.result?.dp_id_Already_exist || [],
        details: !success && resp.data?.length ? resp.data : [],
      });

      if (success) {
        toast.success(resp.result?.message || "Upload successful!");
        // reset file input
        setFile(null);
        e.target.reset();
      }
    } catch (err) {
      setUploadResult({
        type: "danger",
        message: `Upload failed: ${err.message}`,
        errorArray: [],
        dpExists: [],
        details: [],
      });
      toast.error(`Upload failed: ${err.message}`);
    }
  };

  return (
    <div className="container mt-4">
      {uploadResult.type && (
        <div className={`alert alert-${uploadResult.type}`} role="alert">
          <p>{uploadResult.message}</p>
          {(uploadResult.errorArray.length ||
            uploadResult.dpExists.length ||
            uploadResult.details.length) > 0 && (
            <ul className="list-group list-group-flush">
              {uploadResult.errorArray.map((err, i) => (
                <li key={i} className="list-group-item">
                  {err.error}, ref {err.drn}, row {err.index}
                </li>
              ))}
              {uploadResult.dpExists.map((dup, i) => (
                <li key={i} className="list-group-item">
                  {dup.message}
                </li>
              ))}
              {uploadResult.details.map((d, i) => (
                <li key={i} className="list-group-item">
                  {d.error} and Inward Number is {d.inward_id}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="page-title-box mb-3">
        <h4 className="text-lg font-semibold mb-6">
          Upload Demat Log File (Reconciliation)
        </h4>
      </div>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-4">
          <label
            htmlFor="demat_log_csv"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Select File{" "}
            <span className="text-red-600 text-xs font-normal">
              (only .CSV file allowed)
            </span>
          </label>

          <input
            type="file"
            id="demat_log_csv"
            name="demat_log_csv"
            accept=".csv"
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
            onChange={handleFileChange}
          />
        </div>

        <div>
          <button
            type="submit"
            className="bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-700"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadDemateLogs;
