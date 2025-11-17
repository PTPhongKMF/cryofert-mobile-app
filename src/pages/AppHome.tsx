import { IonContent } from "@ionic/react";
import BlueToGrayGradientBg from "@src/components/backgrounds/BlueToGrayGradientBg";
import SafeAreaView from "@src/components/SafeAreaView";
import { HeartPulse } from "lucide-react";

export default function AppHome() {
  return (
    <IonContent className="relative">
      <BlueToGrayGradientBg />

      <SafeAreaView className="relative">
        <div className="pt-6 px-4">
          <h1 className="text-xl! font-semibold! text-blue-500 p-0! m-0! mb-4! flex justify-start items-center gap-2">
            <HeartPulse className="h-7 w-7 text-blue-600" />
            CryoFert
          </h1>

          <div>dsdsdsd</div>
        </div>
      </SafeAreaView>
    </IonContent>
  );
}
