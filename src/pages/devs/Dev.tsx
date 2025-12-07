import { IonButton, IonContent, IonInput, useIonRouter } from "@ionic/react";
import SafeAreaView from "@src/components/layout/SafeAreaView";
import {
  DefaultSystemBrowserOptions,
  DefaultWebViewOptions,
  InAppBrowser,
} from "@capacitor/inappbrowser";
import AnimatedProgressLine from "@src/components/AnimatedProgressLine";

export default function Dev() {
  const router = useIonRouter();

  async function handleOpenInWebView() {
    await InAppBrowser.openInWebView({
      url: "https://github.com/PTPhongKMF/cryofert-mobile-app",
      options: DefaultWebViewOptions,
    });
  }

  async function handleOpenInSystemBrowser() {
    await InAppBrowser.openInSystemBrowser({
      url: "https://github.com/PTPhongKMF/cryofert-mobile-app",
      options: DefaultSystemBrowserOptions,
    });
  }

  return (
    <IonContent>
      <SafeAreaView className="bg-neutral-100">
        <IonButton onClick={handleOpenInWebView}>openInWebView</IonButton>
        <IonButton onClick={handleOpenInSystemBrowser}>
          openInSystemBrowser
        </IonButton>

        <IonButton onClick={() => router.push("/test")}>test page 1</IonButton>

        <AnimatedProgressLine className="h-64" />

        <div className="mt-4 w-full flex flex-col gap-5 p-2">
          <IonInput
            label="test"
            labelPlacement="stacked"
            mode="md"
            fill="outline"
            className="ion-bg-white! ion-b-r-[7px]!"
          />
          <IonInput className="ion-bg-white! ion-b-r-[7px]!" />
        </div>
      </SafeAreaView>
    </IonContent>
  );
}
