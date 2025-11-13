import { IonContent, IonImg, useIonRouter } from "@ionic/react";
import BgImgMedical from "@assets/images/bg-login.jpg";
import { Swiper, SwiperSlide } from "swiper/react";
import SafeAreaView from "@src/components/SafeAreaView";
import LoginForm from "@src/components/landing-tabs/LoginForm";
import RegisterForm from "@src/components/landing-tabs/RegisterForm";
import { useParams } from "react-router";

interface AuthParams {
  id?: string;
}

export default function Auth() {
  const { id } = useParams<AuthParams>();

  return (
    <IonContent fullscreen>
      <SafeAreaView className="grid grid-rows-[12rem_1fr] grid-cols-1 bg-sky-50">
        <IonImg src={BgImgMedical} className="object-cover w-full h-[14rem]" />

        <div
          className="bg-sky-50 flex flex-col justify-start
        rounded-t-3xl pt-6"
        >
          <p className="text-center font-semibold text-3xl text-blue-700">
            CryoFert
          </p>

          <div className="h-full">
            <Swiper
              initialSlide={Number.isNaN(Number(id)) ? 0 : Number(id)}
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
