import { IonContent } from "@ionic/react";
import BgImgMedical from "@assets/images/bg-login.jpg";
import { Swiper, SwiperSlide } from "swiper/react";
import SafeAreaView from "@src/components/SafeAreaView";
import LoginForm from "@src/components/landing-auth-tabs/LoginForm";
import RegisterForm from "@src/components/landing-auth-tabs/RegisterForm";
import { useLocation } from "react-router";

export default function LandingAuth() {
  const authPage = new URLSearchParams(useLocation().search).get("authPage");

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
            <Swiper
              initialSlide={
                Number.isNaN(Number(authPage)) ? 0 : Number(authPage)
              }
              className="h-full"
            >
              <SwiperSlide>
                <LoginForm />
              </SwiperSlide>
              <SwiperSlide>
                <RegisterForm />
              </SwiperSlide>
            </Swiper>
          </div>
        </div>
      </SafeAreaView>
    </IonContent>
  );
}
