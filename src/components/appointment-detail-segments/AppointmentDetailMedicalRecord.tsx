import { format } from "@formkit/tempo";
import { IonList, IonItem, IonLabel } from "@ionic/react";
import type { UseQueryResult } from "@tanstack/react-query";
import type { HTTPError } from "ky";
import type { MedicalRecordApiResponse } from "@src/schemas/medical-record";

interface AppointmentDetailMedicalRecordProps {
  medicalRecordQuery: UseQueryResult<MedicalRecordApiResponse, HTTPError>;
}

export default function AppointmentDetailMedicalRecord({
  medicalRecordQuery,
}: AppointmentDetailMedicalRecordProps) {
  const { data, isError } = medicalRecordQuery;
  const medicalRecords = data?.data ?? [];

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
      <IonList className="bg-transparent">
        {medicalRecords.map((record) => (
          <IonItem
            key={record.id}
            lines="full"
            className="bg-gray-50 rounded-xl border border-blue-200 shadow-lg mb-4"
          >
            <div className="w-full flex flex-col gap-3 py-2">
              <div className="flex justify-between items-center">
                <IonLabel className="text-base font-semibold text-blue-500">
                  Medical Record
                </IonLabel>
                <span className="text-xs text-black">
                  {record.appointmentDate
                    ? format(record.appointmentDate, "MMM DD, YYYY")
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
                    <span className="font-semibold">Follow-up Instructions:</span>
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
                      ? format(record.createdAt, "MMM DD, YYYY HH:mm")
                      : "N/A"}
                  </span>
                  {record.updatedAt && (
                    <span>
                      Updated: {format(record.updatedAt, "MMM DD, YYYY HH:mm")}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </IonItem>
        ))}
      </IonList>
    </div>
  );
}
