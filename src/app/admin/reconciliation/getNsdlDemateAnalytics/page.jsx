"use client";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { apiConnector } from "@/utils/apihelper";
import ViewDataTable from "@/components/dataTables/ViewDataTable";

const GetNsdlDemateAnalytics = () => {
  const [data, setData] = useState([]);
  const [totalEntries, setTotalEntries] = useState(0);
  const [missingEntries, setMissingEntries] = useState(0);
  const [groupedDates, setGroupedDates] = useState({});
  const [loading, setLoading] = useState(true);
  const [hasMissingDates, setHasMissingDates] = useState(false);
  const [demateData, setDemateData] = useState([]);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const fetchNsdlDematData = async () => {
    try {
      const response = await apiConnector(
        "GET",
        `${apiUrl}/v2/admin/actionHistory/get-nsdl-demat-analytics`
      );
      const responseData = response.data.result;
      setData(responseData.data || []);
      setDemateData(responseData.data || []);
      setTotalEntries(responseData.totalEntries);
      setMissingEntries(responseData.missingEntries);
      setGroupedDates(responseData.groupedDates || {});
      setHasMissingDates(
        responseData.groupedDates &&
          Object.keys(responseData.groupedDates).length > 0
      );
      setLoading(false);
    } catch (error) {
      const errMsg = error.response.data.message;
      toast.error(errMsg || "An error occurred while processing the request.");
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNsdlDematData();
  }, []);

  // Create table data structure from grouped dates using useMemo
  const missingDatesTableData = useMemo(() => {
    if (!hasMissingDates) return [];

    const daysOfWeek = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    const maxRows = Math.max(
      ...daysOfWeek.map((day) => (groupedDates[day] || []).length),
      0
    );

    // Generate rows for the table
    const rows = [];
    for (let i = 0; i < maxRows; i++) {
      const row = {};
      daysOfWeek.forEach((day) => {
        row[day] =
          groupedDates[day] && groupedDates[day][i] ? groupedDates[day][i] : "";
      });
      rows.push(row);
    }

    return rows;
  }, [groupedDates, hasMissingDates]);

  // Define columns for missing dates table
  const missingDatesColumns = useMemo(() => {
    const daysOfWeek = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];

    return daysOfWeek.map((day) => ({
      header: day,
      accessorKey: day,
      cell: (info) => info.getValue() || "-",
    }));
  }, []);

  // Define columns for demat entries table
  const dematColumns = useMemo(
    () => [
      {
        header: "Date",
        accessorKey: "date",
        cell: (info) => info.row.original.date,
      },
      {
        header: "Status",
        accessorKey: "n",
        cell: (info) => info.row.original.n,
      },
    ],
    []
  );

  return (
    <>
      <div class="flex space-x-4">
        <div class="flex-1 bg-white shadow-lg rounded-lg p-6">
          <h3 class="text-lg font-semibold">Total Entries</h3>
          <p class="text-2xl font-bold">{totalEntries}</p>
        </div>

        <div class="flex-1 bg-white shadow-lg rounded-lg p-6">
          <h3 class="text-lg font-semibold">Missing Date</h3>
          <p class="text-2xl font-bold">{missingEntries}</p>
        </div>
      </div>

      <div className="card mt-4">
        <div className="card-body">
          <h3 className="card-title">
            Missing Dates Grouped by Days of the Week
          </h3>

          {hasMissingDates ? (
            <ViewDataTable
              title="Missing Dates"
              columns={missingDatesColumns}
              data={missingDatesTableData}
              loading={loading}
            />
          ) : (
            <div className="alert alert-info">No missing dates found.</div>
          )}
        </div>
      </div>

      <div className="card mt-4">
        <div className="card-body">
          <h3 className="card-title">Demat Entries</h3>

          {demateData && demateData.length > 0 ? (
            <ViewDataTable
              title="Demat Entries"
              columns={dematColumns}
              data={demateData}
              loading={loading}
            />
          ) : (
            <div className="alert alert-info">No demat data available.</div>
          )}
        </div>
      </div>
    </>
  );
};

export default GetNsdlDemateAnalytics;
