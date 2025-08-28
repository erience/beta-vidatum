"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import { apiConnector } from "@/utils/apihelper";

const AddUser = () => {
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [formData, setFormData] = useState({
    isinList: [],
    email: "",
    password: "",
    username: "",
    f_name: "",
    l_name: "",
    phone: "",
    mobile: "",
    rta: "1",
    evoting: "2",
    ca: "2",
    finance: "2",
    isin: "2",
    sdd: "2",
    ipo: "2",
    status: "2",
  });

  const [isinList, setIsinList] = useState([]);

  const fetchIsin = async () => {
    try {
      const response = await apiConnector(
        "GET",
        `${apiUrl}/v2/admin/user/add_user`
      );
      setIsinList(response.data.result);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch ISINs");
      console.error("ISIN fetch error:", error);
    }
  };

  useEffect(() => {
    fetchIsin();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      const response = await apiConnector(
        "POST",
        `${apiUrl}/v2/admin/user/save_user`,
        payload
      );
      toast.success(response.data.result.message || "User added successfully!");
      router.push("/users/userList");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Submission failed");
      console.error("Submit error:", error);
    }
  };

  const selectFields = [
    ["rta", "RTA Subscription"],
    ["evoting", "E-voting Subscription"],
    ["ca", "Corporate Action Subscription"],
    ["finance", "Finance Subscription"],
    ["isin", "ISIN Subscription"],
    ["sdd", "SDD Subscription"],
    ["ipo", "IPO Subscription"],
    ["status", "Status"],
  ];

  return (
    <div className="w-full py-6">
      <h2 className="text-2xl font-bold mb-6">Add User</h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* ISIN Multi-Select */}
        <div className="col-span-2">
          <label className="block mb-1 font-semibold">
            ISIN<span className="text-red-500">*</span>
          </label>
          <Select
            isMulti
            name="isinList"
            options={isinList.map((item) => ({
              value: item.id,
              label: item.isin,
            }))}
            value={formData.isinList
              .map((id) => {
                const match = isinList.find((item) => item.id === id);
                return match ? { value: match.id, label: match.isin } : null;
              })
              .filter(Boolean)}
            onChange={(selected) => {
              const ids = selected.map((opt) => opt.value);
              setFormData((prev) => ({ ...prev, isinList: ids }));
            }}
            className="w-full"
            classNamePrefix="select"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1 font-semibold">
            Email<span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        {/* Password */}
        <div>
          <label className="block mb-1 font-semibold">
            Password<span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        {/* Username */}
        <div>
          <label className="block mb-1 font-semibold">
            Username<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        {/* First Name */}
        <div>
          <label className="block mb-1 font-semibold">
            First Name<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="f_name"
            value={formData.f_name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        {/* Last Name */}
        <div>
          <label className="block mb-1 font-semibold">
            Last Name<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="l_name"
            value={formData.l_name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block mb-1 font-semibold">Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* Mobile */}
        <div>
          <label className="block mb-1 font-semibold">Mobile Number</label>
          <input
            type="text"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* Select Dropdowns */}
        {selectFields.map(([field, label]) => (
          <div key={field}>
            <label className="block mb-1 font-semibold">
              {label}
              <span className="text-red-500">*</span>
            </label>
            <select
              name={field}
              value={formData[field]}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            >
              <option value="">Select {label}</option>
              <option value="1">Active</option>
              <option value="2">Disabled</option>
            </select>
          </div>
        ))}

        {/* Buttons */}
        <div className="col-span-2 flex justify-end gap-4 mt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={() => router.push("/users/userList")}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUser;
