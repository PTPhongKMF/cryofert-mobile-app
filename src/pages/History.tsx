import {
  IonContent,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  useIonRouter,
} from "@ionic/react";
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
    const segmentParam = params.get("segment");
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
    const currentUrlSegment = params.get("segment");
    const expectedUrlSegment = segment === "appointments" ? null : segment;

    if (currentUrlSegment !== expectedUrlSegment) {
      setIsUpdatingFromUrl(true);

      if (segment === "appointments") {
        params.delete("segment");
      } else {
        params.set("segment", segment);
      }

      const newSearch = params.toString();
      const newUrl = `${location.pathname}${newSearch ? `?${newSearch}` : ""}`;
      router.push(newUrl, "none", "replace");
    }
  }, [segment, location.pathname, location.search, router]);

  return (
    <IonContent className="relative">
      <BlueToGrayGradientBg />
      <SafeAreaView className="relative">
        <div className="pt-6">
          <h1 className="text-xl! font-semibold! text-blue-500 p-0! m-0! mb-4! px-4!">
            History
          </h1>

          <IonSegment
            value={segment}
            onIonChange={(e) => {
              const newSegment = e.detail.value?.toString() ?? "appointments";
              setSegment(newSegment);
            }}
          >
            <IonSegmentButton value="appointments">
              <IonLabel>Appointments</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="treatment">
              <IonLabel>Treatment</IonLabel>
            </IonSegmentButton>
          </IonSegment>

          <div className="size-full px-4 mt-8">
            {segment === "appointments" ? (
              <AppointmentHistory />
            ) : segment === "treatment" ? (
              <TreatmentHistory />
            ) : (
              <AppointmentHistory />
            )}
          </div>
        </div>
      </SafeAreaView>
    </IonContent>
  );
}
