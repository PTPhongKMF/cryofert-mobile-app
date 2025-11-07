import { IonButton, IonIcon, IonModal } from "@ionic/react";
import { useAlertDialogStore } from "@src/stores/dialog";
import { alertCircleSharp } from "ionicons/icons";
import { useShallow } from "zustand/react/shallow";

export default function AlertDialog() {
  const { data, isOpen, closeAlertDialog } = useAlertDialogStore(
    useShallow((s) => ({
      data: s.data,
      isOpen: s.isOpen,
      closeAlertDialog: s.closeAlertDialog,
    }))
  );

  return (
    <IonModal
      isOpen={isOpen}
      onDidDismiss={closeAlertDialog}
      backdropDismiss={false}
      className="ion-w-fit ion-h-fit ion-b-r-[10px] ion-box-shadow"
    >
      <div
        className="size-full p-4 w-[80vw] max-h-[50vh]
      grid grid-rows-[2.5rem_3rem_1fr_3rem] justify-items-center items-center gap-2"
      >
        <IonIcon icon={alertCircleSharp} color="danger" className="size-10" />
        <h2 className="mt-0! font-semibold!">{data?.title ?? ""}</h2>
        <p className="text-sm font-se px-4 py-1 max-h-20 overflow-y-auto">
          {data?.content ?? ""}
        </p>

        <IonButton
          size="small"
          className="self-end w-full text-base"
          onClick={closeAlertDialog}
        >
          Ok
        </IonButton>
      </div>
    </IonModal>
  );
}
