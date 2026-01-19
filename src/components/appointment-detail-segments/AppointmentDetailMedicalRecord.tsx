import { format } from "@formkit/tempo";
import {
  IonList,
  IonItem,
  IonLabel,
  IonAccordion,
  IonAccordionGroup,
} from "@ionic/react";
import type { UseQueryResult } from "@tanstack/react-query";
import type { HTTPError } from "ky";
import { useState } from "react";
import type { MedicalRecordApiResponse } from "@src/schemas/medical-record";
import type { MediaResponse } from "@src/schemas/media";
import MediaActionSheet from "@src/components/dialogs/MediaActionSheet";
import { ellipsisVertical } from "ionicons/icons";

interface AppointmentDetailMedicalRecordProps {
  medicalRecordQuery: UseQueryResult<MedicalRecordApiResponse, HTTPError>;
}

export default function AppointmentDetailMedicalRecord({
  medicalRecordQuery,
}: AppointmentDetailMedicalRecordProps) {
  const { data, isError } = medicalRecordQuery;
  const medicalRecords = data?.data ?? [];
  const [selectedMedia, setSelectedMedia] = useState<MediaResponse | null>(
    null,
  );

  if (isError || !data) {
    return (
      <div className="px-4">
        <div className="flex justify-center items-center py-8 italic text-red-500">
          Error loading medical records.
        </div>
      </div>
    );
  }

  if (medicalRecords.length === 0) {
    return (
      <div className="px-4">
        <div className="flex justify-center items-center py-8 italic text-gray-500">
          No medical records found for this appointment.
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 flex flex-col gap-4">
      <IonList className="bg-transparent!">
        {medicalRecords.map((record) => (
          <IonItem
            key={record.id}
            lines="none"
            button
            className="bg-gray-50 rounded-xl border border-blue-200 shadow-lg mb-4"
          >
            <div className="w-full flex flex-col gap-3 py-2">
              <div className="flex justify-between items-center">
                <IonLabel className="text-base font-semibold text-blue-500!">
                  Medical Record{" "}
                  <span className="text-xs">#{record.id.slice(-4)}</span>
                </IonLabel>
                <span className="text-xs text-black">
                  {record.appointmentDate
                    ? format(record.appointmentDate, "MMM DD, YYYY", "en")
                    : "N/A"}
                </span>
              </div>

              <div className="flex flex-col gap-2 text-sm">
                {record.chiefComplaint && (
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold">Chief Complaint:</span>
                    <span className="font-normal text-xs text-black">
                      {record.chiefComplaint}
                    </span>
                  </div>
                )}

                {record.history && (
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold">History:</span>
                    <span className="font-normal text-xs text-black">
                      {record.history}
                    </span>
                  </div>
                )}

                {record.physicalExamination && (
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold">Physical Examination:</span>
                    <span className="font-normal text-xs text-black">
                      {record.physicalExamination}
                    </span>
                  </div>
                )}

                {record.diagnosis && (
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold">Diagnosis:</span>
                    <span className="font-normal text-xs text-black">
                      {record.diagnosis}
                    </span>
                  </div>
                )}

                {record.treatmentPlan && (
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold">Treatment Plan:</span>
                    <span className="font-normal text-xs text-black">
                      {record.treatmentPlan}
                    </span>
                  </div>
                )}

                {record.followUpInstructions && (
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold">
                      Follow-up Instructions:
                    </span>
                    <span className="font-normal text-xs text-black">
                      {record.followUpInstructions}
                    </span>
                  </div>
                )}

                {record.vitalSigns && (
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold">Vital Signs:</span>
                    <span className="font-normal text-xs text-black">
                      {record.vitalSigns}
                    </span>
                  </div>
                )}

                {record.labResults && (
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold">Lab Results:</span>
                    <span className="font-normal text-xs text-black">
                      {record.labResults}
                    </span>
                  </div>
                )}

                {record.imagingResults && (
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold">Imaging Results:</span>
                    <span className="font-normal text-xs text-black">
                      {record.imagingResults}
                    </span>
                  </div>
                )}

                {record.notes && (
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold">Notes:</span>
                    <span className="font-normal text-xs text-black">
                      {record.notes}
                    </span>
                  </div>
                )}

                <div className="bg-gray-200 w-full h-0.5 my-1" />

                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>
                    Created:{" "}
                    {record.createdAt
                      ? format(record.createdAt, "MMM DD, YYYY HH:mm", "en")
                      : "N/A"}
                  </span>
                  {record.updatedAt && (
                    <span>
                      Updated:{" "}
                      {format(record.updatedAt, "MMM DD, YYYY HH:mm", "en")}
                    </span>
                  )}
                </div>
              </div>

              {(record.prescriptions?.length ?? 0) > 0 && (
                <IonAccordionGroup>
                  <IonAccordion value={`prescriptions-${record.id}`}>
                    <IonItem
                      slot="header"
                      lines="none"
                      className="w-full py-2 ion-min-h-[0rem]! ion-p-[0rem]! ion-ps-[0.5rem]! ion-b-r-[6px]"
                    >
                      <IonLabel className="text-sm text-sky-700!">
                        Prescriptions ({record.prescriptions?.length ?? 0})
                      </IonLabel>
                    </IonItem>

                    <div slot="content" className="px-0 py-2">
                      <IonList className="bg-transparent">
                        {(record.prescriptions ?? []).map(
                          (prescription, idx) => (
                            <IonItem
                              key={prescription.id}
                              lines={
                                idx < (record.prescriptions?.length ?? 0) - 1
                                  ? "full"
                                  : "none"
                              }
                              className="bg-gray-100 rounded-lg mb-2"
                            >
                              <div className="w-full flex flex-col gap-2 py-2">
                                <div className="flex justify-between items-center">
                                  <IonLabel className="text-sm font-medium!">
                                    Prescription{" "}
                                    <span className="text-xs text-gray-500">
                                      #{prescription.id.slice(-4)}
                                    </span>
                                  </IonLabel>
                                  <span className="text-xs text-gray-500 px-2 py-1 rounded bg-gray-200">
                                    {prescription.isFilled
                                      ? "Filled"
                                      : "Not filled"}
                                  </span>
                                </div>

                                <div className="flex flex-col gap-1 text-xs">
                                  <div className="flex justify-between">
                                    <span>Date:</span>
                                    <span className="text-black">
                                      {prescription.prescriptionDate
                                        ? format(
                                            prescription.prescriptionDate,
                                            "MMM DD, YYYY",
                                            "en",
                                          )
                                        : "N/A"}
                                    </span>
                                  </div>

                                  {prescription.diagnosis && (
                                    <div className="flex flex-col gap-1 mt-1">
                                      <span className="font-semibold">
                                        Diagnosis:
                                      </span>
                                      <span className="text-black">
                                        {prescription.diagnosis}
                                      </span>
                                    </div>
                                  )}

                                  {prescription.instructions && (
                                    <div className="flex flex-col gap-1 mt-1">
                                      <span className="font-semibold">
                                        Instructions:
                                      </span>
                                      <span className="text-black">
                                        {prescription.instructions}
                                      </span>
                                    </div>
                                  )}

                                  {(prescription.prescriptionDetails?.length ??
                                    0) > 0 && (
                                    <div className="flex flex-col gap-1 mt-2">
                                      <span className="font-semibold">
                                        Items (
                                        {prescription.prescriptionDetails
                                          ?.length ?? 0}
                                        ):
                                      </span>
                                      <div className="flex flex-col gap-1">
                                        {(
                                          prescription.prescriptionDetails ?? []
                                        ).map((item) => (
                                          <div
                                            key={item.id}
                                            className="flex justify-between gap-3"
                                          >
                                            <span className="text-black">
                                              {item.medicineName ??
                                                "Unknown medicine"}
                                            </span>
                                            <span className="text-gray-600">
                                              x{item.quantity}
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </IonItem>
                          ),
                        )}
                      </IonList>
                    </div>
                  </IonAccordion>
                </IonAccordionGroup>
              )}

              {(record.medias?.length ?? 0) > 0 && (
                <IonAccordionGroup>
                  <IonAccordion value={`media-${record.id}`}>
                    <IonItem
                      slot="header"
                      lines="none"
                      className="w-full py-2 ion-min-h-[0rem]! ion-p-[0rem]! ion-ps-[0.5rem]! ion-b-r-[6px]"
                    >
                      <IonLabel className="text-sm text-sky-700!">
                        Media ({record.medias?.length ?? 0})
                      </IonLabel>
                    </IonItem>

                    <div slot="content" className="px-0 py-2">
                      <IonList className="bg-transparent">
                        {(record.medias ?? []).map((media, idx) => (
                          <IonItem
                            key={media.id}
                            button
                            detail
                            detailIcon={ellipsisVertical}
                            lines={
                              idx < (record.medias?.length ?? 0) - 1
                                ? "full"
                                : "none"
                            }
                            className="bg-gray-100 rounded-lg mb-2"
                            onClick={() => setSelectedMedia(media)}
                          >
                            <div className="w-full flex justify-between items-center py-2">
                              <IonLabel className="text-sm font-medium!">
                                {media.originalFileName}
                              </IonLabel>
                            </div>
                          </IonItem>
                        ))}
                      </IonList>
                    </div>
                  </IonAccordion>
                </IonAccordionGroup>
              )}
            </div>
          </IonItem>
        ))}
      </IonList>

      <MediaActionSheet
        media={selectedMedia}
        onClose={() => setSelectedMedia(null)}
      />
    </div>
  );
}
