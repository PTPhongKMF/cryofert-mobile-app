import { IonIcon } from "@ionic/react";
import { person } from "ionicons/icons";
import type { RelationshipResponse } from "@src/schemas/relationship";
import RosePng from "@assets/images/rose.png";

interface CurrentRelationshipProps {
  relationshipData: RelationshipResponse;
  currentPatientId?: string;
}

export default function CurrentRelationship({
  relationshipData,
  currentPatientId,
}: CurrentRelationshipProps) {
  const isPatient1Me =
    !!currentPatientId && relationshipData.patient1Id === currentPatientId;
  const partnerInfo = isPatient1Me
    ? relationshipData.patient2Info
    : relationshipData.patient1Info;

  return (
    <div className="flex flex-col justify-start items-center gap-6 size-full pt-10 px-4">
      <h2 className="font-semibold! text-blue-600">Current Relationship</h2>

      <img src={RosePng} className="size-20" />

      <div className="w-full bg-white rounded-lg p-4 mt-10">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <IonIcon icon={person} className="text-blue-600" />
            <span className="font-semibold">Relationship Type:</span>
            <span>{relationshipData.relationshipTypeName}</span>
          </div>
          <div className="flex items-center gap-2">
            <IonIcon icon={person} className="text-blue-600" />
            <span className="font-semibold">Partner:</span>
            <span>{partnerInfo?.fullName ?? "N/A"}</span>
          </div>
          {relationshipData.establishedDate && (
            <div className="flex items-center gap-2">
              <IonIcon icon={person} className="text-blue-600" />
              <span className="font-semibold">Established:</span>
              <span>
                {new Date(
                  relationshipData.establishedDate
                ).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
