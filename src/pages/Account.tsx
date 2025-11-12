import {
  IonButton,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  useIonRouter,
} from "@ionic/react";
import SafeAreaView from "@src/components/SafeAreaView";
import { useLocalUserStore } from "@src/stores/user";
import EditProfile from "@assets/images/lucide/user-pen.svg";
import { ROUTES } from "@src/routes/routes";
import BlueToGrayGradientBg from "@src/components/backgrounds/BlueToGrayGradientBg";

export default function Account() {
  const router = useIonRouter();
  const localUser = useLocalUserStore((s) => s.localUser);

  return (
    <IonContent className="relative">
      <BlueToGrayGradientBg />

      <SafeAreaView className="relative">
        <div className="pt-6 px-4">
          <h1 className="text-xl! font-semibold! text-blue-500 p-0! m-0! mb-4!">
            Account Center
          </h1>

          <div
            className="bg-gray-50 w-full min-h-20 p-2 rounded-xl border border-blue-200
          flex flex-col justify-start items-start gap-3"
          >
            <div className="flex justify-between items-center w-full">
              <p className="text-sm font-semibold text-blue-500">
                ID:{" "}
                <span className="font-normal text-xs text-black">
                  {localUser?.id}
                </span>
              </p>

              <IonButton size="small" className="text-xs!">
                copy
              </IonButton>
            </div>

            <div className="bg-gray-200 w-full h-0.5" />

            <div className="flex flex-col justify-start items-start w-full gap-1">
              <div className="flex justify-between items-center w-full text-sm font-semibold text-blue-500">
                <p>Name:</p>
                <span className="font-normal text-xs text-black">
                  {localUser?.userName}
                </span>
              </div>

              <div className="flex justify-between items-center w-full text-sm font-semibold text-blue-500">
                <p>Email:</p>
                <span className="font-normal text-xs text-black">
                  {localUser?.userName}
                </span>
              </div>
            </div>
          </div>

          <IonList className="mt-14! text-sm! bg-transparent!">
            <IonItem
              detail
              button
              onClick={() => router.push(ROUTES.UPDATE_ACCOUNT, "forward")}
              className="ion-bg-transparent text-sm"
            >
              <IonIcon aria-hidden="true" icon={EditProfile} slot="start" />
              <p className="ps-3">Update Account Information</p>
            </IonItem>

            <IonItem className="ion-bg-transparent text-sm">
              <p>option 2</p>
            </IonItem>

            <IonItem className="ion-bg-transparent text-sm">
              <p>option 3</p>
            </IonItem>
          </IonList>
        </div>
      </SafeAreaView>
    </IonContent>
  );
}
