import { IonButton, IonIcon, IonModal } from "@ionic/react";
import { useSuccessDialogStore } from "@src/stores/dialog";
import { checkmarkCircle } from "ionicons/icons";
import { useShallow } from "zustand/react/shallow";

export default function SuccessDialog() {
  const { data, isOpen, closeSuccessDialog } = useSuccessDialogStore(
    useShallow((s) => ({
      data: s.data,
      isOpen: s.isOpen,
      closeSuccessDialog: s.closeSuccessDialog,
    }))
  );

  function handleClose() {
    closeSuccessDialog();
    if (data?.closeFn) data.closeFn();
  }

  return (
    <IonModal
      isOpen={isOpen}
      onDidDismiss={handleClose}
      backdropDismiss={false}
      className="ion-w-fit ion-h-fit ion-b-r-[10px] ion-box-shadow"
    >
      <div
        className="size-full p-4 w-[80vw] max-h-[50vh]
          grid grid-rows-[2.5rem_3rem_1fr_3rem] justify-items-center items-center gap-2"
      >
        <IonIcon icon={checkmarkCircle} color="success" className="size-10" />
        <h2 className="mt-0! font-semibold!">{data?.title ?? ""}</h2>
        <p className="text-sm font-se px-4 py-1 max-h-20 overflow-y-auto">
          {data?.content ?? ""}
        </p>

        <IonButton
          size="small"
          className="self-end w-full text-base"
          onClick={handleClose}
        >
          Ok
        </IonButton>
      </div>
    </IonModal>
  );
}
