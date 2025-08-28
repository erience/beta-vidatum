"use client";
import { apiConnector } from "@/utils/apihelper";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const AddIdt = () => {
  const [files, setFiles] = useState([]);
  const [fileNotUploaded, setFileNotUploaded] = useState([]);
  const [fileUploaded, setFileUploaded] = useState([]);
  const [sameIsinNotUploaded, setSameIsinNotUploaded] = useState([]);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    files.forEach((file) => formData.append("idt", file));

    try {
      const responseData = await apiConnector(
        "POST",
        `${apiUrl}/v2/admin/reconcillation/add_idt`,
        formData
      );
      const response = responseData.data.result;
      const {
        filenotu = [],
        fileUploaded: uploaded = [],
        sameIsinNotUploaded: dupes = [],
      } = response;

      setFileNotUploaded(filenotu);
      setFileUploaded(uploaded);
      setSameIsinNotUploaded(dupes);

      toast.success("File uploaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Error occurred while uploading the file.");
    }
  };

  useEffect(() => {
    console.log({ fileNotUploaded });
    console.log({ fileUploaded });
    console.log({ sameIsinNotUploaded });
  }, [sameIsinNotUploaded, fileUploaded, fileNotUploaded]);

  return (
    <div className="max-w-3xl p-6">
      <h4 className="text-xl font-semibold mb-6">Upload IDT Files</h4>

      {/* File list preview */}
      <ul className="mb-4 space-y-2 bg-gray-50 p-4 rounded border border-gray-200">
        <li className="text-gray-700 font-medium">
          After uploading, you’ll see per-file alerts below.
        </li>
        {files.map((file, i) => (
          <li key={i} className="text-sm text-gray-600">
            📄 {file.name}
          </li>
        ))}
      </ul>

      {/* Alerts */}
      <div className="space-y-3 mb-6">
        {fileNotUploaded.map((d, idx) => (
          <div
            key={`not-${idx}`}
            className="p-4 bg-yellow-100 text-yellow-800 rounded border border-yellow-300"
          >
            ⚠️ This date file <strong>{d.uploadDate}</strong> and number{" "}
            <strong>{d.number}</strong> was <em>not</em> uploaded — already in
            DB.
          </div>
        ))}

        {fileUploaded.map((d, idx) => (
          <div
            key={`up-${idx}`}
            className="p-4 bg-green-100 text-green-800 rounded border border-green-300"
          >
            ✅ This date file <strong>{d.uploadDate}</strong> and number{" "}
            <strong>{d.number}</strong> uploaded successfully.
          </div>
        ))}

        {sameIsinNotUploaded.map((d, idx) => (
          <div
            key={`dup-${idx}`}
            className="p-4 bg-blue-100 text-blue-800 rounded border border-blue-300"
          >
            ℹ️ This date file <strong>{d.uploadDate}</strong> and number{" "}
            <strong>{d.number}</strong>’s ISIN (<code>{d.isinValue}</code>) had
            duplicates so only one record was uploaded.
          </div>
        ))}
      </div>

      {/* Upload form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="dematcdsl"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Upload IDT File <span className="text-red-500">*</span>
          </label>
          <input
            id="dematcdsl"
            type="file"
            multiple
            required
            onChange={handleFileChange}
            className="block w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="bg-gray-900 text-white text-sm font-medium px-5 py-2 rounded hover:bg-gray-800 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddIdt;
