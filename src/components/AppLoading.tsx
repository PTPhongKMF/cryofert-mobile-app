import { IonModal, IonSpinner } from "@ionic/react";
import { useAppLoadingStore } from "@src/stores/app-loading";

export default function AppLoading() {
  const isOpen = useAppLoadingStore((s) => s.loaders.size > 0);

  return (
    <IonModal
      animated={false}
      isOpen={isOpen}
      backdropDismiss={false}
      className="ion-w-fit ion-h-fit ion-bg-transparent z-100 bg-black/40"
    >
      <IonSpinner name="circular" className="text-blue-700 size-10" />
    </IonModal>
  );
}
