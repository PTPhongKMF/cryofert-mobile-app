import { IonContent } from "@ionic/react";
import BgImgMedical from "@assets/images/bg-login.jpg";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import SafeAreaView from "@src/components/SafeAreaView";
import LoginForm from "@src/components/landing-auth-tabs/LoginForm";
import RegisterForm from "@src/components/landing-auth-tabs/RegisterForm";
import { useLocation } from "react-router";
import { useEffect, useRef, useState } from "react";

export default function LandingAuth() {
  const location = useLocation();
  const authPage = new URLSearchParams(location.search).get("authPage");
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const currentSlideRef = useRef(Number.isNaN(Number(authPage)) ? 0 : Number(authPage));

  useEffect(() => {
    const targetSlide = Number.isNaN(Number(authPage)) ? 0 : Number(authPage);
    if (swiperInstance && currentSlideRef.current !== targetSlide) {
      swiperInstance.slideTo(targetSlide);
      currentSlideRef.current = targetSlide;
    }
  }, [authPage, swiperInstance]);

  function handleSlideChange(swiper: SwiperType) {
    const newIndex = swiper.activeIndex;
    currentSlideRef.current = newIndex;
    const params = new URLSearchParams(location.search);

    if (newIndex === 0) {
      params.delete("authPage");
    } else {
      params.set("authPage", newIndex.toString());
    }
    
    const newSearch = params.toString();
    const newUrl = `${location.pathname}${newSearch ? `?${newSearch}` : ""}`;

    window.history.replaceState({}, "", newUrl);
  };

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
              initialSlide={currentSlideRef.current}
              onSwiper={setSwiperInstance}
              onSlideChange={handleSlideChange}
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
