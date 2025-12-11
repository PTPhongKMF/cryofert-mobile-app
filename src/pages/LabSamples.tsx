import {
  IonContent,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  useIonRouter,
} from "@ionic/react";
import BlueToGrayGradientBg from "@src/components/backgrounds/BlueToGrayGradientBg";
import ContractHistory from "@src/components/lab-sample-tab/ContractHistory";
import ContractHistoryFilter from "@src/components/lab-sample-tab/ContractHistoryFilter";
import LabSampleFilter from "@src/components/lab-sample-tab/LabSampleFilter";
import LabSampleHistory from "@src/components/lab-sample-tab/LabSampleHistory";
import SafeAreaView from "@src/components/layout/SafeAreaView";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";

type LabSampleSegment = "samples" | "contracts";

export default function LabSamples() {
  const location = useLocation();
  const router = useIonRouter();

  function getSegmentFromUrl(search: string) {
    const params = new URLSearchParams(search);
    const segmentParam = params.get("history-segment");
    return segmentParam === "contracts" ? "contracts" : "samples";
  }

  const [segment, setSegment] = useState<LabSampleSegment>(() =>
    getSegmentFromUrl(location.search)
  );
  const [isUpdatingFromUrl, setIsUpdatingFromUrl] = useState(false);

  useEffect(() => {
    if (isUpdatingFromUrl) {
      setIsUpdatingFromUrl(false);
      return;
    }

    const urlSegment = getSegmentFromUrl(location.search);
    setSegment((currentSegment) =>
      urlSegment !== currentSegment ? urlSegment : currentSegment
    );
  }, [location.search, isUpdatingFromUrl]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const currentUrlSegment = params.get("history-segment");
    const expectedUrlSegment = segment === "samples" ? null : segment;

    if (currentUrlSegment !== expectedUrlSegment) {
      setIsUpdatingFromUrl(true);

      if (segment === "samples") {
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
    <IonContent scrollY={false} className="relative">
      <BlueToGrayGradientBg />

      <SafeAreaView
        withFixedHeader={true}
        className="relative flex flex-col h-full"
      >
        <IonSegment
          value={segment}
          onIonChange={(e) => {
            const value = e.detail.value as LabSampleSegment | undefined;
            setSegment(value ?? "samples");
          }}
          className="shrink-0"
        >
          <IonSegmentButton value="samples">
            <IonLabel>Samples</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="contracts">
            <IonLabel>Contracts</IonLabel>
          </IonSegmentButton>
        </IonSegment>

        {segment === "samples" ? (
          <LabSampleFilter />
        ) : (
          <ContractHistoryFilter />
        )}

        <div className="flex-1 min-h-0 overflow-y-auto px-4 ion-content-scroll-host relative">
          {segment === "samples" ? <LabSampleHistory /> : <ContractHistory />}
        </div>
      </SafeAreaView>
    </IonContent>
  );
}
