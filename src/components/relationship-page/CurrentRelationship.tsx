import { IonIcon, IonButton } from "@ionic/react";
import RelationshipSvg from "@assets/images/relationship.svg";
import { person } from "ionicons/icons";
import type { RelationshipResponse } from "@src/schemas/relationship";

interface CurrentRelationshipProps {
  relationshipData: RelationshipResponse;
}

export default function CurrentRelationship({
  relationshipData,
}: CurrentRelationshipProps) {
  function handleRemove() {
    console.log("Remove relationship");
  }

  function handleCancelRequest() {
    console.log("Cancel relationship request");
  }

  return (
    <div className="flex flex-col justify-start items-center gap-4 size-full pt-10 px-4">
      <h2 className="font-semibold! text-blue-600">Current Relationship</h2>
      <IonIcon icon={RelationshipSvg} className="size-40 text-blue-800" />

      <div className="w-full bg-white rounded-lg p-4 mt-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <IonIcon icon={person} className="text-blue-600" />
            <span className="font-semibold">Relationship Type:</span>
            <span>{relationshipData.relationshipTypeName}</span>
          </div>
          <div className="flex items-center gap-2">
            <IonIcon icon={person} className="text-blue-600" />
            <span className="font-semibold">Partner:</span>
            <span>{relationshipData.patient2Info.fullName}</span>
          </div>
          <div className="flex items-center gap-2">
            <IonIcon icon={person} className="text-blue-600" />
            <span className="font-semibold">Email:</span>
            <span>{relationshipData.patient2Info.email}</span>
          </div>
          {relationshipData.establishedDate && (
            <div className="flex items-center gap-2">
              <IonIcon icon={person} className="text-blue-600" />
              <span className="font-semibold">Established:</span>
              <span>
                {new Date(relationshipData.establishedDate).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      </div>

      {relationshipData.isActive ? (
        <IonButton
          size="small"
          color="warning"
          onClick={handleRemove}
          className="text-base w-full normal-case font-semibold mt-10"
        >
          Remove
        </IonButton>
      ) : (
        <>
          <div className="w-full bg-yellow-100 border border-yellow-400 rounded-lg p-4 text-center">
            <p className="text-yellow-800 font-medium">
              Waiting for others to confirm
            </p>
          </div>
          <IonButton
            size="small"
            color="warning"
            onClick={handleCancelRequest}
            className="text-base w-full normal-case font-semibold mt-10"
          >
            Cancel Request
          </IonButton>
        </>
      )}
    </div>
  );
}
