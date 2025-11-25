import { IonContent, IonPage, IonSpinner, useIonRouter } from "@ionic/react";
import SafeAreaView from "@src/components/SafeAreaView";
import { ROUTES } from "@src/routes/routes";
import { useLocalUserStore } from "@src/stores/user";
import { useEffect } from "react";

export default function SplashScreen() {
  const router = useIonRouter();
  const localUser = useLocalUserStore((s) => s.localUser);
  const hasHydrated = useLocalUserStore((s) => s.hasHydrated);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    (async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (localUser) {
        router.push(ROUTES.T_HOME, "none");
      } else {
        router.push(ROUTES.L_HOME, "none");
      }
    })();
  }, [hasHydrated, router, localUser]);

  return (
    <IonPage>
      <IonContent fullscreen>
        <SafeAreaView className="relative h-full! bg-gradient-to-br from-blue-300 via-blue-200 to-blue-300">
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 200 200"
            preserveAspectRatio="none"
            aria-hidden="true"
            role="img"
          >
            <path
              d="M190 8
                 C 152 28, 130 66, 100 82
                 C 70 98, 48 120, 10 170"
              fill="none"
              stroke="#ffffff"
              strokeOpacity="0.10"
              strokeWidth="0.12rem"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M180 18
                 C 146 36, 128 68, 100 86
                 C 72 104, 54 126, 20 160"
              fill="none"
              stroke="#ffffff"
              strokeOpacity="0.07"
              strokeWidth="0.09rem"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M200 0
                 C 160 22, 135 58, 100 74
                 C 65 90, 40 118, 0 150"
              fill="none"
              stroke="#ffffff"
              strokeOpacity="0.06"
              strokeWidth="0.07rem"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <div className="relative h-full z-10 flex flex-col items-center justify-center gap-12">
            <img
              src="/favicon.png"
              className="size-28 object-contain drop-shadow-lg"
            />
            <IonSpinner name="crescent" color="primary" />
          </div>
        </SafeAreaView>
      </IonContent>
    </IonPage>
  );
}
