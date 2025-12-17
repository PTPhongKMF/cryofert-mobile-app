import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonModal,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import PdfWebViewer from "@src/components/PdfWebViewer";
import { chevronBack } from "ionicons/icons";
import type { Dispatch, SetStateAction } from "react";

interface GenericViewPdfDialogProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  fileUrl?: string;
  title?: string;
}

export default function GenericViewPdfDialog({
  isOpen,
  setIsOpen,
  fileUrl,
  title = "PDF Viewer",
}: GenericViewPdfDialogProps) {
  function handleClose() {
    setIsOpen(false);
  }

  return (
    <IonModal isOpen={isOpen} onDidDismiss={handleClose}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={handleClose}>
              <IonIcon icon={chevronBack} slot="icon-only" />
            </IonButton>
          </IonButtons>
          <IonTitle className="ms-4">{title}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="relative h-full">
          <PdfWebViewer fileUrl={fileUrl} className="w-full h-full min-h-[70vh]" />
        </div>
      </IonContent>
    </IonModal>
  );
}


