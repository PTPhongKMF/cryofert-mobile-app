import { IonContent, IonImg } from "@ionic/react";
import SafeAreaView from "@src/components/SafeAreaView";
import BgImgMedical from "@assets/images/bg-login.jpg";
import AuthTabOutlet from "@src/routes/AuthTabOutlet";

export default function Auth() {
  return (
    <IonContent>
      <SafeAreaView className="grid grid-rows-[12rem_1fr] bg-neutral-100">
        <IonImg src={BgImgMedical} className="object-cover w-full h-[14rem]" />

        <div className="bg-linear-to-br from-blue-50 to-sky-100
        rounded-t-3xl pt-6">
          <AuthTabOutlet />
        </div>
      </SafeAreaView>
    </IonContent>
  );
}
