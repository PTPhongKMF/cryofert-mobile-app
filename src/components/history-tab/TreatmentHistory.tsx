import {
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonItem,
  IonList,
  IonNote,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
  useIonRouter,
} from "@ionic/react";
import type { TreatmentApiResponse } from "@src/schemas/treatment";
import { useTreatementInfiniteQuery } from "@src/services/api-services/treatment-service";
import { useLocalUserStore } from "@src/stores/user";
import { format } from "@formkit/tempo";
import { ROUTES } from "@src/routes/routes";

export default function TreatmentHistory() {
  const router = useIonRouter();

  const localUser = useLocalUserStore((s) => s.localUser);

  const treatmentQuery = useTreatementInfiniteQuery(localUser?.id || "");

  const treatments =
    treatmentQuery.data?.pages.flatMap(
      (page: TreatmentApiResponse) => page.data
    ) ?? [];

  async function handleLoadMore(e: CustomEvent<void>) {
    await treatmentQuery.fetchNextPage();
    (e.target as HTMLIonInfiniteScrollElement)?.complete();
  }

  async function handleRefresh(e: CustomEvent) {
    await treatmentQuery.refetch();
    e.detail.complete();
  }

  if (treatmentQuery.isPending) {
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

        {!treatmentQuery.isLoading &&
        treatmentQuery.isSuccess &&
        treatments.length === 0 ? (
          <div className="flex justify-center items-center py-8 italic text-gray-500">
            No treatments found.
          </div>
        ) : (
          <>
            {treatments.map((treatment) => (
              <IonItem
                button
                detail
                key={treatment.id}
                onClick={() =>
                  router.push(`${ROUTES.TREATMENT_DETAIL}/${treatment.id}`)
                }
                className="ion-bg-transparent"
              >
                <div className="flex flex-col gap-2 w-full py-2">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-gray-900">
                      <p className="text-base">{treatment.treatmentName}</p>
                      <p className="text-xs text-gray-600 mt-1">
                        {treatment.treatmentType}
                      </p>
                    </div>
                    <div className="text-xs text-gray-500 px-2 py-1 rounded bg-gray-100">
                      {treatment.status}
                    </div>
                  </div>

                  <div className="text-sm text-gray-700">
                    <span>
                      {format(treatment.startDate, "MMM DD, YYYY")}
                      {" - "}
                      {format(treatment.endDate, "MMM DD, YYYY")}
                    </span>
                  </div>

                  <IonNote className="text-xs text-gray-600 mt-1 line-clamp-2">
                    Diagnosis: {treatment.diagnosis || "TBD"}
                  </IonNote>

                  <div className="flex items-center gap-4 text-xs text-gray-600 mt-1">
                    <span>
                      Est. Cost:{" "}
                      {treatment.estimatedCost
                        ? `$${treatment.estimatedCost}`
                        : "TBD"}
                    </span>
                    <span>
                      Actual Cost:{" "}
                      {treatment.actualCost
                        ? `$${treatment.actualCost}`
                        : "TBD"}
                    </span>
                  </div>
                </div>
              </IonItem>
            ))}

            <IonInfiniteScroll
              disabled={!treatmentQuery.hasNextPage}
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
