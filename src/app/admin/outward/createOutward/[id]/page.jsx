"use client";

import { useEffect, useState } from "react";
import { useOutwardStore } from "../../storage/store";
import { useRouter } from "next/navigation";
import { apiConnector } from "@/utils/apihelper";
import { toast } from "react-toastify";

const CreateOutward = () => {
  const router = useRouter();
  const payload = useOutwardStore((state) => state.payload);
  const initialInwardRef = payload.inward_ref || "";
  const [formData, setFormData] = useState({
    inward_ref: initialInwardRef,
    mode: "Courier",
    o_date: "",
    d_date: "",
    agency: "1",
    awb: "",
    remarks: "",
    status: "",
  });

  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const CreateOutwardData = async (e) => {
    e.preventDefault();
    try {
      const response = await apiConnector(
        "POST",
        `${apiUrl}/v2/admin/process/outward/create_outward`,
        formData
      );

      if (response.data.status === true) {
        toast.success(response.data.message);
        router.push("/outward/outwardProcess");
      } else {
        const errorMsg = response.data?.message;
        toast.error(errorMsg || "An error occurred posting data.");
      }
    } catch (error) {
      const errMsg = error?.response?.data?.message;
      toast.error(errMsg || "An error occurred while processing the request.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className="w-full p-3">
      <h2 className="text-2xl font-semibold mb-6">Add Outward</h2>

      <form onSubmit={CreateOutwardData} className="">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5">
          <div>
            <label className="block font-medium mb-1">
              Inward Reference<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="inward_ref"
              value={formData.inward_ref}
              readOnly
              disabled
              className="w-full p-2 border border-gray-300 rounded bg-gray-100"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">
              Mode<span className="text-red-500">*</span>
            </label>
            <select
              name="mode"
              value={formData.mode}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="Courier">Courier</option>
              <option value="Hand Delivery">Hand Delivery</option>
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1">
              Outward Date<span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="o_date"
              value={formData.o_date}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Delivery Date</label>
            <input
              type="date"
              name="d_date"
              value={formData.d_date}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">
              Agency<span className="text-red-500">*</span>
            </label>
            <select
              name="agency"
              value={formData.agency}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="1">Nandan Courier</option>
              <option value="2">Sky King Courier</option>
              <option value="3">Speed Post</option>
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1">
              AWB / Track ID / Dispatch ID<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="awb"
              value={formData.awb}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter AWB Number"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">
              Remarks<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter remarks"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">
              Status<span className="text-red-500">*</span>
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">Select Status</option>
              <option value="1">Pending</option>
              <option value="2">Active</option>
              <option value="3">Delete</option>
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex gap-4">
          <button
            type="submit"
            className="px-6 py-2 text-white rounded bg-black hover:bg-gray-800"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 text-white bg-red-600 hover:bg-red-700 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateOutward;
