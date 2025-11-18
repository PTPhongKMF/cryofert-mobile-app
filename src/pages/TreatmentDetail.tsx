import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonSpinner,
  IonNote,
  IonItem,
  IonLabel,
} from "@ionic/react";
import { useParams } from "react-router-dom";
import { format } from "@formkit/tempo";
import SafeAreaView from "@src/components/SafeAreaView";
import { useTreatmentDetailQuery } from "@src/hooks/treatment-hook";

export default function TreatmentDetail() {
  const { treatmentId } = useParams<{ treatmentId: string }>();
  const treatmentQuery = useTreatmentDetailQuery(treatmentId ?? "");

  if (treatmentQuery.isPending) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton />
            </IonButtons>
            <IonTitle>Treatment</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div className="flex justify-center items-center py-8">
            <IonSpinner name="crescent" />
          </div>
        </IonContent>
      </IonPage>
    );
  }

  if (treatmentQuery.isError || !treatmentQuery.data?.data) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton />
            </IonButtons>
            <IonTitle>Treatment</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div className="flex justify-center items-center py-8 italic text-red-500">
            Error loading treatment details.
          </div>
        </IonContent>
      </IonPage>
    );
  }

  const treatment = treatmentQuery.data.data;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>Treatment: {treatment.treatmentName}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-bg-blue-100">
        <SafeAreaView>
          <div className="px-4 py-6 space-y-4">
            {/* Basic Information */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Basic Information
              </h2>
              <div className="space-y-3">
                <IonItem className="ion-bg-transparent">
                  <IonLabel>
                    <h3 className="text-sm text-gray-500">Treatment Type</h3>
                    <p className="text-base text-gray-900">
                      {treatment.treatmentType}
                    </p>
                  </IonLabel>
                </IonItem>
                <IonItem className="ion-bg-transparent">
                  <IonLabel>
                    <h3 className="text-sm text-gray-500">Status</h3>
                    <p className="text-base text-gray-900">
                      {treatment.status}
                    </p>
                  </IonLabel>
                </IonItem>
                <IonItem className="ion-bg-transparent">
                  <IonLabel>
                    <h3 className="text-sm text-gray-500">Date Range</h3>
                    <p className="text-base text-gray-900">
                      {format(treatment.startDate, "MMM DD, YYYY")} -{" "}
                      {format(treatment.endDate, "MMM DD, YYYY")}
                    </p>
                  </IonLabel>
                </IonItem>
                <IonItem className="ion-bg-transparent">
                  <IonLabel>
                    <h3 className="text-sm text-gray-500">Diagnosis</h3>
                    <p className="text-base text-gray-900">
                      {treatment.diagnosis || "TBD"}
                    </p>
                  </IonLabel>
                </IonItem>
                {treatment.goals && (
                  <IonItem className="ion-bg-transparent">
                    <IonLabel>
                      <h3 className="text-sm text-gray-500">Goals</h3>
                      <p className="text-base text-gray-900">
                        {treatment.goals}
                      </p>
                    </IonLabel>
                  </IonItem>
                )}
              </div>
            </div>

            {/* Cost Information */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Cost Information
              </h2>
              <div className="space-y-3">
                <IonItem className="ion-bg-transparent">
                  <IonLabel>
                    <h3 className="text-sm text-gray-500">Estimated Cost</h3>
                    <p className="text-base text-gray-900">
                      {treatment.estimatedCost
                        ? `$${treatment.estimatedCost}`
                        : "TBD"}
                    </p>
                  </IonLabel>
                </IonItem>
                <IonItem className="ion-bg-transparent">
                  <IonLabel>
                    <h3 className="text-sm text-gray-500">Actual Cost</h3>
                    <p className="text-base text-gray-900">
                      {treatment.actualCost
                        ? `$${treatment.actualCost}`
                        : "TBD"}
                    </p>
                  </IonLabel>
                </IonItem>
              </div>
            </div>

            {/* IVF Specific Information */}
            {treatment.treatmentType === "IVF" && "ivf" in treatment && (
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  IVF Details
                </h2>
                <div className="space-y-3">
                  {treatment.ivf.protocol && (
                    <IonItem className="ion-bg-transparent">
                      <IonLabel>
                        <h3 className="text-sm text-gray-500">Protocol</h3>
                        <p className="text-base text-gray-900">
                          {treatment.ivf.protocol}
                        </p>
                      </IonLabel>
                    </IonItem>
                  )}
                  {treatment.ivf.stimulationStartDate && (
                    <IonItem className="ion-bg-transparent">
                      <IonLabel>
                        <h3 className="text-sm text-gray-500">
                          Stimulation Start
                        </h3>
                        <p className="text-base text-gray-900">
                          {format(
                            treatment.ivf.stimulationStartDate,
                            "MMM DD, YYYY"
                          )}
                        </p>
                      </IonLabel>
                    </IonItem>
                  )}
                  {treatment.ivf.oocyteRetrievalDate && (
                    <IonItem className="ion-bg-transparent">
                      <IonLabel>
                        <h3 className="text-sm text-gray-500">
                          Oocyte Retrieval
                        </h3>
                        <p className="text-base text-gray-900">
                          {format(
                            treatment.ivf.oocyteRetrievalDate,
                            "MMM DD, YYYY"
                          )}
                        </p>
                      </IonLabel>
                    </IonItem>
                  )}
                  {treatment.ivf.fertilizationDate && (
                    <IonItem className="ion-bg-transparent">
                      <IonLabel>
                        <h3 className="text-sm text-gray-500">Fertilization</h3>
                        <p className="text-base text-gray-900">
                          {format(
                            treatment.ivf.fertilizationDate,
                            "MMM DD, YYYY"
                          )}
                        </p>
                      </IonLabel>
                    </IonItem>
                  )}
                  {treatment.ivf.transferDate && (
                    <IonItem className="ion-bg-transparent">
                      <IonLabel>
                        <h3 className="text-sm text-gray-500">Transfer</h3>
                        <p className="text-base text-gray-900">
                          {format(treatment.ivf.transferDate, "MMM DD, YYYY")}
                        </p>
                      </IonLabel>
                    </IonItem>
                  )}
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    {treatment.ivf.oocytesRetrieved !== null && (
                      <IonItem className="ion-bg-transparent">
                        <IonLabel>
                          <h3 className="text-sm text-gray-500">
                            Oocytes Retrieved
                          </h3>
                          <p className="text-base text-gray-900">
                            {treatment.ivf.oocytesRetrieved}
                          </p>
                        </IonLabel>
                      </IonItem>
                    )}
                    {treatment.ivf.oocytesMature !== null && (
                      <IonItem className="ion-bg-transparent">
                        <IonLabel>
                          <h3 className="text-sm text-gray-500">Mature</h3>
                          <p className="text-base text-gray-900">
                            {treatment.ivf.oocytesMature}
                          </p>
                        </IonLabel>
                      </IonItem>
                    )}
                    {treatment.ivf.oocytesFertilized !== null && (
                      <IonItem className="ion-bg-transparent">
                        <IonLabel>
                          <h3 className="text-sm text-gray-500">Fertilized</h3>
                          <p className="text-base text-gray-900">
                            {treatment.ivf.oocytesFertilized}
                          </p>
                        </IonLabel>
                      </IonItem>
                    )}
                    {treatment.ivf.embryosTransferred !== null && (
                      <IonItem className="ion-bg-transparent">
                        <IonLabel>
                          <h3 className="text-sm text-gray-500">Transferred</h3>
                          <p className="text-base text-gray-900">
                            {treatment.ivf.embryosTransferred}
                          </p>
                        </IonLabel>
                      </IonItem>
                    )}
                  </div>
                  {treatment.ivf.usedICSI !== null && (
                    <IonItem className="ion-bg-transparent">
                      <IonLabel>
                        <h3 className="text-sm text-gray-500">ICSI Used</h3>
                        <p className="text-base text-gray-900">
                          {treatment.ivf.usedICSI ? "Yes" : "No"}
                        </p>
                      </IonLabel>
                    </IonItem>
                  )}
                  {treatment.ivf.outcome && (
                    <IonItem className="ion-bg-transparent">
                      <IonLabel>
                        <h3 className="text-sm text-gray-500">Outcome</h3>
                        <p className="text-base text-gray-900">
                          {treatment.ivf.outcome}
                        </p>
                      </IonLabel>
                    </IonItem>
                  )}
                  {treatment.ivf.complications && (
                    <IonItem className="ion-bg-transparent">
                      <IonLabel>
                        <h3 className="text-sm text-gray-500">Complications</h3>
                        <p className="text-base text-gray-900">
                          {treatment.ivf.complications}
                        </p>
                      </IonLabel>
                    </IonItem>
                  )}
                  {treatment.ivf.notes && (
                    <IonItem className="ion-bg-transparent">
                      <IonLabel>
                        <h3 className="text-sm text-gray-500">Notes</h3>
                        <p className="text-base text-gray-900">
                          {treatment.ivf.notes}
                        </p>
                      </IonLabel>
                    </IonItem>
                  )}
                </div>
              </div>
            )}

            {/* IUI Specific Information */}
            {treatment.treatmentType === "IUI" && "iui" in treatment && (
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  IUI Details
                </h2>
                <div className="space-y-3">
                  {treatment.iui.protocol && (
                    <IonItem className="ion-bg-transparent">
                      <IonLabel>
                        <h3 className="text-sm text-gray-500">Protocol</h3>
                        <p className="text-base text-gray-900">
                          {treatment.iui.protocol}
                        </p>
                      </IonLabel>
                    </IonItem>
                  )}
                  {treatment.iui.medications && (
                    <IonItem className="ion-bg-transparent">
                      <IonLabel>
                        <h3 className="text-sm text-gray-500">Medications</h3>
                        <p className="text-base text-gray-900">
                          {treatment.iui.medications}
                        </p>
                      </IonLabel>
                    </IonItem>
                  )}
                  {treatment.iui.monitoring && (
                    <IonItem className="ion-bg-transparent">
                      <IonLabel>
                        <h3 className="text-sm text-gray-500">Monitoring</h3>
                        <p className="text-base text-gray-900">
                          {treatment.iui.monitoring}
                        </p>
                      </IonLabel>
                    </IonItem>
                  )}
                  {treatment.iui.ovulationTriggerDate && (
                    <IonItem className="ion-bg-transparent">
                      <IonLabel>
                        <h3 className="text-sm text-gray-500">
                          Ovulation Trigger
                        </h3>
                        <p className="text-base text-gray-900">
                          {format(
                            treatment.iui.ovulationTriggerDate,
                            "MMM DD, YYYY"
                          )}
                        </p>
                      </IonLabel>
                    </IonItem>
                  )}
                  {treatment.iui.inseminationDate && (
                    <IonItem className="ion-bg-transparent">
                      <IonLabel>
                        <h3 className="text-sm text-gray-500">Insemination</h3>
                        <p className="text-base text-gray-900">
                          {format(
                            treatment.iui.inseminationDate,
                            "MMM DD, YYYY"
                          )}
                        </p>
                      </IonLabel>
                    </IonItem>
                  )}
                  {treatment.iui.motileSpermCount !== null && (
                    <IonItem className="ion-bg-transparent">
                      <IonLabel>
                        <h3 className="text-sm text-gray-500">
                          Motile Sperm Count
                        </h3>
                        <p className="text-base text-gray-900">
                          {treatment.iui.motileSpermCount}
                        </p>
                      </IonLabel>
                    </IonItem>
                  )}
                  {treatment.iui.numberOfAttempts !== null && (
                    <IonItem className="ion-bg-transparent">
                      <IonLabel>
                        <h3 className="text-sm text-gray-500">Attempts</h3>
                        <p className="text-base text-gray-900">
                          {treatment.iui.numberOfAttempts}
                        </p>
                      </IonLabel>
                    </IonItem>
                  )}
                  {treatment.iui.outcome && (
                    <IonItem className="ion-bg-transparent">
                      <IonLabel>
                        <h3 className="text-sm text-gray-500">Outcome</h3>
                        <p className="text-base text-gray-900">
                          {treatment.iui.outcome}
                        </p>
                      </IonLabel>
                    </IonItem>
                  )}
                  {treatment.iui.notes && (
                    <IonItem className="ion-bg-transparent">
                      <IonLabel>
                        <h3 className="text-sm text-gray-500">Notes</h3>
                        <p className="text-base text-gray-900">
                          {treatment.iui.notes}
                        </p>
                      </IonLabel>
                    </IonItem>
                  )}
                </div>
              </div>
            )}

            {/* Notes */}
            {treatment.notes && (
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Additional Notes
                </h2>
                <IonNote className="text-base text-gray-700">
                  {treatment.notes}
                </IonNote>
              </div>
            )}
          </div>
        </SafeAreaView>
      </IonContent>
    </IonPage>
  );
}
