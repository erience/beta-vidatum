"use client";
import { useEffect, useState } from "react";
import { apiConnector } from "@/utils/apihelper";
import { useRouter } from "next/navigation";
import { useBenposeStore } from "../../../../../store/benposeStore";
import { toast } from "react-toastify";
import Select from "react-select"; // Import react-select

const SearchInward = () => {
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [searchData, setSearchData] = useState({
    isin: "",
    lf: "",
    inward_id: "",
    drn: "",
    pan: "",
  });
  const setFormData = useBenposeStore((state) => state.setFormData);
  const [inwardIsinList, setInwardIsinList] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = async (e, field, endpoint) => {
    e.preventDefault();

    if (!searchData[field]) {
      toast.error(`Please provide a value for ${field}`);
      return;
    }

    if (!searchData.isin) {
      toast.error("Please select ISIN");
      return;
    }

    // PAN is now optional
    const payload = {
      [field]: searchData[field],
      isin: searchData.isin,
      ...(searchData.pan && { pan: searchData.pan, isintbl: "b_isin", demattable: "b_inward_info"}),
    };

    try {
      const { data: result } = await apiConnector("POST", endpoint, payload);
      setFormData(result);
      router.push("/admin/inward/searchInwardData");
    } catch (err) {
      const errMsg =
        err?.response?.data?.message ||
        "An error occurred while processing the request.";
      toast.error(errMsg);
      console.error("API error:", err);
    }
  };

  const fetchInwardIsin = async () => {
    try {
      const response = await apiConnector(
        "GET",
        `${apiUrl}/v2/admin/process/inward/getlistedisin`
      );
      const responseData = response.data.result;
      setInwardIsinList(responseData);
    } catch (error) {
      const errMsg = error?.response?.data?.error;
      toast.error(errMsg);
    }
  };

  useEffect(() => {
    fetchInwardIsin();
  }, []);

  const handleIsinChange = (selectedOption) => {
    setSearchData((prev) => ({
      ...prev,
      isin: selectedOption ? selectedOption.value : "",
    }));
  };

  const options = inwardIsinList.map((item) => ({
    value: item.isin,
    label: `${item.isin} - ${item.cin}`,
  }));

  return (
    <>
      <h5 className="text-xl font-medium mb-4">Search Inwards</h5>

      <div className="p-4">
        {/* ISIN + DRN No */}
        <div className="space-y-4">
          <h6 className="text-lg font-medium text-gray-800">
            Search by DRN Number
          </h6>
          <form
            onSubmit={(e) =>
              handleSearch(
                e,
                "drn",
                `${apiUrl}/v2/admin/process/inward/search-all-inward?table=b_inward`
              )
            }
            className="space-y-2"
          >
            <label className="block text-sm font-medium text-gray-700">
              Please Select ISIN *
            </label>
            <Select
              options={options}
              onChange={handleIsinChange}
              placeholder="Search or Select ISIN"
              value={options.find((option) => option.value === searchData.isin)}
            />

            <label className="block text-sm font-medium text-gray-700">
              Enter DRN No. *
            </label>
            <input
              name="drn"
              value={searchData.drn}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />

            <button
              type="submit"
              className="bg-gray-800 text-white px-4 py-2 rounded"
            >
              Search by DRN
            </button>
          </form>
        </div>

        {/* ISIN + LF No */}
        <div className="space-y-4 mt-8">
          <h6 className="text-lg font-medium text-gray-800">
            Search by LF Number
          </h6>
          <form
            onSubmit={(e) =>
              handleSearch(
                e,
                "lf",
                `${apiUrl}/v2/admin/process/inward/search-all-inward?table=b_inward`
              )
            }
            className="space-y-2"
          >
            <label className="block text-sm font-medium text-gray-700">
              Please Select ISIN *
            </label>
            <Select
              options={options}
              onChange={handleIsinChange}
              placeholder="Search or Select ISIN"
              value={options.find((option) => option.value === searchData.isin)}
            />

            <label className="block text-sm font-medium text-gray-700">
              Enter LF No. *
            </label>
            <input
              name="lf"
              value={searchData.lf}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />

            <button
              type="submit"
              className="bg-gray-800 text-white px-4 py-2 rounded"
            >
              Search by LF
            </button>
          </form>
        </div>

        {/* ISIN + Inward/Ref No */}
        <div className="space-y-4 mt-8">
          <h6 className="text-lg font-medium text-gray-800">
            Search by Inward/Ref Number
          </h6>
          <form
            onSubmit={(e) =>
              handleSearch(
                e,
                "inward_id",
                `${apiUrl}/v2/admin/process/inward/search-all-inward?table=b_inward`
              )
            }
            className="space-y-2"
          >
            <label className="block text-sm font-medium text-gray-700">
              Please Select ISIN *
            </label>
            <Select
              options={options}
              onChange={handleIsinChange}
              placeholder="Search or Select ISIN"
              value={options.find((option) => option.value === searchData.isin)}
            />

            <label className="block text-sm font-medium text-gray-700">
              Enter Inward No / Ref No. *
            </label>
            <input
              name="inward_id"
              value={searchData.inward_id}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />

            <button
              type="submit"
              className="bg-gray-800 text-white px-4 py-2 rounded"
            >
              Search by Inward/Ref
            </button>
          </form>
        </div>

        {/* ISIN + PAN Number */}
        <div className="space-y-4 mt-8">
          <h6 className="text-lg font-medium text-gray-800">
            Search by PAN Number
          </h6>
          <form
            onSubmit={(e) =>
              handleSearch(
                e,
                "pan",
                `${apiUrl}/v2/admin/process/inward/search-all-inward?table=b_inward`
              )
            }
            className="space-y-2"
          >
            <label className="block text-sm font-medium text-gray-700">
              Please Select ISIN *
            </label>
            <Select
              options={options}
              onChange={handleIsinChange}
              placeholder="Search or Select ISIN"
              value={options.find((option) => option.value === searchData.isin)}
            />

            <label className="block text-sm font-medium text-gray-700">
              Enter PAN Number *
            </label>
            <input
              name="pan"
              value={searchData.pan}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />

            <button
              type="submit"
              className="bg-gray-800 text-white px-4 py-2 rounded"
            >
              Search by PAN
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default SearchInward;
