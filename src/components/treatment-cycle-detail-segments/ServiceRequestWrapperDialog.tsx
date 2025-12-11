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
import { useServiceRequestInAppointment } from "@src/hooks/service-request-hook";
import AppointmentDetailServiceReq from "@src/components/appointment-detail-segments/AppointmentDetailServiceReq";
import ContentSpinnerOverlay from "@src/components/layout/ContentSpinnerOverlay";

interface ServiceRequestWrapperDialogProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentId: string;
}

export default function ServiceRequestWrapperDialog({
  isOpen,
  onClose,
  appointmentId,
}: ServiceRequestWrapperDialogProps) {
  const serviceRequestQuery = useServiceRequestInAppointment(appointmentId);

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Service Requests</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onClose}>
              <IonIcon slot="icon-only" icon={close} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="relative">
        {serviceRequestQuery.isPending && <ContentSpinnerOverlay />}
        <AppointmentDetailServiceReq serviceRequestQuery={serviceRequestQuery} />
      </IonContent>
    </IonModal>
  );
}

