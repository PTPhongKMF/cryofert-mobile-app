import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonSpinner,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  IonIcon,
  IonButton,
} from "@ionic/react";
import { useParams } from "react-router-dom";
import { useTreatmentDetailQuery } from "@src/hooks/treatment-hook";
import { useTreatmentCycleList } from "@src/hooks/treatment-cycle-hook";
import { useEffect, useState } from "react";
import TreatmentDetailInfo from "@src/components/treatment-detail-segments/TreatmentDetailInfo";
import TreatmentDetailAgreements from "@src/components/treatment-detail-segments/TreatmentDetailAgreements";
import TreatmentDetailCycles from "@src/components/treatment-detail-segments/TreatmentDetailCycles";
import { reload } from "ionicons/icons";
import ContentSpinnerOverlay from "@src/components/layout/ContentSpinnerOverlay";

export default function TreatmentDetail() {
  const [segment, setSegment] = useState("info");
  const [isManualRefetching, setIsManualRefetching] = useState(false);

  const { treatmentId } = useParams<{ treatmentId: string }>();

  const treatmentQuery = useTreatmentDetailQuery(treatmentId ?? "");
  const treatment = treatmentQuery.data?.data;

  const cyclesQuery = useTreatmentCycleList(
    treatmentId ?? "",
    treatmentQuery.isSuccess
  );
  const cycles = cyclesQuery.data?.data ?? [];

  const isLoading = treatmentQuery.isPending || cyclesQuery.isPending;

  useEffect(() => {
    if (treatmentQuery.isError) console.log(treatmentQuery.error);
    if (cyclesQuery.isError) console.log(cyclesQuery.error);
  }, [
    treatmentQuery.error,
    cyclesQuery.isError,
    cyclesQuery.error,
    treatmentQuery.isError,
  ]);

  return (
    <IonPage>
      <IonHeader className="shadow-none!">
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>
            {treatment ? (
              <>
                Treatment{" "}
                <span className="text-xs">{treatment.treatmentName}</span>
              </>
            ) : (
              "Treatment"
            )}
          </IonTitle>
          <IonButtons slot="secondary">
            <IonButton
              onClick={async () => {
                setIsManualRefetching(true);
                try {
                  await Promise.all([
                    treatmentQuery.refetch(),
                    cyclesQuery.refetch(),
                  ]);
                } finally {
                  setIsManualRefetching(false);
                }
              }}
              disabled={isLoading || isManualRefetching}
            >
              <IonIcon slot="icon-only" icon={reload} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent scrollY={false}>
        <div className="bg-blue-100 flex flex-col h-full">
          {isLoading ? (
            <ContentSpinnerOverlay />
          ) : treatmentQuery.isError || !treatment ? (
            <div className="flex justify-center items-center py-8 italic text-red-500">
              Error loading treatment details.
            </div>
          ) : (
            <div className="relative flex flex-col h-full">
              <IonSegment
                value={segment}
                onIonChange={(e) => {
                  const newSegment = e.detail.value?.toString() ?? "info";
                  setSegment(newSegment);
                }}
                className="bg-neutral-100 shrink-0 shadow-lg"
              >
                <IonSegmentButton value="info">
                  <IonLabel className="normal-case text-base">Info</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="cycles">
                  <IonLabel className="normal-case text-base">Cycles</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="agreement">
                  <IonLabel className="normal-case text-base">
                    Agreement
                  </IonLabel>
                </IonSegmentButton>
              </IonSegment>

              <div className="py-4 flex-1 min-h-0 overflow-y-auto">
                {segment === "info" ? (
                  <TreatmentDetailInfo treatment={treatment} />
                ) : segment === "cycles" ? (
                  <TreatmentDetailCycles
                    cycles={cycles}
                    isError={cyclesQuery.isError}
                  />
                ) : segment === "agreement" ? (
                  <TreatmentDetailAgreements
                    treatment={treatment}
                    onAgreementSigned={() => treatmentQuery.refetch()}
                  />
                ) : null}
              </div>
              {isManualRefetching && <ContentSpinnerOverlay />}
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
}
