import { IonButton, useIonRouter } from "@ionic/react";
import type { AppointmentResponse } from "@src/schemas/appointment";
import { ROUTES } from "@src/routes/routes";

interface AppointmentDetailCyclesProps {
  treatmentCycle: AppointmentResponse["treatmentCycle"];
}

export default function AppointmentDetailCycles({
  treatmentCycle,
}: AppointmentDetailCyclesProps) {
  const router = useIonRouter();

  if (!treatmentCycle) {
    return (
      <div className="px-4">
        <div className="flex justify-center items-center py-8 italic text-gray-500">
          This appointment is not linked to any treatment cycle.
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 flex flex-col h-full justify-between gap-20">
      <div className="bg-gray-50 w-full p-4 rounded-xl border shadow-lg border-blue-200 flex flex-col gap-3">
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex items-start justify-between gap-2">
            <span className="font-semibold whitespace-nowrap min-w-[6rem]">
              Cycle Name:
            </span>
            <span className="text-xs text-black text-right max-w-[65%]">
              {treatmentCycle.cycleName}
            </span>
          </div>

          <div className="flex items-start justify-between gap-2">
            <span className="font-semibold whitespace-nowrap min-w-[6rem]">
              Cycle Number:
            </span>
            <span className="text-xs text-black text-right max-w-[65%]">
              {treatmentCycle.cycleNumber}
            </span>
          </div>

          <div className="flex items-start justify-between gap-2">
            <span className="font-semibold whitespace-nowrap min-w-[6rem]">
              Status:
            </span>
            <span className="text-xs text-black px-2 py-1 rounded bg-gray-100 text-right max-w-[65%]">
              {treatmentCycle.status}
            </span>
          </div>
        </div>
      </div>

      <div className=" flex flex-col gap-2">
        <IonButton
          expand="block"
          color="secondary"
          onClick={() =>
            router.push(
              `${ROUTES.TREATMENT}/${treatmentCycle.treatment.id}`,
              "forward"
            )
          }
        >
          Go to treatment detail
        </IonButton>
        <IonButton
          expand="block"
          fill="outline"
          onClick={() =>
            router.push(
              `${ROUTES.TREATMENT_CYCLE}/${treatmentCycle.id}`,
              "forward"
            )
          }
        >
          Go to cycle detail
        </IonButton>
      </div>
    </div>
  );
}
