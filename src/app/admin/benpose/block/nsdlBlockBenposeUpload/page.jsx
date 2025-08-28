"use client";
import { apiConnector } from "@/utils/apihelper";
import { formatDMY } from "@/utils/helper";
import { useState } from "react";

const NsdlBlockBenposeUpload = () => {
  const [date, setDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!date) {
      alert("Please select a Benpose Date.");
      return;
    }

    const formattedDate = formatDMY(date);

    const formData = new FormData();
    formData.append("date", formattedDate);
    setIsSubmitting(true);

    try {
      const response = await apiConnector(
        "POST",
        `${apiUrl}/v2/admin/benpose/saveblocknsdlbenpose`,
        // formData,
        { data: JSON.stringify({ date: formData }) },
        {
          contentType: "application/json",
        }
      );

      if (response.data.status === true) {
        toast.success("Data submit sucessfully");
        setDate("");
      } else {
        toast.error("An error occurred while processing the request.");
      }
    } catch (error) {
      console.error("Error processing request:", error);
      toast.error("An error occurred while uploading.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="max-w-4xl p-2">
        <h2 className="text-lg font-semibold mb-6">
          Block NSDL Benpose Upload
        </h2>

        <div className="mb-6">
          <label
            htmlFor="bdate"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Benpose Date <span className="text-red-500">*</span>
          </label>
          <div className="w-64">
            {" "}
            {/* <-- set desired input width here */}
            <input
              type="date"
              name="date"
              id="bdate"
              placeholder="Benpose Date"
              value={date}
              onChange={handleDateChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Uploading..." : "Submit"}
          </button>
        </div>
      </form>
    </>
  );
};

export default NsdlBlockBenposeUpload;
