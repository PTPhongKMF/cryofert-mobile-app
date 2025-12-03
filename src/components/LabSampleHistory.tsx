import {
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonItem,
  IonList,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
} from "@ionic/react";
import LabSampleFilter from "@src/components/LabSampleFilter";
import { useLabSampleInfiniteQuery } from "@src/hooks/lab-sample-hook";
import type { LabSampleListApiResponse } from "@src/schemas/lab-sample";
import { useLocalUserStore } from "@src/stores/user";
import { format } from "@formkit/tempo";
import { Fragment } from "react";
import { titleCase } from "text-case";

export default function LabSampleHistory() {
  const localUser = useLocalUserStore((s) => s.localUser);
  const labSamplesQuery = useLabSampleInfiniteQuery(localUser?.id || "");

  const labSamples =
    labSamplesQuery.data?.pages.flatMap(
      (page: LabSampleListApiResponse) => page.data
    ) ?? [];

  const totalSamples =
    labSamplesQuery.data?.pages[0]?.metaData?.total ?? labSamples.length;
  const availableSamples = labSamples.filter((sample) => sample.isAvailable);
  const storedSamples = labSamples.filter((sample) => sample.isStoraged);

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
          <IonList className="bg-transparent!">
            {labSamplesQuery.isSuccess && labSamples.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 text-center text-sm text-gray-600 italic">
                No lab samples found for your account.
              </div>
            ) : (
              <>
                {labSamples.map((sample) => (
                  <IonItem
                    key={sample.id}
                    lines="none"
                    className="ion-bg-transparent"
                  >
                    <div className="w-full py-3 flex flex-col gap-3 border-b border-blue-50">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-[11px] uppercase tracking-wide text-gray-400">
                            Sample code
                          </p>
                          <p className="text-base font-semibold text-gray-900">
                            {sample.sampleCode}
                          </p>
                        </div>

                        <span
                          className={`text-[11px] font-semibold px-3 py-1 rounded-full border ${getStatusBadgeClass(
                            sample.status
                          )}`}
                        >
                          {titleCase(sample.status)}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                        <div>
                          <p className="text-[11px] uppercase tracking-wide text-gray-400">
                            Type
                          </p>
                          <p className="text-sm font-semibold text-gray-900">
                            {titleCase(sample.sampleType)}
                          </p>
                        </div>
                        <div>
                          <p className="text-[11px] uppercase tracking-wide text-gray-400">
                            Collection
                          </p>
                          <p className="text-sm">
                            {sample.collectionDate
                              ? format(sample.collectionDate, "MMM DD, YYYY")
                              : "Pending"}
                          </p>
                        </div>
                        <div>
                          <p className="text-[11px] uppercase tracking-wide text-gray-400">
                            Storage date
                          </p>
                          <p className="text-sm">
                            {sample.storageDate
                              ? format(sample.storageDate, "MMM DD, YYYY")
                              : "Pending"}
                          </p>
                        </div>
                        <div>
                          <p className="text-[11px] uppercase tracking-wide text-gray-400">
                            Expiry date
                          </p>
                          <p className="text-sm">
                            {sample.expiryDate
                              ? format(sample.expiryDate, "MMM DD, YYYY")
                              : "TBD"}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <span
                          className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border ${
                            sample.isAvailable
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          {sample.isAvailable ? "Available" : "Reserved"}
                        </span>
                        <span
                          className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border ${
                            sample.isStoraged
                              ? "bg-cyan-50 text-cyan-700 border-cyan-200"
                              : "bg-gray-50 text-gray-600 border-gray-200"
                          }`}
                        >
                          {sample.isStoraged
                            ? "In cryo storage"
                            : "Awaiting storage"}
                        </span>
                        {sample.quality && (
                          <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full border bg-indigo-50 text-indigo-700 border-indigo-200">
                            Quality: {sample.quality}
                          </span>
                        )}
                      </div>

                      {sample.notes && (
                        <p className="text-xs text-gray-500 italic line-clamp-2">
                          Notes: {sample.notes}
                        </p>
                      )}
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
