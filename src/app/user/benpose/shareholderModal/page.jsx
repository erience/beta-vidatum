"use client"
import  { useState, useEffect } from "react";

const ShareholderModal = ({
  isOpen,
  onClose,
  shareholderData,
  totalCount,
  categoryType,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto bg-black bg-opacity-50">
      <div className="relative w-full max-w-4xl p-4 mx-auto">
        <div className="bg-white rounded-lg shadow-xl">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-xl font-semibold">1% Shareholders</h3>
            <button
              onClick={onClose}
              className="p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <span className="text-2xl">&times;</span>
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-4 overflow-x-auto">
            <table className="w-full border-collapse table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th>SR.NO</th>
                  <th className="p-2 text-left border">PAN</th>
                  <th className="p-2 text-left border">Holder</th>
                  <th className="p-2 text-left border">Category</th>
                  <th className="p-2 text-left border">Total Shares</th>
                  <th className="p-2 text-left border">
                    % of Total Shareholding
                  </th>
                  <th className="p-2 text-left border">
                    Class X Voting Rights
                  </th>
                  <th className="p-2 text-left border">
                    Total as a % of Total Voting Rights
                  </th>
                  <th className="p-2 text-left border">Pledged Shares</th>
                  <th className="p-2 text-left border">
                    As a % of Total Shares
                  </th>
                  <th className="p-2 text-left border">Locked-In Shares</th>
                  <th className="p-2 text-left border">
                    As a % of Total Shares
                  </th>
                  <th className="p-2 text-left border">Demat Shares</th>
                </tr>
              </thead>
              <tbody>
                {shareholderData.length > 0 ? (
                  shareholderData.map((item, index) => {
                    const percentOfTotal = (
                      (parseFloat(item.total) * 100) /
                      totalCount
                    ).toFixed(2);
                    const percentPledged = (
                      (parseFloat(item.pledge || 0) * 100) /
                      parseFloat(item.total || 1)
                    ).toFixed(2);
                    const percentLocked = (
                      (parseFloat(item.lock || 0) * 100) /
                      parseFloat(item.total || 1)
                    ).toFixed(2);

                    return (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="p-2 border">{index + 1}</td>
                        <td className="p-2 border">{item.f_pan}</td>
                        <td className="p-2 border">{item.f_holder}</td>
                        <td className="p-2 border">{categoryType}</td>
                        <td className="p-2 border">
                          {parseFloat(item.total).toFixed(2)}
                        </td>
                        <td className="p-2 border">{percentOfTotal}</td>
                        <td className="p-2 border">
                          {parseFloat(item.total).toFixed(2)}
                        </td>
                        <td className="p-2 border">{percentOfTotal}</td>
                        <td className="p-2 border">
                          {parseFloat(item.pledge || 0).toFixed(2)}
                        </td>
                        <td className="p-2 border">{percentPledged}</td>
                        <td className="p-2 border">
                          {parseFloat(item.lock || 0).toFixed(2)}
                        </td>
                        <td className="p-2 border">{percentLocked}</td>
                        <td className="p-2 border">
                          {item.mode !== 3
                            ? parseFloat(item.total).toFixed(2)
                            : "0.00"}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={13} className="p-4 text-center border">
                      No Data Available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareholderModal;
