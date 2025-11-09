import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

export default function TreatmentBooking() {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>Treatment Booking</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>sds</IonContent>

      <IonFooter>
        <IonToolbar></IonToolbar>
      </IonFooter>
    </IonPage>
  );
}
