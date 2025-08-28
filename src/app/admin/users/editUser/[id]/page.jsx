"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Select from "react-select";
import { apiConnector } from "@/utils/apihelper";

const EditUser = () => {
  const { id } = useParams();
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [isinOptions, setIsinOptions] = useState([]);
  const [formData, setFormData] = useState({
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
    isinList: [],
  });

  //------------------------------fetch Isin list-------------------------------------

  useEffect(() => {
    async function load() {
      try {
        const resp = await apiConnector(
          "GET",
          `${apiUrl}/v2/admin/user/edit-user/${id}`
        );
        console.log({ resp });
        const allIsins = resp.data.result.data || [];
        console.log({ allIsins });
        const userData = resp.data.result.userData || {};
        console.log({ userData });
        const assigned = resp.data.result.isinData || [];
        console.log({ assigned });

        // build the react-select options
        const opts = allIsins.map((item) => ({
          value: String(item.id),
          label: item.isin,
        }));
        setIsinOptions(opts);

        // pull out the already-assigned IDs
        const existingIds = assigned.map((i) => String(i.isin_id));

        // seed the form
        setFormData({
          email: userData.email || "",
          password: "",
          username: userData.username || "",
          f_name: userData.f_name || "",
          l_name: userData.l_name || "",
          phone: userData.phone || "",
          mobile: userData.mobile || "",
          rta: String(userData.rta ?? "1"),
          evoting: String(userData.evoting ?? "2"),
          ca: String(userData.ca ?? "2"),
          finance: String(userData.finance ?? "2"),
          isin: String(userData.isin ?? "2"),
          sdd: String(userData.sdd ?? "2"),
          ipo: String(userData.ipo ?? "2"),
          status: String(userData.status ?? "2"),
          isinList: existingIds,
        });
      } catch (err) {
        console.error(err);
        toast.error(err?.response?.data?.message || "Failed to load user data");
      }
    }
    load();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((fd) => ({ ...fd, [name]: value }));
  };

  // handler for the multi-select
  const handleIsinMultiChange = (selectedOptions) => {
    const values = (selectedOptions || []).map((o) => o.value);
    setFormData((fd) => ({ ...fd, isinList: values }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        id: decodeURIComponent(id),
        email: formData.email,
        password: formData.password,
        username: formData.username,
        f_name: formData.f_name,
        l_name: formData.l_name,
        phone: formData.phone,
        mobile: formData.mobile,
        rta: formData.rta,
        evoting: formData.evoting,
        ca: formData.ca,
        finance: formData.finance,
        isin: formData.isin,
        // JSON-encode the array exactly as your EJS form did:
        isinList: JSON.stringify(formData.isinList),
        sdd: formData.sdd,
        ipo: formData.ipo,
        status: formData.status,
      };

      const res = await apiConnector(
        "POST",
        `${apiUrl}/v2/admin/user/edit_user`,
        payload
      );
      toast.success(res.data.result?.message || "User updated!");
      router.push("/admin/users/userList");
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message);
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
      <h1 className="text-xl font-bold mb-6">Edit User</h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-5"
      >
        {/* ISIN */}
        <div className="col-span-2">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            ISIN <span className="text-red-500">*</span>
          </label>
          <Select
            isMulti
            options={isinOptions}
            value={isinOptions.filter((option) =>
              formData.isinList.includes(option.value)
            )}
            onChange={handleIsinMultiChange}
            className="w-full"
            classNamePrefix="select"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Password<span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Email<span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* User Name */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            User Name<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* First Name */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            First Name<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="f_name"
            value={formData.f_name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* Last Name */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Last Name<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="l_name"
            value={formData.l_name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Phone<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* Mobile Number */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Mobile Number<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* Dropdown Fields */}
        {selectFields.map(([field, label]) => (
          <div key={field}>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              {label}
              <span className="text-red-500">*</span>
            </label>
            <select
              name={field}
              value={formData[field]}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
            >
              <option value="">Select {label}</option>
              <option value="1">Active</option>
              <option value="2">Disabled</option>
            </select>
          </div>
        ))}

        {/* Buttons */}
        <div className="col-span-2 flex justify-end gap-4 mt-6">
          <button
            type="submit"
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={() => router.push("/users/userList")}
            className="bg-gray-500 text-white px-5 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUser;
