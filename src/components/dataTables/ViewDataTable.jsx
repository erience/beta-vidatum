import React, { useEffect, useRef, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import SkeletonRow from "../loader/SkeletonRow";
import { toast } from "react-toastify";

const ViewDataTable = ({
  columns,
  data,
  title,
  columnFilter = false,
  headerIcons,
  isLoading = false,
  description,
  alertType = "info",
  cardHeader,
  totalCount,
  pagination,
  setPagination,
  onPageChange,
  onSearch,
  searchTerm,
}) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm || "");
  const [columnFilters, setColumnFilters] = useState({});
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(isLoading);
  const [sorting, setSorting] = useState([]);
  const [localPagination, setLocalPagination] = useState(
    pagination || { pageIndex: 0, pageSize: 10 }
  );
  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  useEffect(() => {
    if (pagination) {
      setLocalPagination(pagination);
    }
  }, [pagination]);

  useEffect(() => {
    if (searchTerm !== undefined) {
      setLocalSearchTerm(searchTerm);
    }
  }, [searchTerm]);

  useEffect(() => {
    if (!isLoading) {
      if (onPageChange && totalCount) {
        setFilteredData(data || []);
      } else {
        filterData();
      }
    }
  }, [data, localSearchTerm, columnFilters, isLoading, onPageChange, totalCount]);

  // Improved function to match search term with column value
  const matchesSearchTerm = (value, searchTerm) => {
    if (!searchTerm) return true;
    if (value === null || value === undefined) return false;

    // Convert both to lowercase strings and trim whitespace
    const valueStr = String(value).trim().toLowerCase();
    const searchStr = searchTerm.trim().toLowerCase();

    // Handle empty search or value
    if (!searchStr) return true;
    if (!valueStr) return false;

    // Split search term into words for multi-word search
    const searchWords = searchStr.split(/\s+/).filter(word => word.length > 0);
    
    // If it's a single word, use simple includes
    if (searchWords.length === 1) {
      return valueStr.includes(searchWords[0]);
    }

    // For multi-word search, check if all words are present in the value
    // This handles cases like "equity share" matching "Equity Shares"
    return searchWords.every(word => valueStr.includes(word));
  };

  // Filter data based on search term and column filters
  const filterData = () => {
    if (!Array.isArray(data)) {
      setFilteredData([]);
      return;
    }

    const globalSearch = localSearchTerm.trim().toLowerCase();

    const filtered = data.filter((row) => {
      if (!globalSearch) return true;

      return columns.some((col) => {
        const rawValue = row[col.accessorKey];
        const value = col.searchFormatter ? col.searchFormatter(rawValue) : rawValue;

        return matchesSearchTerm(value, globalSearch);
      });
    });

    setFilteredData(filtered);
  };

  // Handle search term input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalSearchTerm(value);

    if (onSearch) {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      searchTimeoutRef.current = setTimeout(() => {
        onSearch(value);
      }, 500);
    }
  };

  // Handle pagination changes
  const handlePaginationChange = (updater) => {
    const newPagination =
      typeof updater === "function" ? updater(localPagination) : updater;

    setLocalPagination(newPagination);
    if (setPagination) setPagination(newPagination);
    if (onPageChange) onPageChange(newPagination);
  };

  // Set up table instance
  const table = useReactTable({
    columns,
    data: filteredData,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onPaginationChange: handlePaginationChange,
    manualPagination: !!onPageChange,
    pageCount: onPageChange
      ? Math.ceil((totalCount || 0) / localPagination.pageSize)
      : Math.ceil(filteredData.length / localPagination.pageSize),
    state: {
      pagination: localPagination,
      sorting,
    },
    initialState: {
      pagination: { pageIndex: 0, pageSize: 10 },
    },
    getRowId: (row, index) =>
      `${index}-${row?.f_pan || row?.label || row?.type || index}`,
  });

  // Export functions
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Data Export", 14, 15);

    const filteredColumns = columns.filter(
      (col) => col.header?.toLowerCase() !== "sr.no"
    );

    const tableColumn = [
      "Sr. No.",
      ...filteredColumns.map((col) =>
        typeof col.header === "string" ? col.header.replace("#", "").trim() : ""
      ),
    ];

    const tableRows = filteredData.map((row, index) => {
      const rowData = [index + 1];
      filteredColumns.forEach((col) => {
        const value = row[col.accessorKey];
        rowData.push(
          value === null || value === undefined || typeof value === "object"
            ? ""
            : value
        );
      });
      return rowData;
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("data.pdf");
  };

  const exportCSV = () => {
    const csvContent = [
      columns.map((col) => col.header || "").join(","),
      ...filteredData.map((row) =>
        columns
          .map((col) =>
            (row[col.accessorKey] || "").toString().replace(/,/g, ";")
          )
          .join(",")
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "data.xlsx");
  };

  const copyToClipboard = () => {
    const text = [
      columns.map((col) => col.header || "").join("\t"),
      ...filteredData.map((row) =>
        columns.map((col) => row[col.accessorKey] || "").join("\t")
      ),
    ].join("\n");

    navigator.clipboard
      .writeText(text)
      .then(() => toast.success("Copied to clipboard"))
      .catch(() => toast.error("Copy failed"));
  };

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

  const { pageIndex, pageSize } = table.getState().pagination;
  const totalRows = totalCount ?? filteredData.length;

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="card">
      <div className="card-header">
        <div className="relative">
          {title && <h5 className="text-xl font-semibold">{title}</h5>}
          {headerIcons && (
            <div className="absolute top-[-10] right-0 flex items-center gap-2">
              {headerIcons}
            </div>
          )}
          {cardHeader && <h1 className="text-sm mt-2">{cardHeader}</h1>}
        </div>

        {description && (
          <div
            className={`p-3 mt-2 rounded ${
              alertType === "info"
                ? "bg-blue-50 text-blue-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {description}
          </div>
        )}
      </div>

      <div className="card-body">
        <div className="block sm:flex justify-between items-center flex-wrap gap-3 mb-3">
          <div className="flex items-center gap-2 mt-2.5">
            <button
              type="button"
              className="w-14 h-8 border border-gray-300 text-sm bg-white rounded hover:bg-gray-100"
              onClick={copyToClipboard}
            >
              copy
            </button>
            <button
              type="button"
              className="w-14 h-8 border border-gray-300 text-sm bg-white rounded hover:bg-gray-100"
              onClick={exportExcel}
            >
              Excel
            </button>
          </div>

          <div className="block sm:flex items-center gap-2 ml-auto">
            <label htmlFor="search" className="text-sm text-gray-700">
              Search:
            </label>
            <input
              id="search"
              type="text"
              value={localSearchTerm}
              onChange={handleSearchChange}
              placeholder="Search..."
              className="border border-gray-300 px-2 py-1 rounded text-sm"
            />
          </div>
        </div>

        <div className="mt-5 overflow-x-auto border border-gray-200 rounded-md shadow-sm bg-white">
          <table className="table w-full text-sm text-black whitespace-nowrap border border-gray-300">
            <thead className="bg-gray-100 text-[13px] uppercase">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      className="px-3 py-2 text-left border-b border-gray-300 font-medium cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-1">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getCanSort() && (
                          <span className="text-xs">
                            {header.column.getIsSorted() === "asc"
                              ? "▲"
                              : header.column.getIsSorted() === "desc"
                              ? "▼"
                              : "⇅"}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {loading ? (
                [...Array(10)].map((_, i) => (
                  <SkeletonRow key={i} columnsCount={columns.length} />
                ))
              ) : table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-3 py-2 border-b border-gray-100"
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
                    className="text-center py-4 text-gray-500"
                  >
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="block sm:flex justify-between items-center mt-4">
          <span className="text-sm text-gray-600">
            Showing {pageIndex * pageSize + 1} to{" "}
            {Math.min((pageIndex + 1) * pageSize, totalRows)} of {totalRows}{" "}
            entries
          </span>

          <div className="flex flex-wrap items-center gap-2">
            <button
              className="inline-block py-2 px-3 text-sm !outline-none select-none disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </button>

            {generatePageNumbers().map((page, index) =>
              typeof page === "number" ? (
                <button
                  key={index}
                  className={`w-8 h-8 text-sm rounded border border-gray-300 hover:bg-gray-100 transition ${
                    table.getState().pagination.pageIndex === page
                      ? "bg-gray-500 text-white"
                      : "bg-white text-gray-700"
                  }`}
                  onClick={() => table.setPageIndex(page)}
                >
                  {page + 1}
                </button>
              ) : (
                <span key={index} className="text-gray-500 px-2">
                  ...
                </span>
              )
            )}

            <button
              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewDataTable;