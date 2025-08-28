import React, { useEffect, useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { usePathname, useRouter } from "next/navigation";

const DataTable = ({ columns, data, title, columnFilter = false }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [columnFilters, setColumnFilters] = useState({});
  const [filteredData, setFilteredData] = useState(data);
  const [activeTypeTab, setActiveTypeTab] = useState("All");
  const [activePeriodTab, setActivePeriodTab] = useState("7 Days");
  const router = useRouter();
  const pathname = usePathname();

  const getInitialCategory = () => {
    if (pathname.includes("/admin/privateIsin")) return "private";
    if (pathname.includes("/admin/unlistedIsin")) return "unlisted";
    if (pathname.includes("/admin/listedIsin")) return "listed";
    return "all";
  };

  // Initialize selectedCategory based on current route
  const [selectedCategory, setSelectedCategory] = useState(
    getInitialCategory()
  );

  // Update selectedCategory when route changes
  useEffect(() => {
    setSelectedCategory(getInitialCategory());
  }, [pathname]);

  // Toggle cycle filter function
  const toggleCycleFilter = (column) => {
    const { accessorKey, cycleValues = [] } = column;
    if (
      !accessorKey ||
      !Array.isArray(cycleValues) ||
      cycleValues.length === 0
    ) {
      return; // No cycle values, do nothing
    }

    setColumnFilters((prev) => {
      const current = prev[accessorKey] || "";
      // If current is empty, use the first cycle value
      if (!current) {
        return { ...prev, [accessorKey]: cycleValues[0] };
      }
      // Otherwise, find the index of the current filter
      const idx = cycleValues.findIndex(
        (v) => v.toLowerCase() === current.toLowerCase()
      );
      // If not found or at the end of array, reset to ""
      if (idx === -1 || idx === cycleValues.length - 1) {
        return { ...prev, [accessorKey]: "" };
      } else {
        // Move to the next value
        return { ...prev, [accessorKey]: cycleValues[idx + 1] };
      }
    });
  };

  // Combine global search + column filters (including dynamic cycle filters)
  const filterData = () => {
    const globalSearch = searchTerm.toLowerCase();

    const filtered = data.filter((row) => {
      // Global search: if searchTerm is provided, at least one column must match
      const matchesGlobal =
        globalSearch === "" ||
        columns.some((col) => {
          const value = row[col.accessorKey];
          return value?.toString().toLowerCase().includes(globalSearch);
        });

      // Column-specific filters (cycle or text-based)
      const matchesColumns = Object.keys(columnFilters).every((accessorKey) => {
        const filterValue = columnFilters[accessorKey];
        if (!filterValue) return true; // no filter => OK

        const column = columns.find((c) => c.accessorKey === accessorKey);
        const cellValue = row[accessorKey];

        if (column?.cycleFilter) {
          // For cycle filter columns, do exact matching
          return (
            cellValue?.toString().toLowerCase() === filterValue.toLowerCase()
          );
        } else {
          // For normal text filters, do "contains"
          return cellValue
            ?.toString()
            .toLowerCase()
            .includes(filterValue.toLowerCase());
        }
      });

      return matchesGlobal && matchesColumns;
    });

    setFilteredData(filtered);
  };

  // Re-filter when data, global search, or column filters change
  useEffect(() => {
    filterData();
  }, [data, searchTerm, columnFilters]);

  // Create the TanStack table
  const table = useReactTable({
    columns,
    data: filteredData,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageIndex: 0, pageSize: 10 } },
    // Allow unsorted state
  });

  // ---- Export / Copy Functions ----

  const exportCSV = () => {
    const csvContent = [
      columns.map((col) => col.header).join(","),
      ...filteredData.map((row) =>
        columns.map((col) => row[col.accessorKey] || "").join(",")
      ),
    ].join("\n");

    saveAs(
      new Blob([csvContent], { type: "text/csv;charset=utf-8;" }),
      "data.csv"
    );
  };

  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, "data.xlsx");
  };

  const copyToClipboard = () => {
    const text = [
      columns.map((col) => col.header).join("\t"),
      ...filteredData.map((row) =>
        columns.map((col) => row[col.accessorKey] || "").join("\t")
      ),
    ].join("\n");

    navigator.clipboard
      .writeText(text)
      .then(() => alert("Copied table data to clipboard!"))
      .catch((err) => console.error("Failed to copy: ", err));
  };

  // ---- Page Number Generation (existing logic) ----
  const generatePageNumbers = () => {
    const totalPages = table.getPageCount();
    const currentPage = table.getState().pagination.pageIndex;
    const pages = [];

    if (totalPages <= 7) {
      for (let i = 0; i < totalPages; i++) pages.push(i);
    } else {
      if (currentPage > 3) pages.push(0, "...");
      for (
        let i = Math.max(0, currentPage - 2);
        i <= Math.min(totalPages - 1, currentPage + 2);
        i++
      ) {
        pages.push(i);
      }
      if (currentPage < totalPages - 3) pages.push("...", totalPages - 1);
    }

    return pages;
  };

  // Optionally render text-based column filters (for columns without cycleFilter)
  const renderColumnFilters = () => {
    if (!columnFilter) return null;
    return (
      <tr className="bg-gray-50">
        {columns.map((column) => (
          <td key={column.accessorKey} className="p-1">
            {/* If the column has a cycleFilter, skip rendering the text filter */}
            {!column.cycleFilter && (
              <input
                type="text"
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:border-blue-400"
                placeholder={`Filter ${column.header}`}
                value={columnFilters[column.accessorKey] || ""}
                onChange={(e) =>
                  setColumnFilters((prev) => ({
                    ...prev,
                    [column.accessorKey]: e.target.value,
                  }))
                }
              />
            )}
          </td>
        ))}
      </tr>
    );
  };

  // For convenience, extract pagination info
  const { pageIndex, pageSize } = table.getState().pagination;
  const totalRows = filteredData.length;

  // Handler for category changes
  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);

    // Navigate based on the selected category
    switch (category) {
      case "all":
        router.push("/admin/allIsin");
        break;
      case "private":
        router.push("/admin/privateIsin");
        break;
      case "unlisted":
        router.push("/admin/unlistedIsin");
        break;
      case "listed":
        router.push("/admin/listedIsin");
        break;
      default:
        break;
    }
  };

  // Tab configurations
  // const typeTabs = ["All", "Demat", "Transmission", "Duplicate", "KYC", "Others", "Extra"];
  // const periodTabs = ["7 Days", "15 Days", "30 Days", "More than 30 Days"];

  return (
    <div className="bg-white">
      {/* Tab Navigation - Only one set of tabs */}
      <div className="px-4 pt-4">
        {/* Type Tabs */}
        {/* <div className="flex border-b border-gray-200 mb-4">
          {typeTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTypeTab(tab)}
              className={`px-4 py-2 text-sm font-medium transition-colors duration-200 border-b-2 ${
                activeTypeTab === tab
                  ? "text-red-600 border-red-600"
                  : "text-gray-600 border-transparent hover:text-red-500 hover:border-red-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div> */}

        {/* Period Tabs */}
        {/* <div className="flex mb-4">
          {periodTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActivePeriodTab(tab)}
              className={`px-4 py-2 text-sm font-medium transition-colors duration-200 border-b-2 ${
                activePeriodTab === tab
                  ? "text-red-600 border-red-600"
                  : "text-gray-600 border-transparent hover:text-red-500 hover:border-red-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div> */}
      </div>

      {/* Controls Section */}
      <div className="px-4 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Export Buttons */}
            <div className="flex items-center gap-2">
              <button
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                onClick={copyToClipboard}
              >
                Copy
              </button>
              <button
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                onClick={exportExcel}
              >
                Excel
              </button>
              {/* <button
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                onClick={exportCSV}
              >
                CSV
              </button> */}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* ISIN Category Dropdown */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">
                ISIN Category:
              </label>
              <select
                className="px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-400"
                value={selectedCategory}
                onChange={handleCategoryChange}
              >
                <option value="all">All ISIN</option>
                <option value="private">Private ISIN</option>
                <option value="unlisted">Unlisted ISIN</option>
                <option value="listed">Listed ISIN</option>
              </select>
            </div>

            {/* Search Input */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">
                Search:
              </label>
              <input
                type="text"
                className="px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-400"
                placeholder="Global Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Show Entries */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Show</label>
              <select
                className="px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-400"
                value={pageSize}
                onChange={(e) => {
                  table.setPageSize(Number(e.target.value));
                  table.setPageIndex(0);
                }}
              >
                {[10, 25, 50, 100].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              <label className="text-sm font-medium text-gray-700">
                entries
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Table Container with Horizontal Scroll */}
      <div className="px-4">
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-max">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className="bg-gray-100">
                    {headerGroup.headers.map((header) => {
                      const colDef = header.column.columnDef;
                      const accessorKey = colDef.accessorKey;
                      const canSort = header.column.getCanSort();
                      const isSorted = header.column.getIsSorted(); // "asc", "desc", or false

                      // Three-state toggle: unsorted -> asc -> desc -> unsorted
                      const onClickHandler = () => {
                        if (colDef.cycleFilter) {
                          toggleCycleFilter(colDef);
                        } else if (canSort) {
                          if (!isSorted) {
                            header.column.toggleSorting("asc");
                          } else if (isSorted === "asc") {
                            header.column.toggleSorting("desc");
                          } else if (isSorted === "desc") {
                            header.column.toggleSorting(false);
                          }
                        }
                      };

                      const currentCycleFilter =
                        (accessorKey && columnFilters[accessorKey]) || "";

                      return (
                        <th
                          key={header.id}
                          className={`px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap ${
                            canSort || colDef.cycleFilter
                              ? "cursor-pointer hover:bg-gray-200"
                              : ""
                          }`}
                          onClick={onClickHandler}
                        >
                          <div className="flex items-center gap-1 group">
                            {flexRender(colDef.header, header.getContext())}
                            {canSort && (
                              <>
                                {isSorted === "asc" && (
                                  <span className="text-xs text-blue-600">
                                    ▲
                                  </span>
                                )}
                                {isSorted === "desc" && (
                                  <span className="text-xs text-blue-600">
                                    ▼
                                  </span>
                                )}
                                {isSorted === false && (
                                  <span className="text-xs opacity-0 group-hover:opacity-50 transition-opacity">
                                    ⇅
                                  </span>
                                )}
                              </>
                            )}
                            {colDef.cycleFilter && currentCycleFilter && (
                              <span className="text-xs bg-blue-100 text-blue-700 px-1 rounded">
                                {currentCycleFilter}
                              </span>
                            )}
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                ))}
                {renderColumnFilters()}
              </thead>

              <tbody className="bg-white">
                {table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map((row, index) => (
                    <tr
                      key={row.id}
                      className="hover:bg-blue-50 transition-colors border-b border-gray-200"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="px-3 py-3 text-sm text-gray-900 whitespace-nowrap"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="px-3 py-8 text-center text-sm text-gray-500"
                    >
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4 px-4 pb-4">
        <span className="text-sm text-gray-600">
          Showing {pageIndex * pageSize + 1} to{" "}
          {Math.min((pageIndex + 1) * pageSize, totalRows)} of {totalRows}{" "}
          entries
        </span>

        <div className="flex items-center gap-1">
          <button
            className="px-3 py-2 text-sm border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </button>

          {generatePageNumbers().map((page, index) =>
            typeof page === "number" ? (
              <button
                key={index}
                className={`w-8 h-8 text-sm rounded transition-colors ${
                  table.getState().pagination.pageIndex === page
                    ? "bg-gray-500 text-white"
                    : "bg-white text-gray-700"
                }`}
                onClick={() => table.setPageIndex(page)}
              >
                {page + 1}
              </button>
            ) : (
              <span key={index} className="text-gray-500  px-2">
                ...
              </span>
            )
          )}

          <button
            className="px-3 py-2 text-sm border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
