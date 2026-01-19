import { format } from "@formkit/tempo";
import type { TreatmentCycleDetailResponse } from "@src/schemas/treatment-cycle";

interface TreatmentCycleDetailInfoProps {
  cycle: TreatmentCycleDetailResponse;
}

export default function TreatmentCycleDetailInfo({
  cycle,
}: TreatmentCycleDetailInfoProps) {
  return (
    <div className="px-4 flex flex-col justify-center items-center gap-4">
      <div className="bg-gray-50 w-full p-4 rounded-xl border shadow-lg border-blue-200 flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-blue-500 my-2!">
          Basic Information
        </h2>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center text-sm">
            <span className="font-semibold">Cycle Name:</span>
            <span className="font-normal text-xs text-black">
              {cycle.cycleName}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="font-semibold">Cycle Number:</span>
            <span className="font-normal text-xs text-black">
              {cycle.cycleNumber}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="font-semibold">Status:</span>
            <span className="font-normal text-xs text-black px-2 py-1 rounded bg-gray-100">
              {cycle.status}
            </span>
          </div>

          <div className="bg-gray-200 w-full h-0.5 my-1" />

          <div className="flex justify-between items-center text-sm">
            <span className="font-semibold">Step Type:</span>
            <span className="font-normal text-xs text-black">
              {cycle.stepType}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="font-semibold">Protocol:</span>
            <span className="font-normal text-xs text-black">
              {cycle.protocol}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="font-semibold">Expected Duration:</span>
            <span className="font-normal text-xs text-black">
              {cycle.expectedDurationDays} days
            </span>
          </div>

          <div className="bg-gray-200 w-full h-0.5 my-1" />

          <div className="flex justify-between items-center text-sm">
            <span className="font-semibold">Start Date:</span>
            <span className="font-normal text-xs text-black">
              {cycle.startDate
                ? format(cycle.startDate, "MMM DD, YYYY", "en")
                : "N/A"}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="font-semibold">End Date:</span>
            <span className="font-normal text-xs text-black">
              {cycle.endDate
                ? format(cycle.endDate, "MMM DD, YYYY", "en")
                : "N/A"}
            </span>
          </div>

          {cycle.cost !== null && (
            <>
              <div className="bg-gray-200 w-full h-0.5 my-1" />
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold">Cost:</span>
                <span className="font-normal text-xs text-black">
                  {cycle.cost}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {cycle.notes && (
        <div className="bg-gray-50 w-full p-4 rounded-xl shadow-lg border border-blue-200 flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-blue-500 my-2!">Notes</h2>

          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-1 text-sm">
              <span className="font-normal text-xs text-black whitespace-pre-wrap">
                {cycle.notes}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gray-50 w-full p-4 rounded-xl shadow-lg border border-blue-200 flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-blue-500 my-2!">
          Treatment Information
        </h2>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center text-sm">
            <span className="font-semibold">Treatment Name:</span>
            <span className="font-normal text-xs text-black">
              {cycle.treatmentName}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
