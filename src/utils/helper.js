import moment from "moment";

const importCSV = (file) => {
  return new Promise((resolve, reject) => {
    try {
      if (!file) {
        throw new Error("Please select a CSV file to upload.");
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const lines = text.split(/\r\n|\n/);

        if (lines.length < 2) {
          reject("CSV file is empty or does not contain data.");
          return;
        }

        // Detect delimiter (^ or ,)
        const isSpecial = lines[0].includes("^");
        const delimiter = isSpecial ? "^" : ",";

        // Get headers
        const headers = lines[0]
          .split(delimiter)
          .map((header) => header.trim());

        // Process data rows
        const entries = [];
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (line === "") continue;

          const values = line.split(delimiter).map((value) => value.trim());
          const entry = {};

          // Map headers to values
          headers.forEach((header, index) => {
            // Create a consistent key format
            const key = header.replace(/ /g, "").trim().toLowerCase();
            entry[key] = index < values.length ? values[index] : "";
          });

          entries.push(entry);
        }

        // Return both headers and entries
        resolve({
          originalHeaders: headers,
          processedHeaders: headers.map((h) =>
            h.replace(/ /g, "").trim().toLowerCase()
          ),
          entries,
        });
      };

      reader.onerror = () => {
        throw new Error("Failed to read file!");
      };

      reader.readAsText(file);
    } catch (error) {
      reject(error.message);
    }
  });
};

const formatDateLong = (dateStr) => {
  if (!dateStr) return "-";

  const date = new Date(dateStr);

  if (isNaN(date.getTime())) {
    // Invalid date
    return "-";
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

const formatDateShort = (dateString) => {
  if (dateString !== "0000-00-00") {
    const date = new Date(dateString);

    // Get the day, month, and year components
    const day = date.getDate();
    const month = date.getMonth() + 1; // Adding 1 because months are zero-based
    const year = date.getFullYear();

    // Format the components as strings
    return `${day}/${month}/${year}`;
  } else {
    // If date is "0000-00-00", return "---"
    return "---";
  }
};

//----------------------benpose formate-----------------------------
const formatDMY = (dateStr) => {
  if (
    !dateStr ||
    dateStr === "N/A" ||
    !moment(dateStr, "YYYY-MM-DD", true).isValid()
  ) {
    return "-";
  }
  return moment(dateStr, "YYYY-MM-DD").format("DD-MM-YYYY");
};

const formatYMD = (dateStr) => {
  return moment(dateStr, "DD-MM-YYYY").format("YYYY-MM-DD");
};

// utils/formatPeriodToDMY.js

export default function formatPeriodToDMY(periodStr) {
  if (!periodStr) return "";

  const [startStr, endStr] = periodStr.split("To").map((s) => s.trim());

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    if (isNaN(date)) return dateStr; // fallback if invalid
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return `${formatDate(startStr)} To ${formatDate(endStr)}`;
}

export { importCSV, formatDateLong, formatDateShort, formatDMY, formatYMD };
