import {
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonItem,
  IonList,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
  useIonRouter,
} from "@ionic/react";
import type { AppointmentHistoryApiResponse } from "@src/schemas/appointment";
import type { TransactionResponse } from "@src/schemas/transaction";
import { format } from "@formkit/tempo";
import { useLocalUserStore } from "@src/stores/user";
import { useAppointmentHistoryInfiniteQuery } from "@src/hooks/appointment-hook";
import { useAppointmentHistoryFilterStore } from "@src/stores/appointment";
import { useShallow } from "zustand/react/shallow";
import { ROUTES } from "@src/routes/routes";
import { useEffect } from "react";

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
      (statusPriority[a.status] ?? Infinity) -
      (statusPriority[b.status] ?? Infinity)
  )[0];
}

function getStatusColorClass(status: string): string {
  switch (status) {
    case "Pending":
      return "text-amber-600";
    case "Failed":
      return "text-red-600";
    case "Completed":
      return "text-green-600";
    case "Cancelled":
      return "text-gray-600";
    default:
      return "text-gray-600";
  }
}

function reduceTime(time?: string): string {
  return time ? time.replace(/:\d{2}$/, "") : "TBD";
}

function getAppointmentStatusBadgeClass(status: string): string {
  switch (status) {
    case "Scheduled":
      return "bg-slate-50 text-slate-700 border-slate-200";
    case "Confirmed":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "CheckedIn":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "Completed":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "Cancelled":
      return "bg-rose-50 text-rose-700 border-rose-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
}

export default function AppointmentHistory() {
  const router = useIonRouter();
  const localUser = useLocalUserStore((s) => s.localUser);
  const filterOptions = useAppointmentHistoryFilterStore(
    useShallow((s) => s.filterOptions)
  );

  const bookingHistoryQuery = useAppointmentHistoryInfiniteQuery(
    localUser?.id || "",
    20,
    filterOptions
  );

  const appointments =
    bookingHistoryQuery.data?.pages.flatMap(
      (page: AppointmentHistoryApiResponse) => page.data
    ) ?? [];

  async function handleLoadMore(e: CustomEvent<void>) {
    await bookingHistoryQuery.fetchNextPage();
    (e.target as HTMLIonInfiniteScrollElement)?.complete();
  }

  async function handleRefresh(e: CustomEvent) {
    await bookingHistoryQuery.refetch();
    e.detail.complete();
  }

  useEffect(() => {
    if (bookingHistoryQuery.isError) console.log(bookingHistoryQuery.error);
  }, [bookingHistoryQuery.error, bookingHistoryQuery.isError]);

  if (bookingHistoryQuery.isPending) {
    return (
      <div className="flex justify-center items-center py-8">
        <IonSpinner name="crescent" />
      </div>
    );
  }

  return (
    <div className="size-full">
      <IonRefresher slot="fixed" onIonRefresh={handleRefresh} className="z-10!">
        <IonRefresherContent />
      </IonRefresher>

      <IonList className="bg-transparent!">
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
                  onClick={() =>
                    router.push(
                      `${ROUTES.APPOINTMENT}/${appointment.id}`,
                      "forward"
                    )
                  }
                  className="ion-bg-transparent"
                >
                  <div className="grid grid-cols-[1fr_auto] grid-rows-[1fr_1fr_min-content] gap-1 items-center w-full py-2">
                    <p className="font-semibold text-gray-900 justify-self-start mb-2">
                      {format(new Date(appointment.appointmentDate), "dddd,")}{" "}
                      <span className="text-sm">
                        {format(
                          new Date(appointment.appointmentDate),
                          "MMM DD, YYYY"
                        )}
                      </span>
                    </p>

                    <div
                      className={`text-xs font-medium px-2.5 py-0.5 rounded-full border justify-self-end ${getAppointmentStatusBadgeClass(
                        appointment.status
                      )}`}
                    >
                      {appointment.statusName}
                    </div>

                    <p className="text-sm text-gray-900 justify-self-start col-span-2">
                      Slot: {reduceTime(appointment.slot?.startTime)} -{" "}
                      {reduceTime(appointment.slot?.endTime)}
                    </p>

                    <p className="text-xs text-gray-900 pe-2 justify-self-end row-start-3 col-start-2">
                      {appointment.typeName}
                    </p>

                    <div className="text-xs">
                      Payment:{" "}
                      {paymentTransaction ? (
                        <span
                          className={getStatusColorClass(
                            paymentTransaction.status
                          )}
                        >
                          {paymentTransaction.status}
                        </span>
                      ) : (
                        <span className="text-gray-600">None</span>
                      )}
                    </div>
                  </div>
                </IonItem>
              );
            })}

            <IonInfiniteScroll
              disabled={!bookingHistoryQuery.hasNextPage}
              onIonInfinite={handleLoadMore}
            >
              <IonInfiniteScrollContent
                loadingText="Loading more..."
                className="mt-8"
              />
            </IonInfiniteScroll>
          </>
        )}
      </IonList>
    </div>
  );
}
