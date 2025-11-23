import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonButton,
  useIonRouter,
} from "@ionic/react";

export default function TestPage2() {
  const router = useIonRouter();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>Test 2</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="relative">
        <IonButton onClick={() => router}>go</IonButton>
      </IonContent>
    </IonPage>
  );
}
