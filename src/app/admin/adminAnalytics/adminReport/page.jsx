"use client";
import { apiConnector } from "@/utils/apihelper";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const AdminReport = () => {
  const [adminForm, setAdminForm] = useState({ from: "", to: "", admin: "" });
  const [allAdminForm, setAllAdminForm] = useState({ from: "", to: "" });
  const [inwardForm, setInwardForm] = useState({ from: "" });
  const [data, setData] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchAdminList = async () => {
      try {
        const response = await apiConnector(
          "GET",
          `${apiUrl}/v2/admin/individual/reportform`
        );
        setData(response.data.result || []);
      } catch (error) {
        const msg = error.response?.data?.message || "Error fetching data";
        toast.error(msg);
        console.error("Fetch admin list error:", error);
      }
    };
    fetchAdminList();
  }, [apiUrl]);

  const handleAdminFormChange = (e) => {
    const { name, value } = e.target;
    setAdminForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAllAdminFormChange = (e) => {
    const { name, value } = e.target;
    setAllAdminForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleInwardFormChange = (e) => {
    const { name, value } = e.target;
    setInwardForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { from, to, admin } = adminForm;

    if (!from || !to || !admin) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const response = await apiConnector(
        "GET",
        `${apiUrl}/v2/admin/individual/report`,
        null,
        null,
        { from, to, admin }
      );

      if (!response?.data) {
        throw new Error("Invalid response from server");
      }

      router.push(
        `/admin/adminAnalytics/analyticsAdminReport?admin=${admin}&from=${from}&to=${to}`
      );
    } catch (error) {
      toast.error("Failed to fetch admin report");
      console.error("Submit error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdminData = async (e) => {
    e.preventDefault();
    const { from, to } = allAdminForm;

    if (!from || !to) {
      toast.error("Please fill in both dates.");
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      await apiConnector(
        "GET",
        `${apiUrl}/v2/admin/allAdmin/report`,
        null,
        null,
        { from, to }
      );

      router.push(`/admin/adminAnalytics/allAdminReport?from=${from}&to=${to}`);
    } catch (err) {
      toast.error("Failed to fetch admin report");
      console.error("Admin data error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInwardReport = async (e) => {
    e.preventDefault();
    const { from } = inwardForm;

    if (!from) {
      toast.error("Please choose a date.");
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      await apiConnector(
        "GET",
        `${apiUrl}/v2/admin/inward/report`,
        null,
        null,
        { date: from }
      );

      router.push(`/admin/adminAnalytics/InwardReport?date=${from}`);
    } catch (err) {
      toast.error("Failed to fetch inward report");
      console.error("Inward report error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full py-6 px-4 md:px-0">
      <div className="w-full">
        <h1 className="text-2xl font-bold border-b pb-4 mb-6">Admin Report</h1>

        <div className="grid md:grid-cols-2 gap-10 mb-10">
          {/* Admin Wise Report */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Admin Wise Report</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm mb-1">Choose a From Date:</label>
                <input
                  type="date"
                  name="from"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  value={adminForm.from}
                  onChange={handleAdminFormChange}
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Choose a To Date:</label>
                <input
                  type="date"
                  name="to"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  value={adminForm.to}
                  onChange={handleAdminFormChange}
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Choose an Admin:</label>
                <select
                  name="admin"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  value={adminForm.admin}
                  onChange={handleAdminFormChange}
                >
                  <option value="">-- Select Admin --</option>
                  {data.map((admin) => (
                    <option key={admin.username} value={admin.username}>
                      {admin.username}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
              >
                Submit
              </button>
            </form>
          </div>

          {/* All Admin Report */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">All Admin Report</h2>
            <form className="space-y-4" onSubmit={handleAdminData}>
              <div>
                <label className="block text-sm mb-1">Choose a From Date:</label>
                <input
                  type="date"
                  name="from"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  value={allAdminForm.from}
                  onChange={handleAllAdminFormChange}
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Choose a To Date:</label>
                <input
                  type="date"
                  name="to"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  value={allAdminForm.to}
                  onChange={handleAllAdminFormChange}
                />
              </div>
              <button
                type="submit"
                className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
              >
                Submit
              </button>
            </form>
          </div>
        </div>

        {/* Inward Report */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">All Inward Report</h2>
          <form className="space-y-4 md:w-1/3" onSubmit={handleInwardReport}>
            <div>
              <label className="block text-sm mb-1">Choose a Date:</label>
              <input
                type="date"
                name="from"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={inwardForm.from}
                onChange={handleInwardFormChange}
              />
            </div>
            <button
              type="submit"
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminReport;
