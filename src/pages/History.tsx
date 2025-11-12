import {
  IonContent,
  IonLabel,
  IonSegment,
  IonSegmentButton,
} from "@ionic/react";
import SafeAreaView from "@src/components/SafeAreaView";
import BlueToGrayGradientBg from "@src/components/backgrounds/BlueToGrayGradientBg";
import AppointmentHistory from "@src/components/history-tab/AppointmentHistory";
import TreatmentHistory from "@src/components/history-tab/TreatmentHistory";
import { useState } from "react";

export default function History() {
  const [segment, setSegment] = useState("appointments");

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
            onIonChange={(e) =>
              setSegment(e.detail.value?.toString() ?? "appointments")
            }
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
