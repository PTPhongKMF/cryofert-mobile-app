import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonIcon,
} from "@ionic/react";
import { close } from "ionicons/icons";
import { useAppointmentDetailQuery } from "@src/hooks/appointment-hook";
import { useMedicalRecordQuery } from "@src/hooks/medical-record-hook";
import AppointmentDetailMedicalRecord from "@src/components/appointment-detail-segments/AppointmentDetailMedicalRecord";
import ContentSpinnerOverlay from "@src/components/layout/ContentSpinnerOverlay";

interface MedicalRecordWrapperDialogProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentId: string;
}

export default function MedicalRecordWrapperDialog({
  isOpen,
  onClose,
  appointmentId,
}: MedicalRecordWrapperDialogProps) {
  const appointmentQuery = useAppointmentDetailQuery(appointmentId);
  const appointment = appointmentQuery.data?.data;
  const patientId = appointment?.patient?.id ?? "";

  const medicalRecordQuery = useMedicalRecordQuery({
    patientId: patientId,
    appointmentId: appointmentId,
  });

  const isLoading =
    appointmentQuery.isPending ||
    (patientId && medicalRecordQuery.isPending);

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Medical Records</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onClose}>
              <IonIcon slot="icon-only" icon={close} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="relative">
        {isLoading && <ContentSpinnerOverlay />}
        <AppointmentDetailMedicalRecord medicalRecordQuery={medicalRecordQuery} />
      </IonContent>
    </IonModal>
  );
}

