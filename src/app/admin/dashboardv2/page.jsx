"use client";

import DataTable from "@/components/dataTables/DataTable";
import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Archive, Eye, File, FileText, Upload } from "react-feather";
import { apiConnector } from "@/utils/apihelper";

const Dashboard = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("");
  const [activeDayFilter, setActiveDayFilter] = useState("");
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const handleAddUpdateIcon = () =>
    router.push("/admin/isin/get-full-isin-data");
  const handleAddUpdateFileIcon = () =>
    router.push("/admin/isin/get-isin-data");
  const handleAddUpdateDelteFileIcon = () =>
    router.push("/admin/isin/get-isin-info-data");
  const handleUpdateIsinMediaFile = () =>
    router.push("/admin/isin/edit-isin-media");
  const handleAddUpdateBanposeData = () =>
    router.push("/admin/isin/uploadbenposdata");

  useEffect(() => {
    apiConnector(
      "GET",
      `${apiUrl}/v2/admin/dashboard?table=b_inward&isin=b_isin`
    )
      .then((response) => {
        const responseData = response.data.result || {};
        setData(responseData);

        const categories = Object.keys(responseData);
        if (categories.length > 0) {
          const defaultCategory = categories[0];
          setActiveCategory(defaultCategory);

          const defaultFilters = Object.entries(responseData[defaultCategory]);
          const nonEmptyFilter = defaultFilters.find(
            ([_, val]) => val.length > 0
          );
          setActiveDayFilter(
            nonEmptyFilter ? nonEmptyFilter[0] : defaultFilters[0][0]
          );
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  const categories = useMemo(() => Object.keys(data), [data]);

  const dayFilters = useMemo(() => {
    return activeCategory && data[activeCategory]
      ? Object.keys(data[activeCategory])
      : [];
  }, [data, activeCategory]);

  const filteredData = useMemo(() => {
    if (!activeCategory || !activeDayFilter) return [];
    return data[activeCategory]?.[activeDayFilter] || [];
  }, [data, activeCategory, activeDayFilter]);

  const dayFilterLabels = {
    "7days": "7 Days",
    "15days": "15 Days",
    "30days": "30 Days",
    morethan30days: "More than 30 Days",
  };

  const columns = useMemo(
    () => [
      { header: "#", accessorKey: "index", cell: (info) => info.row.index + 1 },
      { header: "Day Elapsed", accessorKey: "daysElapsed" },
      { header: "Inward Date", accessorKey: "date" },
      { header: "Ref No.", accessorKey: "ref" },
      { header: "ISIN", accessorKey: "isin" },
      {
        header: "Company",
        accessorKey: "cin",
        cell: ({ row }) => {
          const { ct, cin } = row.original;
          return (
            <div>
              {cin}{" "}
              {/* {ct === "CDSL" && (
                <span className="badge badge-success ml-1">{ct}</span>
              )}
              {ct === "NSDL" && (
                <span className="badge badge-info ml-1">{ct}</span>
              )}
              {ct === "CDSL,NSDL" && (
                <>
                  <span className="badge badge-success ml-1">CDSL</span>
                  <span className="badge badge-info ml-1">NSDL</span>
                </>
              )} */}
            </div>
          );
        },
      },
      { header: "Sender", accessorKey: "sender" },
      { header: "Type", accessorKey: "type" },
      { header: "Sub Type", accessorKey: "sub_type" },
      { header: "Location", accessorKey: "location" },
      {
        header: "Status",
        accessorKey: "status",
        cell: ({ getValue }) => {
          switch (getValue()) {
            case 1:
              return (
                <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                  Approved
                </span>
              );
            case 2:
              return <span className="badge badge-warning">Pending</span>;
            case 3:
              return <span className="badge badge-error">Rejected</span>;
            case 4:
              return <span className="badge badge-error">Deleted</span>;
            case 5:
              return (
                <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                  Partially Approved
                </span>
              );
            default:
              return "Unknown";
          }
        },
      },
      {
        header: "View",
        accessorKey: "",
        cell: ({ row }) => {
          const rowData = row.original;
          return (
            <Link
              target="_blank"
              href={`/admin/inward/viewInward/${encodeURIComponent(
                rowData.ref
              )}`}
            >
              <Eye className="text-green-500" size={18} />
            </Link>
          );
        },
      },
    ],
    []
  );

  return (
    <>
      <div className="w-full  overflow-x-auto">
        <div className="card w-full">
          <div className="card-header">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-lg font-semibold mb-2.5">Inward Report</h2>
              {/* <div className="flex items-center justify-end gap-2">
                <button type="button" onClick={handleAddUpdateIcon}>
                  <File />
                </button>
                <button type="button" onClick={handleAddUpdateFileIcon}>
                  <Upload />
                </button>
                <button type="button" onClick={handleAddUpdateDelteFileIcon}>
                  <Archive />
                </button>
                <button type="button" onClick={handleUpdateIsinMediaFile}>
                  <FileText />
                </button>
                <button type="button" onClick={handleAddUpdateBanposeData}>
                  <FileText />
                </button>
              </div> */}
            </div>
          </div>

          <div className="card-body">
            <div className="flex gap-2 mb-4 flex-wrap">
              {categories.map((category) => {
                const isActive = activeCategory === category;
                return (
                  <button
                    key={category}
                    onClick={() => {
                      setActiveCategory(category);
                      const filters = Object.entries(data[category]);
                      const nonEmptyFilter = filters.find(
                        ([, val]) => val.length > 0
                      );
                      setActiveDayFilter(
                        nonEmptyFilter ? nonEmptyFilter[0] : filters[0][0]
                      );
                    }}
                    className={`px-4 py-2 rounded-md text-sm font-medium border ${
                      isActive
                        ? "bg-gray-100 text-black border-gray-300"
                        : "text-red-500 border-transparent hover:bg-gray-50"
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>

            {activeCategory && (
              <div className="flex gap-2 mb-4 flex-wrap">
                {dayFilters.map((day) => {
                  const isActive = activeDayFilter === day;
                  return (
                    <button
                      key={day}
                      onClick={() => setActiveDayFilter(day)}
                      className={`px-4 py-2 rounded-md text-sm font-medium border ${
                        isActive
                          ? "bg-gray-100 text-black border-gray-300"
                          : "text-red-500 border-transparent hover:bg-gray-50"
                      }`}
                    >
                      {dayFilterLabels[day] || day}
                    </button>
                  );
                })}
              </div>
            )}

            {filteredData.length === 0 ? (
              <p className="text-gray-500 text-sm">
                No records found for this filter.
              </p>
            ) : (
              <div className="w-full overflow-x-auto">
                <DataTable
                  title="Inward Report"
                  columns={columns}
                  data={filteredData}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
