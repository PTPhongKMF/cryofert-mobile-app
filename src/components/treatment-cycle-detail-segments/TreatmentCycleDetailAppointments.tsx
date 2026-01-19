import { format } from "@formkit/tempo";
import { IonItem, IonLabel, IonButton } from "@ionic/react";
import { useIonRouter } from "@ionic/react";
import { useState } from "react";
import type { TreatmentCycleDetailResponse } from "@src/schemas/treatment-cycle";
import { ROUTES } from "@src/routes/routes";
import ServiceRequestWrapperDialog from "./ServiceRequestWrapperDialog";
import MedicalRecordWrapperDialog from "./MedicalRecordWrapperDialog";

interface TreatmentCycleDetailAppointmentsProps {
  appointments: TreatmentCycleDetailResponse["appointments"];
}

export default function TreatmentCycleDetailAppointments({
  appointments,
}: TreatmentCycleDetailAppointmentsProps) {
  const router = useIonRouter();
  const [serviceRequestDialogOpen, setServiceRequestDialogOpen] =
    useState(false);
  const [medicalRecordDialogOpen, setMedicalRecordDialogOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    string | null
  >(null);

  if (appointments.length === 0) {
    return (
      <div className="px-4">
        <div className="flex justify-center items-center py-8 italic text-gray-500">
          No appointments found for this cycle.
        </div>
      </div>
    );
  }

  const handleViewServiceRequest = (appointmentId: string) => {
    setSelectedAppointmentId(appointmentId);
    setServiceRequestDialogOpen(true);
  };

  const handleViewMedicalRecord = (appointmentId: string) => {
    setSelectedAppointmentId(appointmentId);
    setMedicalRecordDialogOpen(true);
  };

  const handleViewDetails = (appointmentId: string) => {
    router.push(`${ROUTES.APPOINTMENT}/${appointmentId}`, "forward");
  };

  return (
    <>
      <div className="px-4 flex flex-col gap-4">
        {appointments.map((appointment) => (
          <div
            key={appointment.id}
            className="bg-gray-50 rounded-xl border border-blue-200 shadow-lg"
          >
            <IonItem lines="none" className="bg-transparent">
              <div className="w-full flex flex-col gap-2 py-2">
                <div className="flex justify-between items-center">
                  <IonLabel className="text-base font-semibold text-blue-500">
                    {appointment.type}
                  </IonLabel>
                  <span className="text-xs text-black px-2 py-1 rounded bg-gray-100">
                    {appointment.status}
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold">Date:</span>
                  <span className="font-normal text-xs text-black">
                    {appointment.appointmentDate
                      ? format(
                          appointment.appointmentDate,
                          "MMM DD, YYYY",
                          "en",
                        )
                      : "N/A"}
                  </span>
                </div>
              </div>
            </IonItem>

            <div className="px-4 pb-4 flex flex-col gap-2">
              <div className="flex gap-2">
                <IonButton
                  fill="outline"
                  size="small"
                  className="flex-1"
                  onClick={() => handleViewServiceRequest(appointment.id)}
                >
                  View Service Request
                </IonButton>
                <IonButton
                  fill="outline"
                  size="small"
                  className="flex-1"
                  onClick={() => handleViewMedicalRecord(appointment.id)}
                >
                  View Medical Record
                </IonButton>
              </div>
              <IonButton
                fill="solid"
                size="small"
                className="w-full"
                onClick={() => handleViewDetails(appointment.id)}
              >
                Details
              </IonButton>
            </div>
          </div>
        ))}
      </div>

      {selectedAppointmentId && (
        <>
          <ServiceRequestWrapperDialog
            isOpen={serviceRequestDialogOpen}
            onClose={() => {
              setServiceRequestDialogOpen(false);
              setSelectedAppointmentId(null);
            }}
            appointmentId={selectedAppointmentId}
          />
          <MedicalRecordWrapperDialog
            isOpen={medicalRecordDialogOpen}
            onClose={() => {
              setMedicalRecordDialogOpen(false);
              setSelectedAppointmentId(null);
            }}
            appointmentId={selectedAppointmentId}
          />
        </>
      )}
    </>
  );
}
