"use client";
import ViewDataTable from "@/components/dataTables/ViewDataTable";
import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";

const ViewRecoDatewise = () => {
  const [date, setDate] = useState(""); // State for the date input
  const [tableData, setTableData] = useState([]); // State for storing the table data
  const [loading, setLoading] = useState(false); // Loading state
  const jRef = useRef(1); // Reference for row index
  const eventSourceRef = useRef(null); // Reference for managing EventSource connection
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Column configuration for the table
  const columns = [
    { header: "ISIN", accessorKey: "isin" },
    { header: "Company Name", accessorKey: "companyName" },
    { header: "Date", accessorKey: "key" },
    { header: "C Open", accessorKey: "cdsl_past_close" },
    { header: "C Demat", accessorKey: "c_demat" },
    { header: "C CA", accessorKey: "c_ca" },
    { header: "C In", accessorKey: "cin" },
    { header: "C Remat", accessorKey: "cremat" },
    { header: "C Out", accessorKey: "cout" },
    { header: "C Close", accessorKey: "c_close" },
    { header: "N Open", accessorKey: "nsdl_past_close" },
    { header: "N Demat", accessorKey: "n_demat" },
    { header: "N CA", accessorKey: "n_ca" },
    { header: "N In", accessorKey: "nin" },
    { header: "N Remat", accessorKey: "nremat" },
    { header: "N Out", accessorKey: "nout" },
    { header: "N Close", accessorKey: "n_close" },
    { header: "Physical", accessorKey: "physical" },
    { header: "Total", accessorKey: "total" },
    { header: "Remarks", accessorKey: "remarks" },
  ];

  const formatDate = (inputDate) => {
    const d = new Date(inputDate);
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = monthNames[d.getMonth()];
    const day = d.getDate().toString().padStart(2, "0");
    const year = d.getFullYear();
    return `${month} ${day}, ${year}`;
  };

  // Function to append new rows with an increasing index to the table data
  // const appendDataToTable = (items) => {
  //   setTableData((prev) =>
  //     items.map((item) => ({ index: jRef.current++, ...item })).concat(prev)
  //   );
  // };

  const appendDataToTable = (items) => {
    setTableData((prev) => [
      ...prev, // This keeps the previous data
      ...items.map((item) => ({ index: jRef.current++, ...item })), // Add new data at the end
    ]);
  };

  // Function to start or reopen the EventSource connection for streaming data
  const startStream = (formattedDate) => {
    console.log("Stream Started");
    if (eventSourceRef.current) {
      console.log("Closing previous EventSource connection.");
      eventSourceRef.current.close();
    }
    const url = `${apiUrl}/v2/admin/reconcillation/get-reco-datewise?date=${encodeURIComponent(
      formattedDate
    )}`;
    console.log("Starting new EventSource connection to:", url);
    const es = new EventSource(url, { withCredentials: true });

    // Event listener for incoming messages from the server
    es.onmessage = (e) => {
      console.log("Received message from SSE:", e.data);
      try {
        const parsed = JSON.parse(e.data);
        const batch = Array.isArray(parsed) ? parsed : [parsed];
        appendDataToTable(batch);
      } catch (err) {
        console.error("SSE JSON parse error:", err);
      }
    };

    // Event listener for errors in the SSE connection
    es.onerror = (err) => {
      console.error("SSE error:", err);
      toast.error("Connection lost. Trying to reconnect...");
      es.close();
    };

    es.onclose = () => {
      console.log("Stream closed by backend.");
      setLoading(false); // Hide loading indicator
      toast.success("Stream has finished loading data.");
    };

    eventSourceRef.current = es;
  };

  // Simple handleSubmit function without debounce
  const handleSubmit = (e) => {
    console.log("Submit button clicked.");
    e.preventDefault(); // Prevent form submission (reload)
    if (!date || !isValidDate(date)) {
      toast.error("Please select a valid date");
      console.error("Invalid date selected:", date);
      return;
    }

    const formatted = formatDate(date);
    console.log("Formatted date:", formatted);
    setLoading(true); // Show loading feedback
    startStream(formatted);
  };

  const isValidDate = (dateString) => {
    const d = new Date(dateString);
    const isValid = !isNaN(d.getTime()); // Returns true if it's a valid date
    if (!isValid) {
      console.error("Invalid date string:", dateString);
    }
    return isValid;
  };

  const downloadExcel = (e) => {
    e.preventDefault();
    toast.info("Excel download not implemented yet");
  };

  // Cleanup EventSource when component unmounts
  useEffect(() => {
    return () => {
      console.log("Component unmounting, closing EventSource connection.");
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  return (
    <div className="p-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row items-center md:justify-between">
          <h5 className="text-lg font-semibold mb-2">Reconciliation List</h5>
        </div>
      </div>

      {/* Form */}
      <form className="flex flex-wrap mb-4 gap-4" onSubmit={handleSubmit}>
        <div className="w-full md:w-1/6">
          <input
            type="date"
            className="form-input w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={downloadExcel}
            className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Download Excel
          </button>
        </div>
      </form>

      <div className="overflow-x-auto">
        <ViewDataTable
          columns={columns}
          data={tableData}
          title="Reconciliation Data"
          isLoading={tableData.length === 0}
        />
      </div>
    </div>
  );
};

export default ViewRecoDatewise;
