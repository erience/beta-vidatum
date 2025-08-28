"use client"
import { useEffect, useState } from "react";

const useQueryParams = () => {
  const [queryParams, setQueryParams] = useState({});

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const entries = {};
      for (const [key, value] of params.entries()) {
        entries[key] = value;
      }
      setQueryParams(entries);
    }
  }, []);

  return queryParams;
};

export default useQueryParams;
