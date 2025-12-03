import {
  IonContent,
  IonLabel,
  IonSegment,
  IonSegmentButton,
} from "@ionic/react";
import BlueToGrayGradientBg from "@src/components/backgrounds/BlueToGrayGradientBg";
import LabSampleFilter from "@src/components/LabSampleFilter";
import LabSampleHistory from "@src/components/LabSampleHistory";
import SafeAreaView from "@src/components/SafeAreaView";
import { useState } from "react";

type LabSampleSegment = "samples" | "tbd";

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
          <IonSegmentButton value="tbd">
            <IonLabel>TBD</IonLabel>
          </IonSegmentButton>
        </IonSegment>

        {segment === "samples" && <LabSampleFilter />}

        <div className="flex-1 min-h-0 overflow-y-auto px-4 ion-content-scroll-host">
          {segment === "samples" ? (
            <LabSampleHistory />
          ) : (
            <div className="w-full h-full flex items-center justify-center pb-6">
              <p className="text-sm text-gray-600 italic">TBD</p>
            </div>
          )}
        </div>
      </SafeAreaView>
    </IonContent>
  );
}
