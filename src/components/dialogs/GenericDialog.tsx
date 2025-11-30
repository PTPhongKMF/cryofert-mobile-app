import { IonButton, IonIcon, IonModal } from "@ionic/react";
import { useGenericDialogStore } from "@src/stores/dialog";
import { informationCircleOutline } from "ionicons/icons";
import { useShallow } from "zustand/react/shallow";

export default function GenericDialog() {
  const { data, isOpen, closeGenericDialog } = useGenericDialogStore(
    useShallow((s) => ({
      data: s.data,
      isOpen: s.isOpen,
      closeGenericDialog: s.closeGenericDialog,
    }))
  );

  async function handleButtonClick(button: { closeFn?: () => void | Promise<void> }) {
    if (button.closeFn) {
      await button.closeFn();
    }
    closeGenericDialog();
  }

  const buttons = data?.buttons
    ? Array.isArray(data.buttons)
      ? data.buttons
      : [data.buttons]
    : [];

  return (
    <IonModal
      isOpen={isOpen}
      onDidDismiss={closeGenericDialog}
      backdropDismiss={data?.backdropDismiss ?? true}
      className="ion-w-fit ion-h-fit ion-b-r-[10px]! ion-box-shadow! bg-black/40!"
    >
      <div
        className="size-full p-4 w-[80vw] max-h-[50vh] auto-rows-min
          grid justify-items-center items-center gap-2"
      >
        <IonIcon
          icon={data?.svgIcon ?? informationCircleOutline}
          color={data?.svgIconColor ?? "primary"}
          className="size-10 mb-3"
        />

        {data?.title && (
          <h2 className="my-0! mb-1! font-semibold! h-fit w-full text-center whitespace-pre-line">
            {data.title}
          </h2>
        )}

        {data?.content && (
          <p className="text-sm font-se px-4 max-h-20 h-fit w-full text-center overflow-y-auto! whitespace-pre-line">
            {data.content}
          </p>
        )}

        {buttons.length > 0 && (
          <div className="flex gap-2 w-full mt-8">
            {buttons.map((button, index) => (
              <IonButton
                key={index}
                size="small"
                color={button.color ?? "primary"}
                className="flex-1 text-base"
                onClick={() => handleButtonClick(button)}
              >
                {button.text ?? "Ok"}
              </IonButton>
            ))}
          </div>
        )}
      </div>
    </IonModal>
  );
}
