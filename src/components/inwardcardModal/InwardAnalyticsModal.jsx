"use client";
import React from "react";

const InwardAnalyticsModal = ({ isOpen, onClose, data }) => {
  const modalData = data?.data;
  console.log({ modaldata: modalData });
  if (!isOpen) return null;
  const title = data?.message;
  console.log({ title });

  return (
    <div
      className={`fixed inset-0 w-full h-full min-h-screen px-3 flex items-center justify-center bg-black/50 z-[9999] transition duration-300 modal-backdrop`}
    >
      <div
        className="fixed inset-0 w-full h-full min-h-screen"
        onClick={onClose}
      ></div>
      <div
        className={`relative w-full h-full max-w-3xl max-h-[90%] text-black bg-white shadow shadow-black/5 rounded-lg overflow-hidden z-[99999] transition duration-300 modal-animation`}
      >
        <div className="w-full p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} className="p-2">
            ✖
          </button>
        </div>

        <div className="px-4 pb-4 pt-2 max-h-[90%] overflow-y-auto">
          {Array.isArray(modalData) && modalData?.length > 0 ? (
            <>
              <ul className="list-decimal pl-4 space-y-1">
                {modalData?.map((item, index) => (
                  <li key={index}>{item?.ref}</li>
                ))}
              </ul>
            </>
          ) : (
            <p className="text-gray-500">No ISIN data available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InwardAnalyticsModal;
