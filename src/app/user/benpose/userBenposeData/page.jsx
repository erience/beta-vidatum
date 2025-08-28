"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState, useMemo } from "react";
import { X, Filter } from "lucide-react";
// import { useSearchParams } from "next/navigation";
import { apiConnector } from "@/utils/apihelper";
import ViewDataTable from "@/components/dataTables/ViewDataTable";
import useQueryParams from "../../../../../hook/useQueryParams";

const UserBenposeData = () => {
  const [benposeRecord, setBenposeRecord] = useState([]);
  const [loading, setLoading] = useState(true);
  const [benposeDate, setBenposeDate] = useState("");
  const [isinData, setIsinData] = useState("");
  const [cdslCountData, setCdslCountData] = useState("");
  const [nsdlCountData, setNsdlCountData] = useState("");
  const [showForm, setShowForm] = useState(true);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  // const searchParams = useSearchParams();
  const { date, benposType, fullOrShort } = useQueryParams();
  // const date = searchParams.get("date");
  // const benposType = searchParams.get("benposType");
  // const fullOrShort = searchParams.get("fullOrShort");
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const requiredFields = {
    full: [
      "type",
      "lf",
      "label",
      "f_holder",
      "f_pan",
      "s_holder",
      "s_pan",
      "t_holder",
      "t_pan",
      "address1",
      "address2",
      "address3",
      "address4",
      "pin",
      "phone",
      "email",
      "bank",
      "ifsc",
      "b_account",
      "total",
      "pledge",
      "lock",
    ],
    short: [
      "type",
      "lf",
      "label",
      "f_holder",
      "f_pan",
      "email",
      "total",
      "pledge",
      "lock",
    ],
  };

  const filedLabels = {
    type: "Type",
    date: "Date",
    isin: "ISIN",
    lf: "Folio No",
    n_type: "NSDL Type",
    n_sub_type: "NSDL Sub Type",
    c_type: "CDSL Type",
    c_sub_type: "CDSL Sub Type",
    f_holder: "First Holder Name",
    f_pan: "First Holder PAN",
    s_holder: "Second Holder Name",
    s_pan: "Second Holder PAN",
    t_holder: "Third Holder Name",
    t_pan: "Third Holder PAN",
    father_name: "Father Name",
    address1: "Address Line 1",
    address2: "Address Line 2",
    address3: "Address Line 3",
    address4: "Address Line 4",
    nationality: "Nationality",
    pin: "PIN Code",
    phone: "Phone Number",
    email: "Email",
    bank: "Bank Name",
    ifsc: "IFSC Code",
    b_account: "Bank Account Number",
    b_type: "Bank Account Type",
    b_address1: "BankAddress1",
    b_address2: "BankAddress2",
    b_address3: "BankAddress3",
    b_address4: "BankAddress4",
    b_pin: "Bank Pin Code",
    total: "Total Shares",
    lock: "Locked Shares",
    pledge: "Pledge Shares",
    pool: "Pool",
    remat: "Remat",
  };
  // const fieldNames = Object.keys(filedLabels);
  // const [selectedFields, setSelectedFields] = useState(
  //   requiredFields[fullOrShort]
  // );
  // const [tempSelectedFields, setTempSelectedFields] = useState([
  //   ...selectedFields,
  // ]);
  const fieldNames = Object.keys(filedLabels);

  const defaultFields = requiredFields[fullOrShort] || [];
  const [selectedFields, setSelectedFields] = useState(defaultFields);
  const [tempSelectedFields, setTempSelectedFields] = useState([
    ...defaultFields,
  ]);

  const fetchBenposData = async () => {
    setLoading(true);
    try {
      const submitData = {
        date: date,
        benposType,
        requiredFields: selectedFields,
      };

      const response = await apiConnector(
        "POST",
        `${apiUrl}/v2/user/benpose/search_benpose_record`,
        submitData
      );

      const { cdslCount, nsdlCount, data: records, isin } = response.data.data;

      setBenposeDate(date);
      setIsinData(isin);
      setCdslCountData(cdslCount);
      setNsdlCountData(nsdlCount);

      const enrichedRecords = records.map((item) => ({
        ...item,
        date,
      }));

      setBenposeRecord(enrichedRecords);
      if (response.data.status !== true) {
        toast.error(response.data.message || "Error fetching data.");
      }
    } catch (error) {
      const errMsg = error.response.data.message;
      toast.error(errMsg || "An error occurred while processing the request.");
      console.error("Error while fetching data:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (date && benposType && fullOrShort) {
      fetchBenposData();
    }
  }, [date, benposType, fullOrShort, selectedFields]);

  const columns = useMemo(() => {
    const base = [
      {
        header: "#",
        accessorKey: "index",
        cell: (info) => info.row.index + 1,
      },
      {
        header: "Date",
        accessorKey: "date",
        cell: (info) => info.row.original.date || "-",
      },

      {
        header: "Type",
        accessorKey: "type",
        cell: (info) => {
          if (info.row.original.type == 1) {
            return "NSDL";
          } else if (info.row.original.type == 2) {
            return "CDSL";
          } else if (info.row.original.type == 3) {
            return "Physical";
          }
          return "";
        },
      },
    ];

    const dynamic = selectedFields
      .filter((field) => !["type", "isin", "date"].includes(field))
      .map((field) => ({
        header: filedLabels[field] || field,
        accessorKey: field,
        cell: (info) => info.row.original[field] || "-",
      }));

    return [...base, ...dynamic];
  }, [selectedFields]);

  return (
    <>
      <div className="">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Benpose Date Card */}
          <div className="bg-white rounded shadow">
            <div className="flex h-full">
              <div className="w-1/4 bg-blue-500 flex items-center justify-center text-white">
                {/* <Calendar size={40} /> */}
              </div>
              <div className="w-3/4 p-4 text-right">
                <h2 className="text-2xl font-normal mb-2">{date || ""}</h2>
                <p className="text-gray-500 m-0">Benpose Date</p>
              </div>
            </div>
          </div>
          {/* Benpose isin Card */}
          <div className="bg-white rounded shadow">
            <div className="flex h-full">
              <div className="w-1/4 bg-yellow-500 flex items-center justify-center text-white">
                {/* <Calendar size={40} /> */}
              </div>
              <div className="w-3/4 p-4 text-right">
                <h2 className="text-2xl font-normal mb-2">{isinData || ""}</h2>
                <p className="text-gray-500 m-0">Benpose ISIN</p>
              </div>
            </div>
          </div>

          {/* CDSL Holders Card */}
          <div className="bg-white rounded shadow">
            <div className="flex h-full">
              <div className="w-1/4 bg-cyan-500 flex items-center justify-center text-white">
                {/* <UserCheck size={40} /> */}
              </div>
              <div className="w-3/4 p-4 text-right">
                <h2 className="text-2xl font-normal mb-2">
                  {cdslCountData || 0}
                </h2>
                <p className="text-gray-500 m-0">CDSL Holders</p>
              </div>
            </div>
          </div>

          {/* NSDL Holders Card */}
          <div className="bg-white rounded shadow">
            <div className="flex h-full">
              <div className="w-1/4 bg-primary-color flex items-center justify-center text-white">
                {/* <Users size={40} /> */}
              </div>
              <div className="w-3/4 p-4 text-right">
                <h2 className="text-2xl font-normal mb-2">
                  {nsdlCountData || 0}
                </h2>
                <p className="text-gray-500 m-0">NSDL Holders</p>
              </div>
            </div>
          </div>
        </div>

        {/* Second row: title and buttons in one row */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Benpose Record Details</h2>
          <div className="flex space-x-3">
            <button
              onClick={() => setIsFilterModalOpen(true)}
              className="bg-primary-color text-white px-4 py-2 rounded hover:bg-primary-color flex items-center"
            >
              <Filter className="mr-2" size={16} />
              Column Filter
            </button>
          </div>
        </div>

        {/* Third row: table */}
        <div className="card">
          <div className="card-body">
            <ViewDataTable
              title="Demat"
              cardHeader="denat data"
              columns={columns}
              data={benposeRecord}
              isLoading={loading}
            />
          </div>
        </div>
      </div>

      {isFilterModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 modal-animation z-[9999]">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Select Columns to Display</h3>
                <button
                  onClick={() => setIsFilterModalOpen(false)}
                  className="p-1 rounded-full hover:bg-gray-200"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="mb-4 p-3 bg-blue-50 rounded text-sm text-blue-700">
                <p>
                  Select the fields you want to display in the table. Default
                  fields (ISIN, Date, Type) will always be shown.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {fieldNames.map((field) => (
                  <div
                    key={field}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      tempSelectedFields.includes(field)
                        ? "bg-blue-100 border-blue-300"
                        : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                    }`}
                    onClick={() => {
                      setTempSelectedFields((prev) =>
                        prev.includes(field)
                          ? prev.filter((f) => f !== field)
                          : [...prev, field]
                      );
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">
                        {filedLabels[field] || field}
                      </h4>
                      <div
                        className={`w-5 h-5 rounded border ${
                          tempSelectedFields.includes(field)
                            ? "bg-blue-500 border-blue-500 flex items-center justify-center"
                            : "border-gray-300"
                        }`}
                      >
                        {tempSelectedFields.includes(field) && (
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="3"
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setTempSelectedFields([])}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setIsFilterModalOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const cleanFields = Array.from(new Set(tempSelectedFields));
                    setSelectedFields(cleanFields);
                    setIsFilterModalOpen(false);
                  }}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Apply Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserBenposeData;
