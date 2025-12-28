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
import { useCryoContractInfiniteQuery } from "@src/hooks/cryo-contract-hook";
import type { CryoContractListApiResponse } from "@src/schemas/cryo-contract";
import { useCryoContractFilterStore } from "@src/stores/cryo-contract";
import { useLocalUserStore } from "@src/stores/user";
import { safeFormat } from "@src/utils/date";
import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { ROUTES } from "@src/routes/routes";

export default function ContractHistory() {
  const router = useIonRouter();
  const localUser = useLocalUserStore((s) => s.localUser);
  const filterOptions = useCryoContractFilterStore(
    useShallow((s) => s.filterOptions)
  );
  const contractQuery = useCryoContractInfiniteQuery(
    localUser?.id || "",
    20,
    filterOptions
  );

  const contracts =
    contractQuery.data?.pages.flatMap(
      (page: CryoContractListApiResponse) => page.data
    ) ?? [];

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
      }),
    []
  );

  async function handleLoadMore(e: CustomEvent<void>) {
    await contractQuery.fetchNextPage();
    (e.target as HTMLIonInfiniteScrollElement)?.complete();
  }

  async function handleRefresh(e: CustomEvent) {
    await contractQuery.refetch();
    e.detail.complete();
  }

  const isInitialLoading =
    contractQuery.isPending && !contractQuery.isFetchingNextPage;

  return (
    <div className="size-full">
      <IonRefresher slot="fixed" onIonRefresh={handleRefresh} className="z-10!">
        <IonRefresherContent />
      </IonRefresher>

      <div className="flex-1 min-h-0">
        {isInitialLoading ? (
          <div className="flex justify-center items-center py-10">
            <IonSpinner name="crescent" />
          </div>
        ) : contractQuery.isError ? (
          <div className="text-center text-sm text-red-600 py-12 px-6 bg-white/60 rounded-2xl border border-red-100">
            Unable to load contracts. Please pull to refresh or try again later.
          </div>
        ) : (
          <IonList className="bg-transparent! pb-20!">
            {contractQuery.isSuccess && contracts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 text-center text-sm text-gray-600 italic">
                No contracts found for your account.
              </div>
            ) : (
              <>
                {contracts.map((contract) => (
                  <IonItem
                    key={contract.id}
                    className="ion-bg-transparent"
                    button
                    detail
                    onClick={() =>
                      router.push(
                        `${ROUTES.CRYO_CONTRACT}/${contract.id}`,
                        "forward"
                      )
                    }
                  >
                    <div className="w-full py-3 flex items-stretch gap-3 border-b border-blue-50">
                      <div className="flex-1 flex flex-col gap-2 min-w-0">
                        <div className="flex flex-col gap-1 min-w-0">
                          <span className="text-sm font-semibold text-gray-900 truncate">
                            {contract.cryoPackageName}
                          </span>
                          <span className="text-xs tracking-wider text-gray-700 truncate">
                            {contract.contractNumber}
                          </span>
                        </div>

                        <div className="flex flex-col gap-1 text-sm text-gray-700">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-[11px] uppercase tracking-wide text-gray-400">
                              Start
                            </span>
                            <span>
                              {contract.startDate
                                ? safeFormat(
                                    new Date(contract.startDate),
                                    "MMM DD, YYYY"
                                  )
                                : "TBD"}
                            </span>
                          </div>
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-[11px] uppercase tracking-wide text-gray-400">
                              End
                            </span>
                            <span>
                              {contract.endDate
                                ? safeFormat(
                                    new Date(contract.endDate),
                                    "MMM DD, YYYY"
                                  )
                                : "TBD"}
                            </span>
                          </div>
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-[11px] uppercase tracking-wide text-gray-400">
                              Signed
                            </span>
                            <span>
                              {contract.signedDate
                                ? safeFormat(
                                    new Date(contract.signedDate),
                                    "MMM DD, YYYY"
                                  )
                                : "TBD"}
                            </span>
                            {contract.signedBy && (
                              <span className="text-xs text-gray-600 truncate">
                                by {contract.signedBy}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col justify-between items-end gap-2 min-w-fit">
                        <span
                          className={`text-[11px] font-semibold px-3 py-1 rounded-full border ${getStatusBadgeClass(
                            contract.status
                          )}`}
                        >
                          {contract.status}
                        </span>
                        <div className="flex flex-col items-end gap-1 text-xs text-gray-700">
                          <span className="font-semibold">
                            {currencyFormatter.format(contract.paidAmount)} paid
                          </span>
                          <span className="text-gray-500">
                            of {currencyFormatter.format(contract.totalAmount)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </IonItem>
                ))}

                <IonInfiniteScroll
                  disabled={!contractQuery.hasNextPage}
                  onIonInfinite={handleLoadMore}
                >
                  <IonInfiniteScrollContent loadingText="Loading more..." />
                </IonInfiniteScroll>
              </>
            )}
          </IonList>
        )}
      </div>
    </div>
  );
}

function getStatusBadgeClass(status: string) {
  switch (status) {
    case "Pending":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "Active":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "Completed":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "Cancelled":
      return "bg-rose-50 text-rose-700 border-rose-200";
    case "Expired":
      return "bg-gray-100 text-gray-700 border-gray-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
}
