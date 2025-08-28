"use client";
import React from "react";

export const GridSection = ({ children }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-6">
    {children}
  </div>
);

const OutwardAnalyticsCard = ({
  title,
  count,
  color = "yellow",
  icon,
  onCheckNow,
}) => {
  const bgColors = {
    yellow: "bg-white border-yellow-300",
    green: "bg-green-100 border-green-500",
    red: "bg-red-100 border-red-500",
    orange: "bg-orange-100 border-orange-400",
  };

  const btnColors = {
    yellow: "bg-yellow-500 hover:bg-yellow-600 text-white",
    green: "bg-green-500 hover:bg-green-600 text-white",
    red: "bg-red-500 hover:bg-red-600 text-white",
    black: "bg-gray-800 hover:bg-gray-900 text-white",
    orange: "bg-orange-500 hover:bg-orange-600 text-white",
  };
  return (
    <>
      {/* <div className="card balance-card">
        <div className="card-header">
          <h3 className="font-semibold mb-2">{title}</h3>
        </div>
        <div className="card-body">
          <h2 className="text-3xl font-semibold mb-2">
            {count} {icon && <span>{icon}</span>}
          </h2>
          <button
            className={`btn get-cname ${btnColors[color]}`}
            onClick={onCheckNow}
          >
            check now
          </button>
        </div>
      </div> */}
      <div className="rounded-lg shadow p-4 border bg-white">
        <h3 className="font-semibold text-sm text-gray-700 mb-2">{title}</h3>
        <h2 className="text-2xl font-bold mb-4 text-black">
          {count} {icon && <span className="ml-1">{icon}</span>}
        </h2>
        <button
          className={`px-4 py-2 text-sm rounded ${btnColors[color]} transition`}
          onClick={onCheckNow}
        >
          Check now
        </button>
      </div>
    </>
  );
};

export default OutwardAnalyticsCard;
