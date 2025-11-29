import {
  IonContent,
  IonHeader,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import AppTabHeader from "@src/components/AppTabHeader";
import SafeAreaView from "@src/components/SafeAreaView";
import BlueToGrayGradientBg from "@src/components/backgrounds/BlueToGrayGradientBg";
import AppointmentHistory from "@src/components/history-tab/AppointmentHistory";
import TreatmentHistory from "@src/components/history-tab/TreatmentHistory";
import { useState, useEffect } from "react";
import { useLocation } from "react-router";

export default function History() {
  const location = useLocation();
  const router = useIonRouter();

  function getSegmentFromUrl(search: string) {
    const params = new URLSearchParams(search);
    const segmentParam = params.get("history-segment");
    return segmentParam === "treatment" ? "treatment" : "appointments";
  }

  const [segment, setSegment] = useState(() =>
    getSegmentFromUrl(location.search)
  );
  const [isUpdatingFromUrl, setIsUpdatingFromUrl] = useState(false);

  useEffect(() => {
    if (isUpdatingFromUrl) {
      setIsUpdatingFromUrl(false);
      return;
    }

    const urlSegment = getSegmentFromUrl(location.search);
    setSegment((currentSegment) => {
      return urlSegment !== currentSegment ? urlSegment : currentSegment;
    });
  }, [location.search, isUpdatingFromUrl]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const currentUrlSegment = params.get("history-segment");
    const expectedUrlSegment = segment === "appointments" ? null : segment;

    if (currentUrlSegment !== expectedUrlSegment) {
      setIsUpdatingFromUrl(true);

      if (segment === "appointments") {
        params.delete("history-segment");
      } else {
        params.set("history-segment", segment);
      }

      const newSearch = params.toString();
      const newUrl = `${location.pathname}${newSearch ? `?${newSearch}` : ""}`;
      router.push(newUrl, "none", "replace");
    }
  }, [segment, location.pathname, location.search, router]);

  return (
    <>
      <AppTabHeader />

      <IonContent scrollY={false} className="relative">
        <BlueToGrayGradientBg />
        <SafeAreaView
          withFixedHeader={true}
          className="relative flex flex-col h-full"
        >
          <IonSegment
            value={segment}
            onIonChange={(e) => {
              const newSegment = e.detail.value?.toString() ?? "appointments";
              setSegment(newSegment);
            }}
            className="shrink-0"
          >
            <IonSegmentButton value="appointments">
              <IonLabel>Appointments</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="treatment">
              <IonLabel>Treatment</IonLabel>
            </IonSegmentButton>
          </IonSegment>

          <div className="flex-1 min-h-0 overflow-y-auto px-4 ion-content-scroll-host">
            {segment === "appointments" ? (
              <AppointmentHistory />
            ) : segment === "treatment" ? (
              <TreatmentHistory />
            ) : (
              <AppointmentHistory />
            )}
          </div>
        </SafeAreaView>
      </IonContent>
    </>
  );
}
