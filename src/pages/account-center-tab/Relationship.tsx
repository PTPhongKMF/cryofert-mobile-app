import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonFooter,
  IonButton,
  IonSpinner,
} from "@ionic/react";
import {
  useRelationshipQuery,
  useRequestRelationshipMutation,
} from "@src/hooks/relationship-hook";
import RequestRelationship from "@src/components/relationship-page/RequestRelationship";
import CurrentRelationship from "@src/components/relationship-page/CurrentRelationship";
import type { RelationshipResponse } from "@src/schemas/relationship";
import { useLocalUserStore } from "@src/stores/user";
import BlueToGrayGradientBg from "@src/components/backgrounds/BlueToGrayGradientBg";
import ContentSpinnerOverlay from "@src/components/layout/ContentSpinnerOverlay";

export default function Relationship() {
  const localUser = useLocalUserStore((s) => s.localUser);

  const relationshipQuery = useRelationshipQuery();
  const requestMutation = useRequestRelationshipMutation();

  const relationships = relationshipQuery.data
    ? relationshipQuery.data.data
    : [];

  const relationshipData = relationships
    .filter((r) => r.isActive)
    .reduce<RelationshipResponse | undefined>((latest, current) => {
      if (!latest) return current;

      const latestTime = Date.parse(latest.createdAt);
      const currentTime = Date.parse(current.createdAt);

      // If parsing fails, treat it as "older" rather than crashing/switching randomly.
      const safeLatestTime = Number.isNaN(latestTime) ? 0 : latestTime;
      const safeCurrentTime = Number.isNaN(currentTime) ? 0 : currentTime;

      return safeCurrentTime >= safeLatestTime ? current : latest;
    }, undefined);

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
        <BlueToGrayGradientBg />

        <div className="size-full relative">
          {requestMutation.isPending && <ContentSpinnerOverlay />}
          {relationshipQuery.isPending ? (
            <div className="flex justify-center items-center py-8">
              <IonSpinner name="crescent" />
            </div>
          ) : relationshipData ? (
            <CurrentRelationship
              relationshipData={relationshipData}
              currentPatientId={localUser?.id}
            />
          ) : (
            <RequestRelationship
              requestMutation={requestMutation}
              onRequestSuccess={() => relationshipQuery.refetch()}
            />
          )}
        </div>
      </IonContent>

      {!relationshipQuery.isPending && !relationshipData && (
        <IonFooter>
          <div className="p-2 bg-transparent">
            <IonButton
              type="submit"
              form="request-relationship-form"
              size="small"
              disabled={requestMutation.isPending || !localUser?.id}
              className="text-base w-full normal-case font-semibold ion-bg-blue-600"
            >
              {requestMutation.isPending ? "Requesting..." : "Request"}
            </IonButton>
          </div>
        </IonFooter>
      )}

      {/*
        TODO: enable relationship actions later (move out of CurrentRelationship.tsx).
        Idea:
        - if relationshipData.isActive -> show Remove button here
        - else -> show "Waiting for others to confirm" + Cancel Request button here
      */}
      {/* {!relationshipQuery.isPending && relationshipData && (
        <IonFooter>
          <div className="p-2 bg-transparent">
            <IonButton size="small" color="warning" className="text-base w-full normal-case font-semibold">
              Remove
            </IonButton>
          </div>
        </IonFooter>
      )} */}
    </IonPage>
  );
}
