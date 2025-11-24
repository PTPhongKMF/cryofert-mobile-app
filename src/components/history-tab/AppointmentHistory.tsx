import {
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonItem,
  IonList,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
} from "@ionic/react";
import type { PatientBookingAppointmentApiResponse } from "@src/schemas/appointment";
import type { TransactionResponse } from "@src/schemas/transaction";
import { format } from "@formkit/tempo";
import { useLocalUserStore } from "@src/stores/user";
import { usePatientBookingHistoryInfiniteQuery } from "@src/hooks/appointment-hook";

function getPrioritizedPaymentTransaction(
  transactions: TransactionResponse[]
): TransactionResponse | null {
  const paymentTransactions = transactions.filter(
    (t) => t.transactionType === "Payment"
  );

  if (paymentTransactions.length === 0) return null;

  const statusPriority: Record<string, number> = {
    Pending: 0,
    Failed: 1,
    Completed: 2,
    Cancelled: 3,
  };

  return paymentTransactions.sort(
    (a, b) =>
      (statusPriority[a.status] ?? 999) - (statusPriority[b.status] ?? 999)
  )[0];
}

function getStatusColorClass(status: string): string {
  switch (status) {
    case "Pending":
      return "text-amber-600 font-semibold";
    case "Failed":
      return "text-red-600 font-semibold";
    case "Completed":
      return "text-green-600 font-semibold";
    case "Cancelled":
      return "text-gray-600 font-semibold";
    default:
      return "text-gray-600";
  }
}

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

        {bookingHistoryQuery.isSuccess && appointments.length === 0 ? (
          <div className="flex justify-center items-center py-8 italic text-gray-500">
            Empty
          </div>
        ) : (
          <>
            {appointments.map((appointment) => {
              const paymentTransaction = getPrioritizedPaymentTransaction(
                appointment.transactions
              );

              return (
                <IonItem
                  button
                  detail
                  key={appointment.id}
                  className="ion-bg-transparent"
                >
                  <div className="grid grid-cols-2 grid-rows-2 auto-rows-min items-center w-full py-2">
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

                    <p className="text-sm font-semibold text-gray-900 pe-2 justify-self-end">
                      {appointment.typeName}
                    </p>

                    <p className="text-sm text-gray-900 justify-self-start">
                      Slot: {appointment.slot?.startTime} -{" "}
                      {appointment.slot?.endTime}
                    </p>

                    <div className="text-xs text-gray-500 px-2 py-1 rounded bg-gray-100 justify-self-end">
                      {appointment.statusName}
                    </div>

                    {paymentTransaction && (
                      <div className="text-xs col-span-2">
                        Payment:{" "}
                        <span
                          className={getStatusColorClass(
                            paymentTransaction.status
                          )}
                        >
                          {paymentTransaction.status}
                        </span>
                      </div>
                    )}
                  </div>
                </IonItem>
              );
            })}

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
