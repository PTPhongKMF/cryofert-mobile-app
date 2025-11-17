import {
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonItem,
  IonList,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
} from "@ionic/react";
import { usePatientBookingHistoryInfiniteQuery } from "@src/services/api-services/appointment-service";
import type { PatientBookingAppointmentApiResponse } from "@src/schemas/appointment";
import { format } from "@formkit/tempo";
import { useLocalUserStore } from "@src/stores/user";

export default function AppointmentHistory() {
  const localUser = useLocalUserStore((s) => s.localUser);

  const bookingHistoryQuery = usePatientBookingHistoryInfiniteQuery(
    localUser?.id || ""
  );

  const appointments =
    bookingHistoryQuery.data?.pages.flatMap(
      (page: PatientBookingAppointmentApiResponse) => page.data
    ) ?? [];

  async function handleLoadMore(e: CustomEvent<void>) {
    await bookingHistoryQuery.fetchNextPage();
    (e.target as HTMLIonInfiniteScrollElement)?.complete();
  }

  async function handleRefresh(e: CustomEvent) {
    await bookingHistoryQuery.refetch();
    e.detail.complete();
  }

  if (bookingHistoryQuery.isPending) {
    return (
      <div className="flex justify-center items-center py-8">
        <IonSpinner name="crescent" />
      </div>
    );
  }

  return (
    <div className="size-full overflow-y-scroll!">
      <IonList className="bg-transparent!">
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        {!bookingHistoryQuery.isLoading &&
        bookingHistoryQuery.isSuccess &&
        appointments.length === 0 ? (
          <div className="flex justify-center items-center py-8 italic text-gray-500">
            Empty
          </div>
        ) : (
          <>
            {appointments.map((appointment) => (
              <IonItem
                button
                detail
                key={appointment.id}
                className="ion-bg-transparent"
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
            ))}

            <IonInfiniteScroll
              disabled={!bookingHistoryQuery.hasNextPage}
              onIonInfinite={handleLoadMore}
            >
              <IonInfiniteScrollContent loadingText="Loading more..." />
            </IonInfiniteScroll>
          </>
        )}
      </IonList>
    </div>
  );
}
