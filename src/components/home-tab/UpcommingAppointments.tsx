import { IonItem, IonList, IonSpinner, useIonRouter } from "@ionic/react";
import { format } from "@formkit/tempo";
import { useAppointmentHistoryInfiniteQuery } from "@src/hooks/appointment-hook";
import { ROUTES } from "@src/routes/routes";
import { useLocalUserStore } from "@src/stores/user";

function reduceTime(time?: string): string {
  return time ? time.replace(/:\d{2}$/, "") : "TBD";
}

export default function UpcommingAppointments() {
  const router = useIonRouter();
  const localUser = useLocalUserStore((s) => s.localUser);

  const upcomingAppointmentsQuery = useAppointmentHistoryInfiniteQuery(
    localUser?.id || "",
    4,
    { type: null, status: null, sortType: "Upcomming" }
  );

  const appointments =
    upcomingAppointmentsQuery.data?.pages.flatMap((page) => page.data) ?? [];

  if (upcomingAppointmentsQuery.isPending) {
    return (
      <div className="flex justify-center items-center">
        <IonSpinner name="dots" className="text-blue-600 size-6" />
      </div>
    );
  }

  return (
    <IonList className="bg-transparent! p-0!">
      {upcomingAppointmentsQuery.isError ? (
        <div className="flex justify-center items-center py-4 text-sm text-gray-500 italic">
          No upcoming appointments
        </div>
      ) : upcomingAppointmentsQuery.isSuccess && appointments.length === 0 ? (
        <div className="flex justify-center items-center py-4 text-sm text-gray-500 italic">
          No upcoming appointments
        </div>
      ) : (
        appointments.map((appointment) => (
          <IonItem
            key={appointment.id}
            button
            detail
            onClick={() =>
              router.push(`${ROUTES.APPOINTMENT}/${appointment.id}`, "forward")
            }
            className="ion-bg-transparent ion-min-h-[0rem]"
          >
            <div className="flex items-center justify-between w-full py-1">
              <div className="flex w-fit justify-center items-baseline gap-2 leading-tight">
                <span className="text-sm font-medium">
                  {format(new Date(appointment.appointmentDate), "MMM DD")}
                </span>
                <span className="text-xs text-gray-600">
                  {reduceTime(appointment.slot?.startTime)} -{" "}
                  {reduceTime(appointment.slot?.endTime)}
                </span>
              </div>

              <span className="text-xs text-blue-500">
                {appointment.typeName}
              </span>
            </div>
          </IonItem>
        ))
      )}
    </IonList>
  );
}
