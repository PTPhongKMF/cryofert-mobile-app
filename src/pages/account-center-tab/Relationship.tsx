import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonSpinner,
} from "@ionic/react";
import { useRelationshipQuery } from "@src/hooks/relationship-hook";
import RequestRelationship from "@src/components/relationship-page/RequestRelationship";
import CurrentRelationship from "@src/components/relationship-page/CurrentRelationship";

export default function Relationship() {
  const relationshipQuery = useRelationshipQuery();

  const relationshipData = relationshipQuery.data?.data?.[0];
  const hasRelationship = !!relationshipData;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>Manage Relationship</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="relative">
        <div className="size-full bg-amber-50">
          {relationshipQuery.isPending ? (
            <div className="flex justify-center items-center py-8">
              <IonSpinner name="crescent" />
            </div>
          ) : hasRelationship ? (
            <CurrentRelationship relationshipData={relationshipData} />
          ) : (
            <RequestRelationship />
          )}
        </div>
      </IonContent>
    </IonPage>
  );
}
