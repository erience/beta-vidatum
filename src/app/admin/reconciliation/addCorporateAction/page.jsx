"use client";
import { apiConnector } from "@/utils/apihelper";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Select from "react-select";

const AddCorporateAction = () => {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({
    depository: "",
    isin_id: "",
    ref: "",
    a_date: "",
    c_date: "",
    type: "",
    is_share: "Yes",
    count: "",
    status: "Active",
    des: "",
    remarks: "Master Data",
  });
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const fetchIsin = async () => {
    try {
      const responseData = await apiConnector(
        "GET",
        `${apiUrl}/v2/admin/action/add_corporate_action`
      );
      const result = responseData.data.result;
      setData(result);
    } catch (error) {
      const errMsg = error.response.data.message;
      toast.error(errMsg || "An error occurred while processing the request.");
      console.error("Error fetching data", error);
    }
  };

  useEffect(() => {
    fetchIsin();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // For react-select components
  const handleSelectChange = (selectedOption, { name }) => {
    const value = selectedOption ? selectedOption.value : "";
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await apiConnector(
        "POST",
        `${apiUrl}/v2/admin/add-corporate-action`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;
      if (data.status === true) {
        toast.success(data.result.message);
        router.push("/admin/reconciliation/corporateList");
      } else {
        toast.error(data.result.message);
      }
    } catch (error) {
      const errMsg = error.response.data.message;
      toast.error(errMsg || "An error occurred while processing the request.");
      console.error("Error:", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h4 className="text-2xl font-semibold text-gray-800 mb-6">
        Add Corporate Action
      </h4>

      <div className="">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Depository Dropdown */}
            <div>
              <label
                htmlFor="depository"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Depository
              </label>
              <Select
                id="depository"
                name="depository"
                value={
                  formData.depository
                    ? { value: formData.depository, label: formData.depository }
                    : null
                } // Check for null or empty value
                onChange={(selectedOption) =>
                  handleSelectChange(selectedOption, { name: "depository" })
                }
                options={[
                  { value: "NSDL", label: "NSDL" },
                  { value: "CDSL", label: "CDSL" },
                  { value: "PHYSICAL", label: "PHYSICAL" },
                ]}
                isSearchable={false}
                placeholder="Select Depository"
                required
                styles={{
                  control: (base) => ({
                    ...base,
                    border: "none",
                    boxShadow: "none",
                    backgroundColor: "#f3f4f6",
                  }),
                }}
              />
            </div>

            {/* ISIN Dropdown */}
            <div>
              <label
                htmlFor="isin_id"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Select ISIN
              </label>
              <Select
                id="isin_id"
                name="isin_id"
                value={
                  formData.isin_id
                    ? { value: formData.isin_id, label: formData.isin_id }
                    : null
                }
                onChange={(e) => handleSelectChange(e, { name: "isin_id" })}
                options={data.map((item) => ({
                  value: item.isin,
                  label: item.isin,
                }))}
                isSearchable={true}
                placeholder="Select ISIN"
                required
                styles={{
                  control: (base) => ({
                    ...base,
                    border: "none",
                    boxShadow: "none",
                    backgroundColor: "#f3f4f6",
                  }),
                }}
              />
            </div>

            {/* RTA Ref */}
            <div>
              <label
                htmlFor="ref"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                RTA Ref No
              </label>
              <input
                type="text"
                id="ref"
                name="ref"
                className="w-full border-none bg-gray-100 rounded-md px-4 py-3"
                placeholder="RTA Ref No"
                value={formData.ref}
                onChange={handleChange}
              />
            </div>

            {/* Allotment Date */}
            <div>
              <label
                htmlFor="a_date"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Allotment Date
              </label>
              <input
                type="date"
                id="a_date"
                name="a_date"
                className="w-full border-none bg-gray-100 rounded-md px-4 py-3"
                value={formData.a_date}
                onChange={handleChange}
                required
              />
            </div>

            {/* Credit Date */}
            <div>
              <label
                htmlFor="c_date"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Credit Date
              </label>
              <input
                type="date"
                id="c_date"
                name="c_date"
                className="w-full border-none bg-gray-100 rounded-md px-4 py-3"
                value={formData.c_date}
                onChange={handleChange}
              />
            </div>

            {/* Type Dropdown */}
            <div>
              <label
                htmlFor="type"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Type
              </label>
              <Select
                id="type"
                name="type"
                value={
                  formData.type
                    ? { value: formData.type, label: formData.type }
                    : null
                }
                onChange={(e) => handleSelectChange(e, { name: "type" })}
                options={[
                  { value: "Credit", label: "Credit" },
                  { value: "Debit", label: "Debit" },
                ]}
                isSearchable={false}
                placeholder="Select Type"
                required
                styles={{
                  control: (base) => ({
                    ...base,
                    border: "none",
                    boxShadow: "none",
                    backgroundColor: "#f3f4f6",
                  }),
                }}
              />
            </div>

            {/* Is Share Dropdown */}
            <div>
              <label
                htmlFor="is_share"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Is Share
              </label>
              <Select
                id="is_share"
                name="is_share"
                value={{ value: formData.is_share, label: formData.is_share }}
                onChange={(e) => handleSelectChange(e, { name: "is_share" })}
                options={[
                  { value: "Yes", label: "Yes" },
                  { value: "No", label: "No" },
                ]}
                isSearchable={false}
                placeholder="Select"
                required
                styles={{
                  control: (base) => ({
                    ...base,
                    border: "none",
                    boxShadow: "none",
                    backgroundColor: "#f3f4f6",
                  }),
                }}
              />
            </div>

            {/* No. of Shares */}
            <div>
              <label
                htmlFor="count"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                No. of Shares
              </label>
              <input
                type="number"
                id="count"
                name="count"
                placeholder="Enter Number Of Share"
                className="w-full border-none bg-gray-100 rounded-md px-4 py-3"
                value={formData.count}
                onChange={handleChange}
              />
            </div>

            {/* Status Dropdown */}
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Status
              </label>
              <Select
                id="status"
                name="status"
                value={{ value: formData.status, label: formData.status }}
                onChange={(e) => handleSelectChange(e, { name: "status" })}
                options={[
                  { value: "Active", label: "Active" },
                  { value: "Inactive", label: "Inactive" },
                  { value: "Delete", label: "Delete" },
                ]}
                isSearchable={false}
                placeholder="Select Status"
                required
                styles={{
                  control: (base) => ({
                    ...base,
                    border: "none",
                    boxShadow: "none",
                    backgroundColor: "#f3f4f6",
                  }),
                }}
              />
            </div>

            {/* Description Dropdown */}
            <div>
              <label
                htmlFor="des"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Description
              </label>
              <Select
                id="des"
                name="des"
                value={
                  formData.des
                    ? { value: formData.des, label: formData.des }
                    : null
                }
                onChange={(e) => handleSelectChange(e, { name: "des" })}
                options={[
                  {
                    value: "Initial Public Offer",
                    label: "Initial Public Offer",
                  },
                  { value: "Subscribers to MOA", label: "Subscribers to MOA" },
                  { value: "Private Placement", label: "Private Placement" },
                  {
                    value: "Prefrential Allotment",
                    label: "Prefrential Allotment",
                  },
                  {
                    value: "Bonus Issue/ Right Issue",
                    label: "Bonus Issue/ Right Issue",
                  },
                  {
                    value: "Buy Back of Securities",
                    label: "Buy Back of Securities",
                  },
                  {
                    value: "Merger/ Amalgamation",
                    label: "Merger/ Amalgamation",
                  },
                  {
                    value: "Redemption of Securities",
                    label: "Redemption of Securities",
                  },
                  {
                    value: "Lock-In of Securities",
                    label: "Lock-In of Securities",
                  },
                  {
                    value: "Demat to Demat Transfer",
                    label: "Demat to Demat Transfer",
                  },
                  {
                    value: "Allotment to Temporary ISIN",
                    label: "Allotment to Temporary ISIN",
                  },
                  {
                    value: "Conversion of Loan into Equity",
                    label: "Conversion of Loan into Equity",
                  },
                ]}
                isSearchable={false}
                placeholder="Select Description"
                required
                styles={{
                  control: (base) => ({
                    ...base,
                    border: "none",
                    boxShadow: "none",
                    backgroundColor: "#f3f4f6",
                  }),
                }}
              />
            </div>

            {/* Remarks */}
            <div>
              <label
                htmlFor="remarks"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Remarks
              </label>
              <textarea
                id="remarks"
                name="remarks"
                className="w-full border-none bg-gray-100 rounded-md px-4 py-3 h-24"
                value={formData.remarks}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Submit and Cancel Buttons */}
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Submit
            </button>
            <button
              type="button"
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              onClick={() =>
                (window.location.href = "/admin/reconciliation/ca")
              }
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCorporateAction;
