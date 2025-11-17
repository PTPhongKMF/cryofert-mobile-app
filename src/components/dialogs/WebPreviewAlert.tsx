import { IonButton, IonIcon, IonModal, useIonRouter } from "@ionic/react";
import { informationCircleOutline } from "ionicons/icons";
import { useState } from "react";

export default function WebPreviewAlert() {
  const [isOpen, setIsOpen] = useState(
    sessionStorage.getItem("webPreviewAlertClosed") ? false : true
  );

  const router = useIonRouter();

  function handleCloseModal() {
    sessionStorage.setItem("webPreviewAlertClosed", "y");
    setIsOpen(false);
  }

  return (
    <IonModal
      isOpen={isOpen}
      onDidDismiss={handleCloseModal}
      className="ion-w-fit ion-h-fit ion-b-r-[10px] ion-box-shadow"
    >
      <div
        className="size-full p-4 w-[80vw] auto-rows-min
            grid  justify-items-center items-center gap-2"
      >
        <IonIcon
          icon={informationCircleOutline}
          color="primary"
          className="size-10 mb-3"
        />

        <p className="text-base font-semibold px-4 text-center">
          This web preview is for demo purposes only. Some capabilities or
          features may be missing. For the best experience, please use our
          mobile version.
          <br />
          <br />
          Bản xem trước trên web này chỉ dùng cho mục đích demo. Một số chức
          năng hoặc tính năng có thể bị thiếu. Để trải nghiệm tốt nhất, vui lòng
          sử dụng phiên bản di động của chúng tôi.
        </p>

        <div className="flex justify-center items-center w-full gap-2 mt-8">
          <IonButton
            size="small"
            color="primary"
            className="grow text-base normal-case"
            onClick={handleCloseModal}
          >
            Close
          </IonButton>
          <IonButton
            size="small"
            color="warning"
            href="https://github.com/PTPhongKMF/cryofert-mobile-app/releases"
            target="_blank"
            className="text-base normal-case"
          >
            Get Mobile
          </IonButton>
        </div>
      </div>
    </IonModal>
  );
}
