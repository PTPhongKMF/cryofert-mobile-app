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
  useCancelRelationshipMutation,
} from "@src/hooks/relationship-hook";
import RequestRelationship from "@src/components/relationship-page/RequestRelationship";
import CurrentRelationship from "@src/components/relationship-page/CurrentRelationship";
import PendingRelationship from "@src/components/relationship-page/PendingRelationship";
import type { RelationshipResponse } from "@src/schemas/relationship";
import { useLocalUserStore } from "@src/stores/user";
import BlueToGrayGradientBg from "@src/components/backgrounds/BlueToGrayGradientBg";
import ContentSpinnerOverlay from "@src/components/layout/ContentSpinnerOverlay";
import { useGenericDialogStore } from "@src/stores/dialog";
import { alertCircleOutline, checkmarkCircleOutline } from "ionicons/icons";

export default function Relationship() {
  const localUser = useLocalUserStore((s) => s.localUser);
  const openGenericDialog = useGenericDialogStore((s) => s.openGenericDialog);

  const relationshipQuery = useRelationshipQuery();
  const requestMutation = useRequestRelationshipMutation();
  const cancelMutation = useCancelRelationshipMutation();

  const relationships = relationshipQuery.data
    ? relationshipQuery.data.data
    : [];

  const relationshipData = relationships
    .filter((r) => r.isActive && r.status === "Approved")
    .reduce<RelationshipResponse | undefined>((latest, current) => {
      if (!latest) return current;

      const latestTime = Date.parse(latest.createdAt);
      const currentTime = Date.parse(current.createdAt);

      // If parsing fails, treat it as "older" rather than crashing/switching randomly.
      const safeLatestTime = Number.isNaN(latestTime) ? 0 : latestTime;
      const safeCurrentTime = Number.isNaN(currentTime) ? 0 : currentTime;

      return safeCurrentTime >= safeLatestTime ? current : latest;
    }, undefined);

  const pendingRelationships = relationships.filter(
    (r) => r.isActive && r.status === "Pending"
  );

  function handleCancelRelationship(relationship: RelationshipResponse) {
    const isPatient1Me =
      !!localUser?.id && relationship.patient1Id === localUser.id;
    const partnerInfo = isPatient1Me
      ? relationship.patient2Info
      : relationship.patient1Info;
    const partnerName = partnerInfo?.fullName ?? "N/A";

    openGenericDialog({
      title: "Cancel Relationship Request",
      content: `Are you sure you want to cancel the relationship request with ${partnerName}?`,
      svgIcon: alertCircleOutline,
      svgIconColor: "warning",
      backdropDismiss: false,
      buttons: [
        {
          text: "Cancel",
          color: "medium",
        },
        {
          text: "Confirm",
          color: "danger",
          closeFn: () => {
            cancelMutation.mutate(
              {
                relationshipId: relationship.id,
                cancellationReason: "User cancelled",
              },
              {
                onSuccess: () => {
                  openGenericDialog({
                    title: "Cancelled",
                    content: "The relationship request has been cancelled.",
                    svgIcon: checkmarkCircleOutline,
                    svgIconColor: "success",
                    backdropDismiss: false,
                    buttons: {
                      text: "Ok",
                      color: "primary",
                      closeFn: () => {
                        relationshipQuery.refetch();
                      },
                    },
                  });
                },
                onError: (error) => {
                  openGenericDialog({
                    title: "Failed",
                    content: error.message || "Unable to cancel relationship request.",
                    svgIcon: alertCircleOutline,
                    svgIconColor: "danger",
                    backdropDismiss: true,
                  });
                },
              }
            );
          },
        },
      ],
    });
  }

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
          {(requestMutation.isPending || cancelMutation.isPending) && (
            <ContentSpinnerOverlay />
          )}
          {relationshipQuery.isFetching ? (
            <div className="flex justify-center items-center py-8">
              <IonSpinner name="crescent" />
            </div>
          ) : relationshipData ? (
            <CurrentRelationship
              relationshipData={relationshipData}
              currentPatientId={localUser?.id}
            />
          ) : pendingRelationships.length > 0 ? (
            <PendingRelationship
              pendingRelationships={pendingRelationships}
              onCancel={handleCancelRelationship}
              isCancelling={cancelMutation.isPending}
            />
          ) : (
            <RequestRelationship
              requestMutation={requestMutation}
              onRequestSuccess={() => relationshipQuery.refetch()}
            />
          )}
        </div>
      </IonContent>

      {!relationshipQuery.isPending &&
        !relationshipData &&
        pendingRelationships.length === 0 && (
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
