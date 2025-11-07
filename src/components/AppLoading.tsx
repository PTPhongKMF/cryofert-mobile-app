import { IonLoading } from "@ionic/react";
import { useAppLoadingStore } from "@src/stores/app-loading";
import React from "react";

export default function AppLoading() {
  const appLoadingState = useAppLoadingStore((s) => s.appLoadingState);

  return (
    <IonLoading
      isOpen={appLoadingState}
      keyboardClose
      spinner="circular"
      className="ion-bg-transparent! ion-spinner-c-blue-700!"
    />
  );
}
