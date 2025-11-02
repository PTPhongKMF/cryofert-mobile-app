import { IonContent, IonPage, useIonRouter } from "@ionic/react";
import { useEffect } from "react";

export default function SplashScreen() {
  const router = useIonRouter();

  useEffect(() => {
    (async function init() {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      router.push("/tabs");
    })();
  }, []);

  return (
    <IonPage>
      <IonContent>
        <div className="flex justify-center items-center">
          <div className="flex flex-col justify-center items-center">
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
