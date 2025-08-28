"use client";
import { useState } from "react";
import moment from "moment";
import { apiConnector } from "@/utils/apihelper";
import { toast } from "react-toastify";

const AddDemateFile = () => {
  const [formData, setFormData] = useState({
    isin: "",
    fromdate: "",
    todate: "",
    type: "1",
  });
  const [loading, setLoading] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // post and get JSON response with a `result` string
      const { data } = await apiConnector(
        "POST",
        `${apiUrl}/v2/admin/process/inward/demat-file`,
        formData
      );
      if (!data.status || !data.result) {
        throw new Error("No data returned");
      }

      // 1. grab the text
      const text = data.result;

      // 2. generate timestamped filename
      const timestamp = moment().format("YYYYMMDD_HHmmss");
      const fileName = `IN200947_DEMAT_${timestamp}.txt`;

      // 3. build a Blob and trigger download
      const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("File downloaded!");
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message;
      toast.error(errMsg || "Error downloading file");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* <div className="page-header">
        <h5 className="mb-2">Demat File</h5>
      </div> */}

      <div className="card">
        <div className="card-header font-semibold text-lg">
          Download Demat by ISIN
        </div>
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-6">
              {/* ISIN */}
              <div className="w-full mb-4">
                <label className="block text-sm mb-1">Please Enter ISIN</label>
                <input
                  type="text"
                  name="isin"
                  className="form-control block w-full border border-gray-300 rounded px-3 py-2"
                  required
                  value={formData.isin}
                  onChange={handleChange}
                />
              </div>

              {/* From Date */}
              <div className="w-full mb-4">
                <label className="block text-sm mb-1" htmlFor="fromdate">
                  Choose a From Date:
                </label>
                <input
                  type="date"
                  name="fromdate"
                  id="fromdate"
                  className="form-control block w-full border border-gray-300 rounded px-3 py-2"
                  value={formData.fromdate}
                  onChange={handleChange}
                />
              </div>

              {/* To Date */}
              <div className="w-full mb-4">
                <label className="block text-sm mb-1" htmlFor="todate">
                  Choose a To Date:
                </label>
                <input
                  type="date"
                  name="todate"
                  id="todate"
                  className="form-control block w-full border border-gray-300 rounded px-3 py-2"
                  required
                  value={formData.todate}
                  onChange={handleChange}
                />
              </div>

              {/* DP Type */}
              <div className="w-full mb-4">
                <label className="block text-sm mb-1" htmlFor="type">
                  Choose DP:
                </label>
                <select
                  name="type"
                  id="type"
                  className="form-control block w-full border border-gray-300 rounded px-3 py-2"
                  value={formData.type}
                  onChange={handleChange}
                >
                  <option value="1">NSDL</option>
                  <option value="2">CDSL</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`btn btn-dark text-white px-4 py-2 rounded ${
                loading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-gray-800 hover:bg-gray-900"
              }`}
            >
              {loading ? "Downloading..." : "Download"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddDemateFile;
