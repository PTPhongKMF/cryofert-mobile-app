import {
  IonContent,
  IonFab,
  IonFabButton,
  IonFabList,
  IonFooter,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  useIonRouter,
} from "@ionic/react";
import { Route } from "react-router-dom";
import { ROUTES } from "@src/routes/routes";
import History from "@src/pages/History";
import Account from "@src/pages/Account";
import {
  alertCircleOutline,
  bug,
  fileTrayFull,
  home,
  personCircle,
} from "ionicons/icons";
import { useEffect } from "react";
import { useLocalUserStore } from "@src/stores/user";
import { clearAllSecuredTokens } from "@src/services/token-service";
import { ClipboardPlus, Stethoscope } from "lucide-react";
import Profile from "@src/pages/Profile";
import { useGenericDialogStore } from "@src/stores/dialog";
import AppHome from "@src/pages/AppHome";

export default function AppTabRoutes() {
  const router = useIonRouter();
  const localUser = useLocalUserStore((s) => s.localUser);
  const hasHydrated = useLocalUserStore((s) => s.hasHydrated);
  const openGenericDialog = useGenericDialogStore((s) => s.openGenericDialog);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    (async () => {
      if (router.routeInfo.pathname.startsWith(ROUTES.TABS)) {
        if (!localUser) {
          await clearAllSecuredTokens();
          openGenericDialog({
            title: "Authentication Error",
            content: "We can't verify your account, please log in again",
            svgIcon: alertCircleOutline,
            svgIconColor: "danger",
            showBtn: true,
            btnText: "Back to Log In",
            btnColor: "danger",
            backdropDismiss: false,
            closeFn: () => {
              router.push(ROUTES.L_AUTH, "back");
            },
          });
        }
      }
    })();
  }, [
    router,
    router.routeInfo.pathname,
    localUser,
    hasHydrated,
    openGenericDialog,
  ]);

  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path={ROUTES.T_HOME} component={AppHome} />
        <Route exact path={ROUTES.T_HISTORY} component={History} />
        <Route exact path={ROUTES.T_ACCOUNT} component={Account} />
        <Route exact path={"/tabs/test"} component={Profile} />
      </IonRouterOutlet>

      <IonTabBar id="app-tab-bar" slot="bottom" className="ion-bg-violet-100">
        <IonTabButton tab="home" href={ROUTES.T_HOME}>
          <IonIcon icon={home} className="size-6" />
          <IonLabel className="text-xs">Home</IonLabel>
        </IonTabButton>

        <IonTabButton tab="history" href={ROUTES.T_HISTORY}>
          <IonIcon icon={fileTrayFull} className="size-6" />
          <IonLabel className="text-xs">History</IonLabel>
        </IonTabButton>

        <IonTabButton tab="account" href={ROUTES.T_ACCOUNT}>
          <IonIcon icon={personCircle} className="size-6" />
          <IonLabel className="text-xs">Account</IonLabel>
        </IonTabButton>

        <IonTabButton tab="test" href={"/tabs/test"}>
          <IonIcon icon={bug} className="size-6" />
          <IonLabel className="text-xs">Test</IonLabel>
        </IonTabButton>
      </IonTabBar>

      <IonFab vertical="bottom" horizontal="end">
        <IonFabButton className="ion-bg-sky-500">
          <Stethoscope className="size-8" />
        </IonFabButton>

        <IonFabList side="start" className="flex gap-2 me-20">
          <IonFabButton
            onClick={() => router.push(ROUTES.BOOK_TREATMENT)}
            className="ion-b-r-[6px] w-[70vw] h-14 ion-bg-sky-500"
          >
            <ClipboardPlus className="me-4 text-gray-50" />
            <p className="text-gray-50 font-semibold text-lg [text-box:trim-both_cap_alphabetic]">
              Book a Treatment
            </p>
          </IonFabButton>
        </IonFabList>
      </IonFab>
    </IonTabs>
  );
}
