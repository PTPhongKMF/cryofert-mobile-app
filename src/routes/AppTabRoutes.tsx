import {
  IonContent,
  IonFab,
  IonFabButton,
  IonFabList,
  IonHeader,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import { Route } from "react-router-dom";
import { ROUTES } from "@src/routes/routes";
import History from "@src/pages/History";
import Account from "@src/pages/Account";
import {
  alertCircleOutline,
  codeWorking,
  fileTrayFull,
  home,
  personCircle,
  server,
  serverOutline,
  snow,
  snowOutline,
} from "ionicons/icons";
import { useEffect } from "react";
import { useLocalUserStore } from "@src/stores/user";
import { clearAllSecuredTokens } from "@src/services/token-service";
import { ClipboardPlus, Stethoscope } from "lucide-react";
import Dev from "@src/pages/devs/Dev";
import { useGenericDialogStore } from "@src/stores/dialog";
import AppHome from "@src/pages/AppHome";
import CryoStorage from "@src/pages/CryoStorage";

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
            buttons: {
              text: "Back to Log In",
              color: "danger",
              closeFn: () => router.push(ROUTES.L_AUTH, "back"),
            },
            backdropDismiss: false,
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
        <IonContent>
          <Route exact path={ROUTES.T_HOME} component={AppHome} />
          <Route exact path={ROUTES.T_HISTORY} component={History} />
          <Route exact path={ROUTES.T_CRYO} component={CryoStorage} />
          <Route exact path={ROUTES.T_ACCOUNT} component={Account} />
          <Route exact path={"/tabs/dev"} component={Dev} />
        </IonContent>
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

        <IonTabButton tab="cryo" href={ROUTES.T_CRYO}>
          <IonIcon icon={serverOutline} className="size-6" />
          <IonIcon
            icon={snow}
            className="size-5 absolute bottom-[43%] right-[7%]"
          />
          <IonLabel className="text-xs">Cryo</IonLabel>
        </IonTabButton>

        <IonTabButton tab="account" href={ROUTES.T_ACCOUNT}>
          <IonIcon icon={personCircle} className="size-6" />
          <IonLabel className="text-xs">Account</IonLabel>
        </IonTabButton>

        <IonTabButton tab="dev" href={"/tabs/dev"}>
          <IonIcon icon={codeWorking} className="size-6" />
          <IonLabel className="text-xs">Dev</IonLabel>
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
