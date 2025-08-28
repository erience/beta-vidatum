"use client";
import ViewDataTable from "@/components/dataTables/ViewDataTable";
import { apiConnector } from "@/utils/apihelper";
import { formatDateShort } from "@/utils/helper";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

const UserDemateHistoryNsdl = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  //----------------------fetch KYC data-----------------------------
  const fetchDemateHistory = async () => {
    try {
      const response = await apiConnector(
        "GET",
        `${apiUrl}/v2/user/reconciliation/demat-nsdl`
      );

      const responseData = response.data.result || [];
      console.log({ responseData });
      setData(responseData);
      setLoading(false);
    } catch (error) {
      const errMsg = error.response.data.message;
      toast.error(errMsg || "An error occurred while processing the request.");
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDemateHistory();
  }, []);

  //---------------------------dynamic column---------------------------
  const columns = useMemo(
    () => [
      { header: "ID", accessorKey: "id" },
      { header: "ISIN", accessorKey: "isin" },
      { header: "Record Type", accessorKey: "RecordType" },
      { header: "Line Number", accessorKey: "LineNumber" },
      { header: "DP ID", accessorKey: "DPID" },
      { header: "DEMAT Indicator", accessorKey: "DEMAT_Indicator" },
      { header: "DRN/RRN/CRN", accessorKey: "DRN_RRN_CRN" },
      {
        header: "Beneficiary Account Number",
        accessorKey: "BeneficiaryAccountNumber",
      },
      { header: "First Holder's Name", accessorKey: "FirstHoldersName" },
      { header: "Filler1", accessorKey: "Filler1" },
      { header: "Second Holder's Name", accessorKey: "SecondHoldersName" },
      { header: "Third Holder's Name", accessorKey: "ThirdHoldersName" },
      { header: "FreeLockFlag", accessorKey: "FreeLockFlag" },
      { header: "LockedinReasonCode", accessorKey: "LockedinReasonCode" },
      { header: "Requested Quantity", accessorKey: "RequestedQuantity" },
      {
        header: "Internal Reference Number",
        accessorKey: "InternalReferenceNumber",
      },
      {
        header: "Instruction Receive Date",
        accessorKey: "InstructionReceiveDate",
        cell: (info) => formatDateShort(info.getValue()),
      },
      {
        header: "DRF/RRF/CRF Receive Date",
        accessorKey: "DRF_RRF_CRFReceiveDate",
        cell: (info) => formatDateShort(info.getValue()),
      },
      {
        header: "DRN/RRN Status/CRN Status",
        accessorKey: "DRN_RRN_Status_CRNStatus",
      },
      { header: "Confirmation Number", accessorKey: "ConfirmationNumber" },
      {
        header: "Confirmation Date",
        accessorKey: "ConfirmationDate",
        cell: (info) => formatDateShort(info.getValue()),
      },
      { header: "Accepted Quantity", accessorKey: "AcceptedQuantity" },
      { header: "Rejected Quantity", accessorKey: "RejectedQuantity" },
      {
        header: "Confirmation Capture Datetime",
        accessorKey: "ConfirmationCaptureDatetime",
      },
      {
        header: "Verify Release Datetime",
        accessorKey: "VerifiyReleaseDatetime",
      },
      {
        header: "Instruction Receipt Date from NSDL",
        accessorKey: "InstructionReceiptDatetimeFromNSDL",
      },
      { header: "Confirmation Status", accessorKey: "ConfirmationStatus" },
      { header: "Rejection Reason 1", accessorKey: "RejectionReason1" },
      { header: "Rejection Reason 2", accessorKey: "RejectionReason2" },
      { header: "Rejection Reason 3", accessorKey: "RejectionReason3" },
      { header: "Rejection Reason 4", accessorKey: "RejectionReason4" },
      { header: "Number Of Certificates", accessorKey: "NumberOfCertificates" },
      { header: "All Units Indicator", accessorKey: "AllUnitsIndicator" },
      {
        header: "All Units Final Confirmation Indicator",
        accessorKey: "AllUnitsFinalConfirmationIndicator",
      },
      { header: "Beneficiary Type", accessorKey: "BeneficiaryType" },
      { header: "Beneficiary SubType", accessorKey: "BeneficiarySubType" },
      {
        header: "Beneficiary Address Part 1",
        accessorKey: "BeneficiaryAddressPart1",
      },
      {
        header: "Beneficiary Address Part 2",
        accessorKey: "BeneficiaryAddressPart2",
      },
      {
        header: "Beneficiary Address Part 3",
        accessorKey: "BeneficiaryAddressPart3",
      },
      {
        header: "Beneficiary Address Part 4",
        accessorKey: "BeneficiaryAddressPart4",
      },
      {
        header: "Beneficiary Address Pincode",
        accessorKey: "BeneficiaryAddressPincode",
      },
      { header: "Filler2", accessorKey: "Filler2" },
    ],
    [data]
  );

  return (
    <>
      <div className="card">
        <div className="card-body">
          <ViewDataTable
            title="Demat NSDL History"
            cardHeader="demat nsdl history data"
            columns={columns}
            data={data}
            isLoading={loading}
          />
        </div>
      </div>
    </>
  );
};

export default UserDemateHistoryNsdl;
