"use client";
import { apiConnector } from "@/utils/apihelper";
import { formatDMY, formatYMD } from "@/utils/helper";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const EditSpecialBenpos = () => {
  const router = useRouter();
  const { id } = useParams();
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [allIsin, setAllIsin] = useState([]);
  const [formData, setFormData] = useState({
    id: id,
    date: "",
    isin: "",
    cdsl: "1",
    nsdl: "1",
    demat: "1",
    physical: "1",
    status: "1",
    remarks: "",
  });

  const fetchBenposeData = async () => {
    try {
      const response = await apiConnector(
        "GET",
        `${apiUrl}/v2/admin/benpose/special/edit/${id}`
      );
      const result = response.data.data || {};

      setAllIsin(result?.isins || []);

      setFormData({
        id: id,
        date: formatYMD(result.date),
        isin: result.isin || "",
        cdsl: result.cdsl?.toString() || "1",
        nsdl: result.nsdl?.toString() || "1",
        demat: result.demat?.toString() || "1",
        physical: result.physical?.toString() || "1",
        status: result.status?.toString() || "1",
        remarks: result.remarks || "",
      });
    } catch (error) {
      console.error("Fetching Data Error", error);
    }
  };

  useEffect(() => {
    fetchBenposeData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const submitData = { ...formData, id: formData.id.toString() };
      submitData.date = formatDMY(submitData.date);

      const responseData = await apiConnector(
        "POST",
        `${apiUrl}/v2/admin/benpose/special_edit_benpose_index`,
        submitData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (responseData.data.status === true) {
        toast.success(
          responseData.data.message || "Record updated successfully"
        );
        router.push("/benpose/special/specialBenposeList");
      } else {
        toast.error(responseData.data.message || "Record could not be updated");
      }
    } catch (error) {
      console.error("Posting data error", error);
      toast.error("An error occurred while updating the record");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">Edit Special Benpose Record</h1>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="mb-4">
          <div className="bg-red-100 text-red-800 p-4 rounded-lg">
            <ul>
              <li>Edit Special Benpose Record</li>
            </ul>
          </div>
        </div>

        <form>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date Field */}
            <div>
              <label className="block text-gray-700 mb-2">
                Benpose Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="date"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            {/* ISIN Dropdown */}
            <div>
              <label className="block text-gray-700 mb-2">
                Select ISIN <span className="text-red-500">*</span>
              </label>
              <select
                name="isin"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.isin}
                onChange={handleChange}
                required
              >
                <option value="">Select ISIN</option>
                {allIsin.length > 0 ? (
                  allIsin.map((item, index) => (
                    <option key={index} value={typeof item === "object" ? item.isin : item}>
                      {typeof item === "object" ? item.isin : item}
                    </option>
                  ))
                ) : (
                  <option disabled>No ISINs available</option>
                )}
              </select>
            </div>

            {/* CDSL, NSDL, Demat, Physical */}
            {["cdsl", "nsdl", "demat", "physical"].map((field) => (
              <div key={field}>
                <label className="block text-gray-700 mb-2 capitalize">
                  {field.toUpperCase()} <span className="text-red-500">*</span>
                </label>
                <select
                  name={field}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData[field]}
                  onChange={handleChange}
                  required
                >
                  <option value="1">Yes</option>
                  <option value="2">No</option>
                </select>
              </div>
            ))}

            {/* Status */}
            <div>
              <label className="block text-gray-700 mb-2">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                name="status"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="1">Active</option>
                <option value="2">Inactive</option>
                <option value="3">Delete</option>
              </select>
            </div>

            {/* Remarks */}
            <div className="col-span-2">
              <label className="block text-gray-700 mb-2">Remarks</label>
              <textarea
                name="remarks"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.remarks}
                onChange={handleChange}
                rows="4"
              />
            </div>

            {/* Submit Button */}
            <div className="col-span-2 text-center">
              <button
                type="button"
                className="w-full md:w-auto px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSpecialBenpos;
