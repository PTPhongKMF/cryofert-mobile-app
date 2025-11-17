import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonItem,
  IonList,
  IonNote,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useEffect } from "react";
import GreenToGrayGradientBg from "@src/components/backgrounds/GreenToGrayGradientBg";
import type { TransactionHistoryApiResponse } from "@src/schemas/transaction";
import { useTransactionHistoryInfiniteQuery } from "@src/services/api-services/transaction-service";
import { useLocalUserStore } from "@src/stores/user";
import { format } from "@formkit/tempo";

export default function TransactionHistory() {
  const localUser = useLocalUserStore((s) => s.localUser);

  const transactionQuery = useTransactionHistoryInfiniteQuery(
    localUser?.id || ""
  );

  const transactions =
    transactionQuery.data?.pages.flatMap(
      (page: TransactionHistoryApiResponse) => page.data
    ) ?? [];

  async function handleLoadMore(e: CustomEvent<void>) {
    await transactionQuery.fetchNextPage();
    (e.target as HTMLIonInfiniteScrollElement)?.complete();
  }

  async function handleRefresh(e: CustomEvent) {
    await transactionQuery.refetch();
    e.detail.complete();
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>Transaction History</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="relative">
        <GreenToGrayGradientBg />

        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        {transactionQuery.isPending ? (
          <div className="flex justify-center items-center py-8">
            <IonSpinner name="crescent" />
          </div>
        ) : (
          <div className="size-full">
            <IonList className="bg-transparent!">
              {!transactionQuery.isLoading &&
              transactionQuery.isSuccess &&
              transactions.length === 0 ? (
                <div className="flex justify-center items-center py-8 italic text-gray-500">
                  No transactions found.
                </div>
              ) : (
                <>
                  {transactions.map((transaction) => (
                    <IonItem
                      button
                      detail
                      key={transaction.id}
                      className="ion-bg-transparent bg-blue-200/40"
                    >
                      <div className="flex flex-col gap-2 w-full py-2">
                        <div className="flex items-center justify-between">
                          <div className="font-semibold text-gray-900">
                            <p className="text-base">
                              {transaction.transactionCode}
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                              {transaction.transactionType}
                            </p>
                          </div>
                          <div className="text-xs text-gray-500 px-2 py-1 rounded bg-gray-100">
                            {transaction.status}
                          </div>
                        </div>

                        <div className="text-sm text-gray-900 font-semibold">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(transaction.amount)}
                        </div>

                        <div className="text-sm text-gray-700">
                          <span>
                            {format(
                              transaction.transactionDate,
                              "MMM DD, YYYY HH:mm"
                            )}
                          </span>
                        </div>

                        <IonNote className="text-xs text-gray-600 mt-1 line-clamp-1">
                          {transaction.description}
                        </IonNote>

                        <div className="flex items-center gap-4 text-xs text-gray-600 mt-1">
                          <span>Method: {transaction.paymentMethod}</span>
                          {transaction.paymentGateway && (
                            <span>Gateway: {transaction.paymentGateway}</span>
                          )}
                        </div>
                      </div>
                    </IonItem>
                  ))}

                  <IonInfiniteScroll
                    disabled={!transactionQuery.hasNextPage}
                    onIonInfinite={handleLoadMore}
                  >
                    <IonInfiniteScrollContent loadingText="Loading more..." />
                  </IonInfiniteScroll>
                </>
              )}
            </IonList>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
}
