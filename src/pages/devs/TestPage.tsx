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

export default function TestPage() {
  const router = useIonRouter();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>Test 1</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="relative">
        <IonButton onClick={() => router.push("/test2", "forward", "replace")}>
          go
        </IonButton>
      </IonContent>
    </IonPage>
  );
}
