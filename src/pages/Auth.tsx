import { IonContent, IonImg } from "@ionic/react";
import SafeAreaView from "@src/components/SafeAreaView";
import BgImgMedical from "@assets/images/bg-login.jpg";
import AuthTabOutlet from "@src/routes/AuthTabOutlet";

export default function Auth() {
  return (
    <IonContent>
      <SafeAreaView className="grid grid-rows-[12rem_1fr] bg-neutral-100">
        <IonImg src={BgImgMedical} className="object-cover w-full h-[14rem]" />

        <div
          className="h-full min-h-0 bg-sky-50 flex flex-col justify-start
        rounded-t-3xl pt-6"
        >
          <p className="text-center font-semibold text-3xl text-blue-700">
            CryoFert
          </p>

          <div className="relative h-full">
            <AuthTabOutlet />
          </div>
        </div>
      </SafeAreaView>
    </IonContent>
  );
}
