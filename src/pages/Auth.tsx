import { IonContent, IonImg } from "@ionic/react";
import BgImgMedical from "@assets/images/bg-login.jpg";
import AuthTabOutlet from "@src/routes/AuthTabOutlet";

export default function Auth() {
  return (
    <IonContent fullscreen>
      <div className="h-full grid grid-rows-[12rem_1fr] bg-sky-50">
        <IonImg src={BgImgMedical} className="object-cover w-full h-[14rem]" />

        <div
          className=" bg-sky-50 flex flex-col justify-start
        rounded-t-3xl pt-6"
        >
          <p className="text-center font-semibold text-3xl text-blue-700">
            CryoFert
          </p>

          <div className="h-full relative">
            <AuthTabOutlet />
          </div>
        </div>
      </div>
    </IonContent>
  );
}
