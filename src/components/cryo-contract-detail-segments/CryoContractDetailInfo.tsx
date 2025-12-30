import type { CryoContractDetailResponse } from "@src/schemas/cryo-contract";
import { safeFormat } from "@src/utils/date";

interface CryoContractDetailInfoProps {
  contract: CryoContractDetailResponse;
}

function getStatusBadgeClass(status: string) {
  switch (status) {
    case "Pending":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "Active":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "Renewed":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "Terminated":
      return "bg-rose-50 text-rose-700 border-rose-200";
    case "Expired":
      return "bg-gray-100 text-gray-700 border-gray-200";
    case "Draft":
      return "bg-gray-50 text-gray-700 border-gray-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
}

export default function CryoContractDetailInfo({
  contract,
}: CryoContractDetailInfoProps) {
  const currencyFormatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  });

  return (
    <div className="px-4 flex flex-col justify-center items-center gap-4">
      <div className="bg-gray-50 w-full p-4 rounded-xl border shadow-lg border-blue-200 flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-blue-500 my-2!">
          Contract Information
        </h2>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center text-sm">
            <span className="font-semibold">Contract Number:</span>
            <span className="font-normal text-xs text-black">
              {contract.contractNumber}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="font-semibold">Status:</span>
            <span
              className={`text-xs font-semibold px-2 py-1 rounded-full border ${getStatusBadgeClass(
                contract.status
              )}`}
            >
              {contract.status}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="font-semibold">Package:</span>
            <span className="font-normal text-xs text-black">
              {contract.cryoPackageName}
            </span>
          </div>

          <div className="bg-gray-200 w-full h-0.5 my-1" />

          <div className="flex justify-between items-center text-sm">
            <span className="font-semibold">Start Date:</span>
            <span className="font-normal text-xs text-black">
              {contract.startDate
                ? safeFormat(new Date(contract.startDate), "MMM DD, YYYY")
                : "N/A"}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="font-semibold">End Date:</span>
            <span className="font-normal text-xs text-black">
              {contract.endDate
                ? safeFormat(new Date(contract.endDate), "MMM DD, YYYY")
                : "N/A"}
            </span>
          </div>

          {contract.signedDate && (
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold">Signed Date:</span>
              <span className="font-normal text-xs text-black">
                {safeFormat(new Date(contract.signedDate), "MMM DD, YYYY")}
              </span>
            </div>
          )}

          {contract.signedBy && (
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold">Signed By:</span>
              <span className="font-normal text-xs text-black">
                {contract.signedBy}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="bg-gray-50 w-full p-4 rounded-xl border shadow-lg border-blue-200 flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-blue-500 my-2!">
          Payment Information
        </h2>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center text-sm">
            <span className="font-semibold">Total Amount:</span>
            <span className="font-normal text-xs text-black font-semibold">
              {currencyFormatter.format(contract.totalAmount)}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="font-semibold">Paid Amount:</span>
            <span className="font-normal text-xs text-black font-semibold">
              {currencyFormatter.format(contract.paidAmount)}
            </span>
          </div>

          <div className="bg-gray-200 w-full h-0.5 my-1" />

          <div className="flex justify-between items-center text-sm">
            <span className="font-semibold">Remaining:</span>
            <span className="font-normal text-xs text-black font-semibold">
              {currencyFormatter.format(
                contract.totalAmount - contract.paidAmount
              )}
            </span>
          </div>
        </div>
      </div>

      {contract.patientName && (
        <div className="bg-gray-50 w-full p-4 rounded-xl border shadow-lg border-blue-200 flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-blue-500 my-2!">
            Patient Information
          </h2>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold">Name:</span>
              <span className="font-normal text-xs text-black">
                {contract.patientName}
              </span>
            </div>
          </div>
        </div>
      )}

      {contract.notes && (
        <div className="bg-gray-50 w-full p-4 rounded-xl border shadow-lg border-blue-200 flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-blue-500 my-2!">Notes</h2>

          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-1 text-sm">
              <span className="font-normal text-xs text-black whitespace-pre-wrap">
                {contract.notes}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

