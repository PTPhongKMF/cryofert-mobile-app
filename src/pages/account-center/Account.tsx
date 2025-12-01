import {
  IonButton,
  IonContent,
  IonIcon,
  IonItem,
  IonList,
  IonToast,
  useIonRouter,
} from "@ionic/react";
import SafeAreaView from "@src/components/SafeAreaView";
import { useLocalUserStore } from "@src/stores/user";
import EditProfile from "@assets/images/lucide/user-pen.svg";
import { ROUTES } from "@src/routes/routes";
import BlueToGrayGradientBg from "@src/components/backgrounds/BlueToGrayGradientBg";
import {
  alertCircleOutline,
  cashOutline,
  keyOutline,
  logOutOutline,
  peopleOutline,
} from "ionicons/icons";
import { useGenericDialogStore } from "@src/stores/dialog";
import { Clipboard } from "@capacitor/clipboard";
import { useState } from "react";
import { clearAllSecuredTokens } from "@src/services/token-service";
import { cn } from "@utils/cn";
import AppTabHeader from "@src/components/AppTabHeader";

export default function Account() {
  const [isOpenToastCopy, setIsOpenToastCopy] = useState(false);

  const router = useIonRouter();
  const localUser = useLocalUserStore((s) => s.localUser);
  const clearLocalUser = useLocalUserStore((s) => s.clearLocalUser);
  const openGenericDialog = useGenericDialogStore((s) => s.openGenericDialog);

  return (
    <>
      <AppTabHeader />

      <IonContent className="relative">
        <BlueToGrayGradientBg />

        <SafeAreaView withFixedHeader={true} className="relative">
          <div className="pt-6 px-4">
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

                <IonButton
                  size="small"
                  disabled={isOpenToastCopy}
                  onClick={async () => {
                    await Clipboard.write({ string: localUser?.id });
                    setIsOpenToastCopy(true);
                  }}
                  className="text-xs!"
                >
                  copy
                </IonButton>
              </div>

              <div className="bg-gray-200 w-full h-0.5" />

              <div className="flex flex-col justify-start items-start w-full gap-1">
                <div className="flex justify-between items-center w-full text-sm font-semibold text-blue-500">
                  <p>Email:</p>
                  <span className="font-normal text-xs text-black">
                    {localUser?.email}
                  </span>
                </div>

                <div className="flex justify-between items-center w-full text-sm font-semibold text-blue-500">
                  <p>Name:</p>
                  <span
                    className={cn(
                      "font-normal text-xs text-black",
                      localUser?.lastName && localUser.firstName
                        ? "text-black"
                        : "text-gray-600"
                    )}
                  >
                    {localUser?.lastName && localUser.firstName
                      ? `${localUser.lastName} ${localUser.firstName}`
                      : "N/A"}
                  </span>
                </div>

                <div className="flex justify-between items-center w-full text-sm font-semibold text-blue-500">
                  <p>Gender:</p>
                  <span className="font-normal text-xs text-black">
                    {localUser?.gender ? "Male" : "Female"}
                  </span>
                </div>
              </div>
            </div>

            <IonButton
              size="small"
              color="danger"
              onClick={() =>
                openGenericDialog({
                  svgIcon: alertCircleOutline,
                  svgIconColor: "danger",
                  content: "Are you sure you want to log out?",
                  buttons: [
                    {
                      text: "Cancel",
                    },
                    {
                      text: "Confirm",
                      color: "danger",
                      closeFn: async () => {
                        await clearAllSecuredTokens();
                        clearLocalUser();
                        router.push(ROUTES.L_AUTH);
                      },
                    },
                  ],
                })
              }
              className="w-full grid justify-end mt-2 pe-2"
            >
              <p className="pe-3">Log Out</p>
              <IonIcon aria-hidden="true" icon={logOutOutline} slot="end" />
            </IonButton>

            <div className="flex flex-col justify-center items-center w-full gap-4 mt-14">
              <IonList className="text-sm! w-full bg-transparent!">
                <IonItem
                  detail
                  button
                  onClick={() => router.push(ROUTES.UPDATE_ACCOUNT, "forward")}
                  className="ion-bg-transparent text-sm"
                >
                  <IonIcon aria-hidden="true" icon={EditProfile} slot="start" />
                  <p className="ps-3">Update Account Information</p>
                </IonItem>

                <IonItem detail button className="ion-bg-transparent text-sm">
                  <IonIcon aria-hidden="true" icon={keyOutline} slot="start" />
                  <p className="ps-3">Change Password</p>
                </IonItem>

                <IonItem
                  detail
                  button
                  onClick={() => router.push(ROUTES.RELATIONSHIP, "forward")}
                  className="ion-bg-transparent text-sm"
                >
                  <IonIcon
                    aria-hidden="true"
                    icon={peopleOutline}
                    slot="start"
                  />
                  <p className="ps-3">Relationship</p>
                </IonItem>
              </IonList>

              <IonList className="text-sm! w-full bg-transparent!">
                <IonItem
                  detail
                  button
                  onClick={() =>
                    router.push(ROUTES.TRANSACTION_HISTORY, "forward")
                  }
                  className="ion-bg-transparent text-sm"
                >
                  <IonIcon aria-hidden="true" icon={cashOutline} slot="start" />
                  <p className="ps-3">Transaction History</p>
                </IonItem>
              </IonList>
            </div>
          </div>
        </SafeAreaView>

        <IonToast
          isOpen={isOpenToastCopy}
          onDidDismiss={() => setIsOpenToastCopy(false)}
          message="ID copied"
          position="bottom"
          positionAnchor="app-tab-bar"
          duration={1000}
        />
      </IonContent>
    </>
  );
}
