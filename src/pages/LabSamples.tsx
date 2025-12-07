import {
  IonContent,
  IonLabel,
  IonSegment,
  IonSegmentButton,
} from "@ionic/react";
import BlueToGrayGradientBg from "@src/components/backgrounds/BlueToGrayGradientBg";
import ContractHistory from "@src/components/lab-sample-tab/ContractHistory";
import ContractHistoryFilter from "@src/components/lab-sample-tab/ContractHistoryFilter";
import LabSampleFilter from "@src/components/lab-sample-tab/LabSampleFilter";
import LabSampleHistory from "@src/components/lab-sample-tab/LabSampleHistory";
import SafeAreaView from "@src/components/layout/SafeAreaView";
import { useState } from "react";

type LabSampleSegment = "samples" | "contracts";

export default function LabSamples() {
  const [segment, setSegment] = useState<LabSampleSegment>("samples");

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
