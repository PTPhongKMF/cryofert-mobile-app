import { format } from "@formkit/tempo";
import { IonItem, IonLabel } from "@ionic/react";
import { useIonRouter } from "@ionic/react";
import type { TreatmentCycleDetailResponse } from "@src/schemas/treatment-cycle";
import { ROUTES } from "@src/routes/routes";

interface TreatmentCycleDetailAppointmentsProps {
  appointments: TreatmentCycleDetailResponse["appointments"];
}

export default function TreatmentCycleDetailAppointments({
  appointments,
}: TreatmentCycleDetailAppointmentsProps) {
  const router = useIonRouter();

  if (appointments.length === 0) {
    return (
      <div className="px-4">
        <div className="flex justify-center items-center py-8 italic text-gray-500">
          No appointments found for this cycle.
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 flex flex-col gap-4">
      {appointments.map((appointment) => (
        <IonItem
          key={appointment.id}
          button
          lines="full"
          onClick={() =>
            router.push(
              `${ROUTES.APPOINTMENT}/${appointment.id}`,
              "forward"
            )
          }
          className="bg-gray-50 rounded-xl border border-blue-200 shadow-lg"
        >
          <div className="w-full flex flex-col gap-2 py-2">
            <div className="flex justify-between items-center">
              <IonLabel className="text-base font-semibold text-blue-500">
                {appointment.type}
              </IonLabel>
              <span className="text-xs text-black px-2 py-1 rounded bg-gray-100">
                {appointment.status}
              </span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold">Date:</span>
              <span className="font-normal text-xs text-black">
                {appointment.appointmentDate
                  ? format(appointment.appointmentDate, "MMM DD, YYYY")
                  : "N/A"}
              </span>
            </div>
          </div>
        </IonItem>
      ))}
    </div>
  );
}


