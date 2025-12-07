import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonSpinner,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonButton,
  IonIcon,
} from "@ionic/react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTreatmentCycleDetailQuery } from "@src/hooks/treatment-cycle-hook";
import TreatmentCycleDetailInfo from "@src/components/treatment-cycle-detail-segments/TreatmentCycleDetailInfo";
import TreatmentCycleDetailAppointments from "@src/components/treatment-cycle-detail-segments/TreatmentCycleDetailAppointments";
import { reload } from "ionicons/icons";

export default function TreatmentCycleDetail() {
  const [segment, setSegment] = useState("info");
  const [isManualRefetching, setIsManualRefetching] = useState(false);

  const { cycleId } = useParams<{ cycleId: string }>();

  const cycleQuery = useTreatmentCycleDetailQuery(cycleId ?? "");
  const cycle = cycleQuery.data?.data;

  const isLoading = cycleQuery.isPending;

  useEffect(() => {
    if (cycleQuery.isError) console.log(cycleQuery.error);
  }, [cycleQuery.error, cycleQuery.isError]);

  return (
    <IonPage>
      <IonHeader className="shadow-none!">
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>
            {cycle ? (
              <>
                Cycle <span className="text-xs">{cycle.cycleName}</span>
              </>
            ) : (
              "Treatment Cycle"
            )}
          </IonTitle>
          <IonButtons slot="secondary">
            <IonButton
              onClick={async () => {
                setIsManualRefetching(true);
                try {
                  await cycleQuery.refetch();
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
            <div className="flex justify-center items-center py-8">
              <IonSpinner name="crescent" />
            </div>
          ) : cycleQuery.isError || !cycle ? (
            <div className="flex justify-center items-center py-8 italic text-red-500">
              Error loading cycle details.
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
                <IonSegmentButton value="appointments">
                  <IonLabel className="normal-case text-base">
                    Appointments
                  </IonLabel>
                </IonSegmentButton>
              </IonSegment>

              <div className="py-4 flex-1 min-h-0 overflow-y-auto">
                {segment === "info" ? (
                  <TreatmentCycleDetailInfo cycle={cycle} />
                ) : segment === "appointments" ? (
                  <TreatmentCycleDetailAppointments
                    appointments={cycle.appointments}
                  />
                ) : null}
              </div>

              {isManualRefetching && (
                <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10">
                  <IonSpinner name="crescent" />
                </div>
              )}
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
}
