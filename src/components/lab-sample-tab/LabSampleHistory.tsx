import {
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonItem,
  IonList,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
} from "@ionic/react";
import { useLabSampleInfiniteQuery } from "@src/hooks/lab-sample-hook";
import type { LabSampleListApiResponse } from "@src/schemas/lab-sample";
import { useLocalUserStore } from "@src/stores/user";
import { useLabSampleFilterStore } from "@src/stores/lab-sample";
import { titleCase } from "text-case";
import { safeFormat } from "@src/utils/date";
import { useShallow } from "zustand/react/shallow";

export default function LabSampleHistory() {
  const localUser = useLocalUserStore((s) => s.localUser);
  const filterOptions = useLabSampleFilterStore(
    useShallow((s) => s.filterOptions)
  );
  const labSamplesQuery = useLabSampleInfiniteQuery(
    localUser?.id || "",
    20,
    filterOptions
  );

  const labSamples =
    labSamplesQuery.data?.pages.flatMap(
      (page: LabSampleListApiResponse) => page.data
    ) ?? [];

  async function handleLoadMore(e: CustomEvent<void>) {
    await labSamplesQuery.fetchNextPage();
    (e.target as HTMLIonInfiniteScrollElement)?.complete();
  }

  async function handleRefresh(e: CustomEvent) {
    await labSamplesQuery.refetch();
    e.detail.complete();
  }

  const isInitialLoading =
    labSamplesQuery.isPending && !labSamplesQuery.isFetchingNextPage;

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
        ) : labSamplesQuery.isError ? (
          <div className="text-center text-sm text-red-600 py-12 px-6 bg-white/60 rounded-2xl border border-red-100">
            Unable to load lab samples. Please pull to refresh or try again
            later.
          </div>
        ) : (
          <IonList className="bg-transparent! pb-20!">
            {labSamplesQuery.isSuccess && labSamples.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 text-center text-sm text-gray-600 italic">
                No lab samples found for your account.
              </div>
            ) : (
              <>
                {labSamples.map((sample) => (
                  <IonItem
                    key={sample.id}
                    className="ion-bg-transparent"
                    button
                    detail
                    onClick={() => console.log("Lab sample clicked", sample)}
                  >
                    <div className="w-full py-3 flex items-stretch gap-3 border-b border-blue-50">
                      <div className="flex-1 flex flex-col gap-2 min-w-0">
                        <div className="flex items-baseline gap-1.5 min-w-0">
                          <span className="text-sm font-semibold text-gray-900 truncate">
                            {titleCase(sample.sampleType)}
                          </span>
                          {sample.quality && (
                            <>
                              <span className="inline-block size-1 self-center rounded-full bg-gray-500 flex-shrink-0" />
                              <span className="text-xs text-gray-700 truncate">
                                {sample.quality}
                              </span>
                            </>
                          )}
                          <span className="inline-block size-1 self-center rounded-full bg-gray-500 flex-shrink-0" />
                          <span className="text-xs text-gray-600 truncate">
                            {sample.sampleCode}
                          </span>
                        </div>

                        <div className="flex flex-col gap-1 text-sm text-gray-700">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-[11px] uppercase tracking-wide text-gray-400">
                              Collected
                            </span>
                            <span>
                              {sample.collectionDate
                                ? safeFormat(
                                    new Date(sample.collectionDate),
                                    "MMM DD, YYYY"
                                  )
                                : "Pending"}
                            </span>
                          </div>
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-[11px] uppercase tracking-wide text-gray-400">
                              Expires
                            </span>
                            <span
                              className={
                                sample.expiryDate ? "" : "text-gray-500"
                              }
                            >
                              {sample.expiryDate
                                ? safeFormat(
                                    new Date(sample.expiryDate),
                                    "MMM DD, YYYY"
                                  )
                                : "TBD"}
                            </span>
                          </div>
                          <div className="flex items-baseline gap-1.5 text-xs text-gray-700">
                            <span className=" tracking-wide text-gray-400">
                              Available
                            </span>
                            <span>{sample.isAvailable ? "Yes" : "No"}</span>
                            <span className="inline-block size-1 self-center rounded-full bg-gray-400" />
                            <span className=" tracking-wide text-gray-400">
                              In storage
                            </span>
                            <span>{sample.isStoraged ? "Yes" : "No"}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col justify-between items-end gap-2 min-w-fit">
                        <span
                          className={`text-[11px] font-semibold px-3 py-1 rounded-full border ${getStatusBadgeClass(
                            sample.status
                          )}`}
                        >
                          {titleCase(sample.status)}
                        </span>
                      </div>
                    </div>
                  </IonItem>
                ))}

                <IonInfiniteScroll
                  disabled={!labSamplesQuery.hasNextPage}
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
    case "Stored":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "QualityChecked":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "Fertilized":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "Used":
      return "bg-gray-100 text-gray-700 border-gray-200";
    case "CulturedEmbryo":
      return "bg-purple-50 text-purple-700 border-purple-200";
    case "Collected":
      return "bg-slate-50 text-slate-700 border-slate-200";
    case "Frozen":
      return "bg-cyan-50 text-cyan-700 border-cyan-200";
    case "Disposed":
      return "bg-rose-50 text-rose-700 border-rose-200";
    case "Thawed":
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
}
