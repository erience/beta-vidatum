"use client";
import { apiConnector } from "@/utils/apihelper";
import { useState } from "react";
import { toast } from "react-toastify";

const UploadRegisterFile = () => {
  const [register, setRegister] = useState({
    isin: "",
    file: null,
  });
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  //-------------------------------handle change function-------------------------------------------
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      setRegister((prevState) => ({
        ...prevState,
        [name]: files[0],
      }));
    } else {
      setRegister((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!register.isin || !register.file) {
      toast.error("Please fill out all fields!");
      return;
    }

    const formData = new FormData();
    formData.append("isin", register.isin);
    formData.append("register_csv", register.file);

    try {
      const response = await apiConnector(
        "POST",
        `${apiUrl}/v2/admin/save-register`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.status === true) {
        toast.success(response.data.result.message);
      } else {
        toast.error(response.data.result.message);
      }
    } catch (error) {
      if (error.response?.data) {
        const errorData = error.response.data;
        const errorMessage =
          errorData.result?.message ||
          errorData.message ||
          errorData.error ||
          "Something went wrong!";

        toast.error(errorMessage);
      } else {
        toast.error("Something went wrong!");
      }
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="max-w-6xl  p-4">
        <h2 className="text-lg font-semibold mb-6">Upload Register File</h2>
        <div className="flex flex-col lg:flex-row lg:items-start gap-6">
          {/* Benpose Date */}
          <div className="w-full lg:w-1/2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ISIN <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="isin"
              name="isin"
              value={register.isin}
              onChange={handleChange}
              placeholder="INS0000000000"
              className="mt-2 p-2 border rounded-md w-full"
              required
            />
          </div>

          {/* File Upload */}
          <div className="w-full lg:w-1/2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Register File  <small className="text-red-500">
                {" "}
                only .CSV file allowed
              </small>
            </label>
            <input
              type="file"
              id="file"
              name="file"
              accept=".csv"
              onChange={handleChange}
              className="mt-2 p-2 border rounded-md w-full"
              required
            />
          </div>
        </div>
        <div className="mt-6">
          <button
            type="submit"
            className="bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-700"
          >
            Submit
          </button>
        </div>
      </form>
    </>
  );
};

export default UploadRegisterFile;
