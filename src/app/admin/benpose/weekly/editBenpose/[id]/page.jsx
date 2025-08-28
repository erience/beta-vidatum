"use client";
import { apiConnector } from "@/utils/apihelper";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const EditBenpose = () => {
  const params = useParams();
  const id = params.id;
  const [data, setData] = useState({});
  const [formData, setFormData] = useState({
    id: id,
    date: "",
    demat: "1",
    physical: "1",
    change: "1",
    status: "1",
    remarks: "",
  });
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const fetchBenposeData = async () => {
    try {
      const responseData = await apiConnector(
        "GET",
        `${apiUrl}/v2/admin/benpose/edit-benpose/${id}`
      );
      const result = responseData.data.data || {};
      const parts = result.date?.split("-") || [];
      const formattedDate =
        parts.length === 3 ? `${parts[0]}-${parts[1]}-${parts[2]}` : "";

      setFormData({
        id: id,
        date: formattedDate,
        demat: result?.demat !== undefined ? result.demat.toString() : "1",
        physical:
          result?.physical !== undefined ? result.physical.toString() : "1",
        change: result?.change !== undefined ? result.change.toString() : "1",
        status: result?.status !== undefined ? result.status.toString() : "1",
        remarks: result?.remarks !== undefined ? result.remarks.toString() : "",
      });

      setData(result);
    } catch (error) {
      console.error("Fetching Data Error", error);
    }
  };

  useEffect(() => {
    fetchBenposeData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const responseData = await apiConnector(
        "POST",
        `${apiUrl}/v2/admin/benpose/edit_benpose_index`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log({ responseData });
      if (responseData.data.status === true) {
        toast.success(
          responseData.data.message || "Record updated successfully"
        );
        router.push("/benpose/weekly/benposeList");
      } else {
        toast.error("Record cannot update");
      }
    } catch (error) {
      console.error("Posting data error", error);
    }
  };

  return (
    <div className="w-full px-4 py-6">
      <div className="mb-6">
        <h4 className="text-xl font-semibold">Benpose Index Edit</h4>
      </div>

      <div className="bg-white border border-red-300 text-red-700 p-4 mb-6 rounded">
        <ul className="list-disc list-inside">
          <li>Edit Benpose</li>
        </ul>
      </div>

      <form>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Benpose Date */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Benpose Date <span className="text-red-600">*</span>
            </label>
            <input
              type="date"
              name="date"
              id="bdate"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          {/* Demat Records */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Demat Records <span className="text-red-600">*</span>
            </label>
            <select
              name="demat"
              id="demat"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.demat}
              onChange={handleChange}
              required
            >
              <option value="1">Yes</option>
              <option value="2">No</option>
            </select>
          </div>

          {/* Physical Records */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Physical Records <span className="text-red-600">*</span>
            </label>
            <select
              name="physical"
              id="physical"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.physical}
              onChange={handleChange}
              required
            >
              <option value="1">Yes</option>
              <option value="2">No</option>
            </select>
          </div>

          {/* Change Records */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Change Records <span className="text-red-600">*</span>
            </label>
            <select
              name="change"
              id="change"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.change}
              onChange={handleChange}
              required
            >
              <option value="1">Yes</option>
              <option value="2">No</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Status <span className="text-red-600">*</span>
            </label>
            <select
              name="status"
              id="bstatus"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="1">Active</option>
              <option value="2">InActive</option>
              <option value="3">Delete</option>
            </select>
          </div>

          {/* Remarks */}
          <div className="md:col-span-2">
            <label className="block font-medium text-gray-700 mb-1">
              Remarks
            </label>
            <textarea
              name="remarks"
              id="remarks"
              className="w-full border border-gray-300 rounded px-3 py-2 h-24 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.remarks}
              onChange={handleChange}
            />
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2 text-left">
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-900 transition"
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditBenpose;
