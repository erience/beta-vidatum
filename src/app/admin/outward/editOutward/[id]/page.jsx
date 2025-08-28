"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useOutwardStore } from "../../storage/store";
import { apiConnector } from "@/utils/apihelper";
import { toast } from "react-toastify";

const EditOutward = () => {
  const router = useRouter();
  const { id } = useParams();
  const payload = useOutwardStore((state) => state.payload);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    outward_ref: "",
    inward_ref: "",
    mode: "Courier",
    o_date: "",
    d_date: "",
    agency: "1",
    awb: "",
    remarks: "",
    status: "",
  });

  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    if (!id) return;

    if (payload) {
      setFormData({
        outward_ref: payload.outward_ref || "",
        inward_ref: payload.inward_ref || "",
        mode: payload.mode || "Courier",
        o_date: payload.o_date || "",
        d_date: payload.d_date || "",
        agency: payload.agency || "1",
        awb: payload.awb || "",
        remarks: payload.remarks || "",
        status: String(payload.status || ""),
      });
      setLoading(false);
    } else {
      apiConnector("GET", `${apiUrl}/v2/admin/process/outward/edit_outward?ref=${encodeURIComponent(id)}`)
        .then((res) => {
          const result = res?.data?.result || {};
          setFormData({
            outward_ref: result.outward_ref || "",
            inward_ref: result.inward_ref || "",
            mode: result.mode || "Courier",
            o_date: result.o_date || "",
            d_date: result.d_date || "",
            agency: result.agency || "1",
            awb: result.awb || "",
            remarks: result.remarks || "",
            status: String(result.status || ""),
          });
        })
        .catch((err) => {
          const errMsg = err?.response?.data?.message;
          toast.error(errMsg || "Error fetching data.");
          console.error("Error:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [payload, id, apiUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((fd) => ({ ...fd, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { outward_ref, ...submitData } = formData;

      const res = await apiConnector("POST", `${apiUrl}/v2/admin/process/outward/edit_outward`, submitData);

      toast.success(res?.data?.result?.message || "Outward updated successfully");
      router.push("/outward/outwardProcess");
    } catch (err) {
      const errMsg = err?.response?.data?.message;
      toast.error(errMsg || "Error updating outward.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

 

  return (
    <>
    
    <div className="w-full p-3">
      <h2 className="text-2xl font-semibold mb-6">Edit Outward</h2>

      <form onSubmit={handleSubmit} className="">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5">
          <div>
            <label className="block font-medium mb-1">
              Outward Reference<span className="text-red-500">*</span>
            </label>
            <input
              name="outward_ref"
              value={formData.outward_ref}
              disabled
              className="w-full p-2 border border-gray-300 rounded bg-gray-100"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">
              Inward Reference<span className="text-red-500">*</span>
            </label>
            <input
              name="inward_ref"
              value={formData.inward_ref}
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
              name="awb"
              value={formData.awb}
              onChange={handleChange}
              required
              className="w-full p-2 border border-red-400 rounded"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">
              Remarks<span className="text-red-500">*</span>
            </label>
            <input
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
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

        <div className="mt-6 flex gap-2">
          <button
            type="submit"
            disabled={submitting}
            className={`px-6 py-2 text-white rounded ${
              submitting ? "bg-gray-400" : "bg-black hover:bg-gray-800"
            }`}
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 text-white bg-red-500 hover:bg-red-600 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
    </>
  );
};

export default EditOutward;
