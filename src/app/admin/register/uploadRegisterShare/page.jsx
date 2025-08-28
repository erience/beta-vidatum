"use client";
import { apiConnector } from "@/utils/apihelper";
import { useState } from "react";
import { toast } from "react-toastify";

const UploadRegisterShare = () => {
  const [registerShare, setRegisterShare] = useState({
    isin: "",
    file: null,
  });
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  //-------------------------------handle change function-------------------------------------------
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      setRegisterShare((prevState) => ({
        ...prevState,
        [name]: files[0], // file input doesn't need a value prop, so we handle it like this
      }));
    } else {
      setRegisterShare((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  //-------------------------Data submit-----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!registerShare.isin || !registerShare.file) {
      toast.error("Please fill out all fields!");
      return;
    }
    const formData = new FormData();
    formData.append("isin", registerShare.isin);
    formData.append("register_csv", registerShare.file);

    try {
      const response = await apiConnector("POST",
        `${apiUrl}/v2/admin/save-register-share`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.result.status === true) {
        toast.success(response.data.result.message);
      } else {
        toast.error(response.data.result.message);
      }
    } catch (error) {
      const errMsg = error.response.data.message;
      toast.error(errMsg || "An error occurred while processing the request.");
      console.error("An error occurred while processing the request.", error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="max-w-6xl  p-4">
        <h2 className="text-lg font-semibold mb-6">Upload Register Share File{" "}</h2>
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
              value={registerShare.isin}
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

export default UploadRegisterShare;
