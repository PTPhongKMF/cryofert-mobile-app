import { format } from "@formkit/tempo";
import { IonItem } from "@ionic/react";
import AnimatedProgressLine from "@src/components/AnimatedProgressLine";
import type { TreatmentDetail } from "@src/schemas/treatment";
import type { TreatmentCycleResponse } from "@src/schemas/treatment-cycle";
import { cn } from "@utils/cn";

interface TreatmentDetailCyclesProps {
  treatment: TreatmentDetail;
  cycles: TreatmentCycleResponse[];
  isError: boolean;
}

function getStatusColor(status: TreatmentCycleResponse["status"]) {
  switch (status) {
    case "Planned":
      return "bg-gray-400";
    case "Scheduled":
      return "bg-gray-400";
    case "InProgress":
      return "bg-blue-500";
    case "Completed":
      return "bg-green-500 ";
    case "Cancelled":
    case "Failed":
      return "bg-red-500";
    case "OnHold":
      return "bg-yellow-500";
    default:
      return "bg-gray-400";
  }
}

function getStatusLineColor(status: TreatmentCycleResponse["status"]) {
  switch (status) {
    case "Planned":
      return "bg-gray-200";
    case "Scheduled":
      return "bg-gray-200";
    case "Completed":
      return "bg-green-300";
    case "Cancelled":
    case "Failed":
      return "bg-red-300";
    case "OnHold":
      return "bg-yellow-300";
    default:
      return "bg-gray-200";
  }
}

export default function TreatmentDetailCycles({
  treatment,
  cycles,
  isError,
}: TreatmentDetailCyclesProps) {
  function handleCycleClick(cycle: TreatmentCycleResponse) {
    console.log("Cycle clicked:", cycle);
  }

  if (isError) {
    return (
      <div className="px-4">
        <div className="flex justify-center items-center py-8 italic text-gray-500">
          Error loading treatment cycles.
        </div>
      </div>
    );
  }

  if (cycles.length === 0) {
    return (
      <div className="px-4">
        <div className="flex justify-center items-center py-8 italic text-gray-500">
          No treatment cycles found.
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 flex flex-col justify-start items-center">
      {cycles.map((cycle, index) => {
        const isLast = index === cycles.length - 1;
        const statusColor = getStatusColor(cycle.status);

        return (
          <div key={cycle.id} className="size-full">
            <div
              className={cn(
                "w-full relative grid grid-cols-[3.5rem_1fr]  justify-items-center",
                isLast
                  ? "grid-rows-[3.5rem_auto]"
                  : "grid-rows-[3.5rem_auto_2.5rem]"
              )}
            >
              <div
                className={`size-14 z-10 rounded-full ${statusColor} shadow-2xl flex items-center justify-center text-white font-bold text-lg shrink-0`}
              >
                {cycle.cycleNumber}
              </div>

              {!isLast ? (
                cycles[index + 1].status === "InProgress" ? (
                  <AnimatedProgressLine className="col-start-1 row-span-2 h-[110%] self-center" />
                ) : (
                  <div
                    className={`w-2 col-start-1 row-span-2 h-[110%] self-center ${getStatusLineColor(
                      cycles[index + 1].status
                    )}`}
                  />
                )
              ) : null}

              <IonItem
                button
                lines="none"
                onClick={() => handleCycleClick(cycle)}
                className="row-span-2 col-start-2 row-start-1 w-full ps-2 ion-b-r-[8px] ion-inner-py-[1rem]"
              >
                <div className="size-full flex flex-col justify-start items-center gap-4">
                  <div className="size-full grid grid-cols-[1fr_auto] auto-rows-auto gap-x-2 gap-y-1">
                    <p className="text-lg font-semibold text-blue-500 line-clamp-1">
                      Cycle {cycle.cycleNumber}
                    </p>

                    <div
                      className={`px-3 py-1 rounded-full size-fit text-xs font-semibold border ${statusColor} text-white`}
                    >
                      {cycle.status}
                    </div>

                    <p className="text-sm text-gray-600 col-span-2">
                      {cycle.stepType}
                    </p>
                  </div>

                  <div className="bg-gray-200 w-full h-0.5" />

                  <div className="size-full flex flex-col justify-start items-center gap-1">
                    <div className="w-full flex justify-between items-center text-sm">
                      <span>Protocol:</span>
                      <span className="font-normal text-xs text-black">
                        {cycle.protocol}
                      </span>
                    </div>

                    <div className="w-full flex justify-between items-center text-sm">
                      <span>Start Date:</span>
                      <span className="font-normal text-xs text-black">
                        {format(cycle.startDate, "MMM DD, YYYY")}
                      </span>
                    </div>

                    <div className="w-full flex justify-between items-center text-sm">
                      <span>End Date:</span>
                      <span className="font-normal text-xs text-black">
                        {cycle.endDate
                          ? format(cycle.endDate, "MMM DD, YYYY")
                          : "TBD"}
                      </span>
                    </div>

                    <div className="w-full flex justify-between items-center text-sm">
                      <span>Expected Duration:</span>
                      <span className="font-normal text-xs text-black">
                        {cycle.expectedDurationDays} days
                      </span>
                    </div>

                    {cycle.cost !== null && (
                      <div className="w-full flex justify-between items-center text-sm">
                        <span>Cost:</span>
                        <span className="font-normal text-xs text-black">
                          {cycle.cost}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </IonItem>
            </div>
          </div>
        );
      })}
    </div>
  );
}
