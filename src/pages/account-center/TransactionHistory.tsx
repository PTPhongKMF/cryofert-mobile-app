import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
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
import GreenToGrayGradientBg from "@src/components/backgrounds/GreenToGrayGradientBg";
import type { TransactionHistoryApiResponse } from "@src/schemas/transaction";
import { useLocalUserStore } from "@src/stores/user";
import { addYear, format } from "@formkit/tempo";
import {
  useTransactionHistoryInfiniteQuery,
  type TransactionHistoryFilters,
} from "@src/hooks/transaction-hook";
import TransactionHistoryFilter from "@src/components/account-center-tab/TransactionHistoryFilter";
import { useEffect, useState } from "react";
import { filter } from "ionicons/icons";
import { cn } from "@src/utils/cn";

type TransactionFilterOptions = TransactionHistoryFilters;

export default function TransactionHistory() {
  const localUser = useLocalUserStore((s) => s.localUser);

  const [filterOptions, setFilterOptions] = useState<TransactionFilterOptions>({
    status: null,
    relatedEntityType: null,
    fromDate: addYear(new Date(), -1).toISOString(),
    toDate: new Date().toISOString(),
  });

  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const transactionQuery = useTransactionHistoryInfiniteQuery(
    localUser?.id || "",
    filterOptions
  );

  useEffect(() => {
    console.log(filterOptions);
  }, [filterOptions]);

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

          <IonButtons slot="end">
            <IonButton onClick={() => setIsFilterVisible((prev) => !prev)}>
              <IonIcon slot="icon-only" icon={filter} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent scrollY={false} className="relative">
        <GreenToGrayGradientBg />

        <div className="relative flex flex-col h-full">
          <div
            className={cn(
              "overflow-hidden transition-all duration-300 ease-in-out",
              isFilterVisible
                ? "max-h-96 opacity-100 animate-fade-in animate-slide-down"
                : "max-h-0 opacity-0"
            )}
          >
            <div className={cn(!isFilterVisible && "invisible")}>
              <TransactionHistoryFilter
                filters={filterOptions}
                onChange={(update) =>
                  setFilterOptions((prev) => ({ ...prev, ...update }))
                }
              />
            </div>
          </div>

          <div className="flex-1 min-h-0">
            <div className="h-full overflow-y-auto px-2 ion-content-scroll-host relative">
              <IonRefresher
                slot="fixed"
                onIonRefresh={handleRefresh}
                className="z-10!"
              >
                <IonRefresherContent />
              </IonRefresher>

              {transactionQuery.isLoading ? (
                <div className="flex justify-center items-center h-full">
                  <IonSpinner name="crescent" />
                </div>
              ) : (
                <IonList className="bg-transparent! pb-0!">
                  {!transactionQuery.isLoading &&
                  transactionQuery.isSuccess &&
                  transactions.length === 0 ? (
                    <div className="flex justify-center items-center h-full italic text-gray-500">
                      No transactions found.
                    </div>
                  ) : (
                    <>
                      {transactions.map((transaction) => (
                        <IonItem
                          button
                          detail
                          key={transaction.id}
                          lines="none"
                          className="ion-bg-transparent bg-white/90 rounded-xl mb-2"
                        >
                          <div className="flex flex-col gap-2 w-full py-2">
                            <div className="flex items-center justify-between">
                              <div className="font-semibold text-gray-900 text-base">
                                {transaction.transactionCode}
                              </div>
                              <div className="text-xs text-gray-500 px-2 py-1 rounded bg-gray-100">
                                {transaction.status}
                              </div>
                            </div>

                            <div className="text-sm text-gray-900 font-semibold flex flex-wrap items-center gap-1">
                              <span>{transaction.transactionType}</span>
                              <span aria-hidden>&middot;</span>
                              <span>
                                {new Intl.NumberFormat("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                }).format(transaction.amount)}
                              </span>
                              {transaction.paymentGateway && (
                                <>
                                  <span aria-hidden>&middot;</span>
                                  <span>{transaction.paymentGateway}</span>
                                </>
                              )}
                            </div>

                            <div className="text-sm text-gray-700">
                              <span>
                                {format(
                                  transaction.transactionDate,
                                  "YYYY-MM-DD HH:mm"
                                )}
                              </span>
                            </div>

                            <IonNote className="text-xs text-gray-600 mt-1 line-clamp-1">
                              {transaction.description}
                            </IonNote>
                          </div>
                        </IonItem>
                      ))}

                      <IonInfiniteScroll
                        disabled={!transactionQuery.hasNextPage}
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
              )}
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
