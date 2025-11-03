import { IonContent } from "@ionic/react";
import React from "react";
import SafeAreaView from "@src/components/SafeAreaView";

export default function Home() {
  const [safeAreas, setSafeAreas] = React.useState({
    top: "",
    right: "",
    bottom: "",
    left: "",
  });

  React.useEffect(() => {
    const readVars = () => {
      const style = getComputedStyle(document.documentElement);
      setSafeAreas({
        top: style.getPropertyValue("--ion-safe-area-top").trim(),
        right: style.getPropertyValue("--ion-safe-area-right").trim(),
        bottom: style.getPropertyValue("--ion-safe-area-bottom").trim(),
        left: style.getPropertyValue("--ion-safe-area-left").trim(),
      });
    };

    readVars();
    window.addEventListener("resize", readVars);
    return () => window.removeEventListener("resize", readVars);
  }, []);

  return (
    <IonContent>
      <SafeAreaView className="flex flex-col justify-center items-center bg-blue-200">
        <div>Xin chào các bạn cô chú các bác</div>
        <div className="text-sm opacity-70">
          <div>--ion-safe-area-top: {safeAreas.top || "(empty)"}</div>
          <div>--ion-safe-area-right: {safeAreas.right || "(empty)"}</div>
          <div>--ion-safe-area-bottom: {safeAreas.bottom || "(empty)"}</div>
          <div>--ion-safe-area-left: {safeAreas.left || "(empty)"}</div>
        </div>
      </SafeAreaView>
    </IonContent>
  );
}
