import { IonContent } from "@ionic/react";
import AppTabHeader from "@src/components/AppTabHeader";
import BlueToGrayGradientBg from "@src/components/backgrounds/BlueToGrayGradientBg";
import SafeAreaView from "@src/components/SafeAreaView";

export default function Samples() {
  return (
    <IonContent className="relative">
      <BlueToGrayGradientBg />

      <SafeAreaView withFixedHeader={true} className="relative">
        <div className="pt-6 px-4"></div>
      </SafeAreaView>
    </IonContent>
  );
}
