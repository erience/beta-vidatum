"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const DownloadBenpose = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fullForm, setFullForm] = useState({ date: "", isin: "" });
  const [shortForm, setShortForm] = useState({ date: "", isin: "" });
  const [report311Form, setReport311Form] = useState({ date: "", isin: "" });
  const [changeForm, setChangeForm] = useState({ date: "", isin: "" });

  const handleChange = (formSetter) => (e) => {
    const { name, value } = e.target;
    formSetter((prev) => ({ ...prev, [name]: value }));
  };

  const handleFullBenpose = async (e) => {
    e.preventDefault();
    const date = fullForm.date;
    const isin = fullForm.isin;
    const benposType = "special";
    const fullOrShort = "full";
    const url = `/admin/benpose/weekly/benposData?date=${encodeURIComponent(
      date
    )}&isin=${btoa(isin)}&benposType=${encodeURIComponent(
      benposType
    )}&fullOrShort=${encodeURIComponent(fullOrShort)}`;

    router.push(url);
  };

  const handleShortBenpose = async (e) => {
    e.preventDefault();
    const date = shortForm.date;
    const isin = shortForm.isin;
    const benposType = "special";
    const fullOrShort = "short";
    const url = `/admin/benpose/weekly/benposData?date=${encodeURIComponent(
      date
    )}&isin=${btoa(isin)}&benposType=${encodeURIComponent(
      benposType
    )}&fullOrShort=${encodeURIComponent(fullOrShort)}`;

    router.push(url);
  };

  const handleReport311 = (e) => {
    e.preventDefault();

    const date = report311Form.date;
    const isin = report311Form.isin;
    const benposType = "special";

    const url = `/admin/benpose/weekly/weeklyReport311Benpos?date=${encodeURIComponent(
      date
    )}&isin=${btoa(isin)}&benposType=${encodeURIComponent(benposType)}`;

    router.push(url);
  };

  const handleChangeReport = async (e) => {
    e.preventDefault();
    const date = changeForm.date;
    const isin = changeForm.isin;
    const benposType = "special";

    const url = `/admin/benpose/weekly/weeklyChangeReport?date=${encodeURIComponent(
      date
    )}&isin=${btoa(isin)}&benposType=${encodeURIComponent(benposType)}`;

    router.push(url);
  };
  return (
    <div className="container mx-auto px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Benpose Demat   </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Benpose Form */}
        <div className="bg-white shadow-md rounded p-6">
          <h2 className="text-lg font-semibold mb-4">Full Benpose</h2>
          <form onSubmit={handleFullBenpose}>
            <div className="mb-4">
              <label className="block font-medium">
                ISIN <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="isin"
                value={fullForm.isin}
                onChange={handleChange(setFullForm)}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                placeholder="Enter ISIN"
                autoComplete="off"
              />
            </div>
            <div className="mb-4">
              <label className="block font-medium">
                Date <span className="text-red-600">*</span>
              </label>
              <input
                type="date"
                name="date"
                value={fullForm.date}
                onChange={handleChange(setFullForm)}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800 disabled:bg-gray-400"
            >
              {loading ? "Loading..." : "Submit"}
            </button>
          </form>
        </div>

        {/* Short Benpose Form */}
        <div className="bg-white shadow-md rounded p-6">
          <h2 className="text-lg font-semibold mb-4">Short Benpose</h2>
          <form onSubmit={handleShortBenpose}>
            <div className="mb-4">
              <label className="block font-medium">
                ISIN <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="isin"
                value={shortForm.isin}
                onChange={handleChange(setShortForm)}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                placeholder="Enter ISIN"
                autoComplete="off"
              />
            </div>
            <div className="mb-4">
              <label className="block font-medium">
                Date <span className="text-red-600">*</span>
              </label>
              <input
                type="date"
                name="date"
                value={shortForm.date}
                onChange={handleChange(setShortForm)}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800 disabled:bg-gray-400"
            >
              {loading ? "Loading..." : "Submit"}
            </button>
          </form>
        </div>

        {/* Report 311 Form */}
        <div className="bg-white shadow-md rounded p-6">
          <h2 className="text-lg font-semibold mb-4">Report 311</h2>
          <form onSubmit={handleReport311}>
            <div className="mb-4">
              <label className="block font-medium">
                ISIN <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="isin"
                value={report311Form.isin}
                onChange={handleChange(setReport311Form)}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                placeholder="Enter ISIN"
                autoComplete="off"
              />
            </div>
            <div className="mb-4">
              <label className="block font-medium">
                Date <span className="text-red-600">*</span>
              </label>
              <input
                type="date"
                name="date"
                value={report311Form.date}
                onChange={handleChange(setReport311Form)}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800 disabled:bg-gray-400"
            >
              {loading ? "Loading..." : "Submit"}
            </button>
          </form>
        </div>

        {/* Change Form */}
        <div className="bg-white shadow-md rounded p-6">
          <h2 className="text-lg font-semibold mb-4">Change Form</h2>
          <form onSubmit={handleChangeReport}>
            <div className="mb-4">
              <label className="block font-medium">
                ISIN <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="isin"
                value={changeForm.isin}
                onChange={handleChange(setChangeForm)}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                placeholder="Enter ISIN"
                autoComplete="off"
              />
            </div>
            <div className="mb-4">
              <label className="block font-medium">
                Date <span className="text-red-600">*</span>
              </label>
              <input
                type="date"
                name="date"
                value={changeForm.date}
                onChange={handleChange(setChangeForm)}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800 disabled:bg-gray-400"
            >
              {loading ? "Loading..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DownloadBenpose;
