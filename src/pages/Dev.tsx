import { IonButton, IonContent } from "@ionic/react";
import SafeAreaView from "@src/components/SafeAreaView";
import {
  DefaultSystemBrowserOptions,
  DefaultWebViewOptions,
  InAppBrowser,
} from "@capacitor/inappbrowser";

export default function Dev() {
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
      <SafeAreaView>
        <IonButton onClick={handleOpenInWebView}>openInWebView</IonButton>
        <IonButton onClick={handleOpenInSystemBrowser}>
          openInSystemBrowser
        </IonButton>
      </SafeAreaView>
    </IonContent>
  );
}
