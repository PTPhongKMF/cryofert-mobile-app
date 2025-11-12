import {
  IonItem,
  IonList,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
} from "@ionic/react";
import { usePatientBookingHistoryQuery } from "@src/services/api-services/appointment-service";
import { format } from "@formkit/tempo";

export default function AppointmentHistory() {
  const bookingHistoryQuery = usePatientBookingHistoryQuery();

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  async function handleRefresh(e: CustomEvent) {
    await bookingHistoryQuery.refetch();
    e.detail.complete();
  }

  return bookingHistoryQuery.isPending ? (
    <div className="flex justify-center items-center py-8">
      <IonSpinner name="crescent" />
    </div>
  ) : (
    <div className="size-full overflow-y-scroll!">
      <IonList className="bg-transparent!">
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        {bookingHistoryQuery.data?.data &&
        bookingHistoryQuery.data.data.length > 0 ? (
          bookingHistoryQuery.data.data.map((appointment) => (
            <IonItem
              button
              detail
              key={appointment.id}
              className="ion-bg-transparent mb-2!"
            >
              <div className="grid grid-cols-2 grid-rows-2 items-center w-full py-2">
                <div className="font-semibold text-gray-900 justify-self-start">
                  <p>
                    {format(new Date(appointment.appointmentDate), "dddd,")}
                  </p>
                  <p>
                    {format(
                      new Date(appointment.appointmentDate),
                      "long",
                      "en"
                    )}
                  </p>
                </div>

                <div className="text-xs text-gray-500 px-2 py-1 rounded bg-gray-100 justify-self-end">
                  {appointment.statusName}
                </div>

                <p className="text-sm text-gray-900 justify-self-start">
                  Slot: {appointment.slot?.startTime} -{" "}
                  {appointment.slot?.endTime}
                </p>

                <p className="text-sm text-gray-900 pe-2 justify-self-end">
                  {appointment.typeName}
                </p>
              </div>
            </IonItem>
          ))
        ) : (
          <div className="flex justify-center items-center py-8 italic text-gray-500">
            Empty
          </div>
        )}
      </IonList>
    </div>
  );
}
