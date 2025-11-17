import { IonButton, IonIcon, IonModal } from "@ionic/react";
import { useGenericDialogStore } from "@src/stores/dialog";
import { informationCircleOutline } from "ionicons/icons";
import { useShallow } from "zustand/react/shallow";

export default function GenericDialog() {
  const { data, isOpen, closeSuccessDialog } = useGenericDialogStore(
    useShallow((s) => ({
      data: s.data,
      isOpen: s.isOpen,
      closeSuccessDialog: s.closeGenericDialog,
    }))
  );

  function handleClose() {
    if (data?.closeFn) data.closeFn();
    closeSuccessDialog();
  }

  return (
    <IonModal
      isOpen={isOpen}
      onDidDismiss={closeSuccessDialog}
      backdropDismiss={data?.backdropDismiss ?? true}
      className="ion-w-fit ion-h-fit ion-b-r-[10px] ion-box-shadow"
    >
      <div
        className="size-full p-4 w-[80vw] max-h-[50vh] auto-rows-min
          grid  justify-items-center items-center gap-2"
      >
        <IonIcon
          icon={data?.svgIcon ?? informationCircleOutline}
          color={data?.svgIconColor ?? "primary"}
          className="size-10 mb-3"
        />

        <h2 className="my-0! mb-1! font-semibold! size-fit whitespace-pre-line">
          {data?.title ?? ""}
        </h2>

        <p className="text-sm font-se px-4 max-h-20 text-center overflow-y-auto whitespace-pre-line">
          {data?.content}
        </p>

        {data?.showBtn && (
          <IonButton
            size="small"
            color={data?.btnColor ?? "primary"}
            className="self-end w-full text-base mt-8"
            onClick={handleClose}
          >
            {data?.btnText ?? "Ok"}
          </IonButton>
        )}
      </div>
    </IonModal>
  );
}
