import { IonContent } from "@ionic/react";
import BgImgMedical from "@assets/images/bg-login.jpg";
import SafeAreaView from "@src/components/layout/SafeAreaView";
import LoginForm from "@src/components/landing-auth-tabs/LoginForm";
import RegisterForm from "@src/components/landing-auth-tabs/RegisterForm";
import { useLocation } from "react-router";
import { ROUTES } from "@src/routes/routes";

export default function LandingAuth() {
  const location = useLocation();
  const isRegisterPage = location.pathname === ROUTES.L_AUTH_REGISTER;

  return (
    <IonContent fullscreen>
      <SafeAreaView className="grid grid-rows-[12rem_1fr] grid-cols-1 bg-sky-50">
        <img src={BgImgMedical} className="object-cover w-full h-[14rem]" />

        <div
          className="bg-sky-50 flex flex-col justify-start
        rounded-t-3xl pt-6"
        >
          <p className="text-center font-semibold text-3xl text-blue-700">
            CryoFert
          </p>

          <div className="h-full">
            {isRegisterPage ? <RegisterForm /> : <LoginForm />}
          </div>
        </div>
      </SafeAreaView>
    </IonContent>
  );
}
