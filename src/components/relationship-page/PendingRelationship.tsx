import { IonButton, IonIcon, IonList, IonItem } from "@ionic/react";
import { person } from "ionicons/icons";
import type { RelationshipResponse } from "@src/schemas/relationship";
import RosePng from "@assets/images/rose.png";
import { useLocalUserStore } from "@src/stores/user";

interface PendingRelationshipProps {
  pendingRelationships: RelationshipResponse[];
  onCancel: (relationship: RelationshipResponse) => void;
  isCancelling: boolean;
}

export default function PendingRelationship({
  pendingRelationships,
  onCancel,
  isCancelling,
}: PendingRelationshipProps) {
  const localUser = useLocalUserStore((s) => s.localUser);

  return (
    <div className="flex flex-col justify-start items-center gap-6 size-full pt-10 px-4">
      <h2 className="font-semibold! text-blue-600">Pending Relationships</h2>

      <img src={RosePng} className="size-20" />

      <div className="w-full bg-white rounded-lg p-4 mt-10">
        <IonList className="w-full">
          {pendingRelationships.map((relationship) => {
            const isPatient1Me =
              !!localUser?.id && relationship.patient1Id === localUser.id;
            const partnerInfo = isPatient1Me
              ? relationship.patient2Info
              : relationship.patient1Info;

            return (
              <IonItem key={relationship.id} lines="none" className="ion-bg-transparent">
                <div className="flex justify-between items-center w-full gap-4">
                  <div className="flex items-center gap-2 flex-1">
                    <IonIcon icon={person} className="text-blue-600" />
                    <div className="flex flex-col">
                      <span className="font-semibold">
                        {partnerInfo?.fullName ?? "N/A"}
                      </span>
                      <span className="text-sm text-gray-600">
                        {partnerInfo?.patientCode ?? "N/A"}
                      </span>
                    </div>
                  </div>
                  
                  <IonButton
                    color="danger"
                    fill="outline"
                    disabled={isCancelling}
                    onClick={() => onCancel(relationship)}
                    className="min-w-fit"
                  >
                    Remove
                  </IonButton>
                </div>
              </IonItem>
            );
          })}
        </IonList>
      </div>
    </div>
  );
}
