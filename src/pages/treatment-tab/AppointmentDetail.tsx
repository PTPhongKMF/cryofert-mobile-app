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
  IonFooter,
  IonButton,
  IonIcon,
  useIonRouter,
} from "@ionic/react";
import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router";
import { useAppointmentDetailQuery } from "@src/hooks/appointment-hook";
import AppointmentDetailInfo from "@src/components/appointment-detail-segments/AppointmentDetailInfo";
import AppointmentDetailCycles from "@src/components/appointment-detail-segments/AppointmentDetailCycles";
import { ROUTES } from "@src/routes/routes";
import { reload } from "ionicons/icons";

export default function AppointmentDetail() {
  const [segment, setSegment] = useState("info");
  const [isManualRefetching, setIsManualRefetching] = useState(false);

  const router = useIonRouter();

  const { appointmentId } = useParams<{ appointmentId: string }>();

  const appointmentQuery = useAppointmentDetailQuery(appointmentId ?? "");
  const appointment = appointmentQuery.data?.data;

  const showPayNowFooter = useMemo(() => {
    if (!appointment?.transactions?.length) return false;

    const latestPayment = [...appointment.transactions]
      .filter((transaction) => transaction.transactionType === "Payment")
      .sort(
        (a, b) =>
          new Date(b.transactionDate).getTime() -
          new Date(a.transactionDate).getTime()
      )[0];

    if (!latestPayment) return false;

    return latestPayment.status === "Pending";
  }, [appointment]);

  const isLoading = appointmentQuery.isPending;

  useEffect(() => {
    if (appointmentQuery.isError) console.log(appointmentQuery.error);
  }, [appointmentQuery.error, appointmentQuery.isError]);

  return (
    <IonPage>
      <IonHeader className="shadow-none!">
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>
            {appointment ? (
              <>
                Appointment <span className="text-xs">{appointment.typeName}</span>
              </>
            ) : (
              "Appointment"
            )}
          </IonTitle>
          <IonButtons slot="secondary">
            <IonButton
              onClick={async () => {
                setIsManualRefetching(true);
                try {
                  await appointmentQuery.refetch();
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
          ) : appointmentQuery.isError || !appointment ? (
            <div className="flex justify-center items-center py-8 italic text-red-500">
              Error loading appointment details.
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
              </IonSegment>

              <div className="py-4 flex-1 min-h-0 overflow-y-auto">
                {segment === "info" ? (
                  <AppointmentDetailInfo appointment={appointment} />
                ) : segment === "cycles" ? (
                  <AppointmentDetailCycles
                    treatmentCycle={appointment.treatmentCycle}
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

      {showPayNowFooter && appointment && (
        <IonFooter>
          <IonToolbar className="ion-px-[0.5rem]">
            <IonButton
              onClick={() =>
                router.push(
                  `${ROUTES.PAYMENT_PORTAL}?relatedEntityType=Appointment&relatedEntityId=${appointment.id}`,
                  "forward",
                  "replace"
                )
              }
              fill="solid"
              className="w-full"
            >
              Pay now
            </IonButton>
          </IonToolbar>
        </IonFooter>
      )}
    </IonPage>
  );
}
