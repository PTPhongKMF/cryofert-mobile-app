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
import TreatmentTab from "@src/pages/treatment-tab/TreatmentTab";
import Account from "@src/pages/account-center-tab/Account";
import {
  alertCircleOutline,
  codeWorking,
  codeWorkingOutline,
  fileTrayFull,
  fileTrayFullOutline,
  home,
  homeOutline,
  personCircle,
  personCircleOutline,
  server,
  serverOutline,
  snow,
  snowOutline,
} from "ionicons/icons";
import { useEffect } from "react";
import { useLocalUserStore } from "@src/stores/user";
import { clearAllSecuredTokens } from "@src/services/token-service";
import { ClipboardPlus, Dna, Snowflake, Stethoscope } from "lucide-react";
import Dev from "@src/pages/devs/Dev";
import { useGenericDialogStore } from "@src/stores/dialog";
import Home from "@src/pages/Home";
import LabSamples from "@src/pages/LabSamples";
import AppTabHeader from "@src/components/layout/AppTabHeader";
import HomeCopy from "@src/pages/HomeCopy";

export default function AppTabRoutes() {
  const router = useIonRouter();
  const localUser = useLocalUserStore((s) => s.localUser);
  const hasHydrated = useLocalUserStore((s) => s.hasHydrated);
  const openGenericDialog = useGenericDialogStore((s) => s.openGenericDialog);

  const matchCurrentTab = (path: string) =>
    router.routeInfo.pathname?.startsWith(path) ?? false;

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
              closeFn: () => router.push(ROUTES.L_AUTH_LOGIN, "back"),
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
      <AppTabHeader />

      <IonRouterOutlet>
        <IonContent>
          <Route exact path={ROUTES.T_HOME} component={Home} />
          <Route exact path={ROUTES.T_TREATMENT} component={TreatmentTab} />
          <Route exact path={ROUTES.T_SAMPLES} component={LabSamples} />
          <Route exact path={ROUTES.T_ACCOUNT} component={Account} />
          <Route exact path={"/tabs/dev"} component={HomeCopy} />
          {/* <Route exact path={"/tabs/dev"} component={Dev} /> */}
        </IonContent>
      </IonRouterOutlet>

      <IonTabBar
        id="app-tab-bar"
        slot="bottom"
        className="ion-bg-violet-100 pb-1"
      >
        <IonTabButton tab="home" href={ROUTES.T_HOME}>
          <IonIcon
            icon={matchCurrentTab(ROUTES.T_HOME) ? home : homeOutline}
            className="size-6"
          />
          <IonLabel className="text-xs">Home</IonLabel>
        </IonTabButton>

        <IonTabButton tab="history" href={ROUTES.T_TREATMENT}>
          <IonIcon
            icon={
              matchCurrentTab(ROUTES.T_TREATMENT)
                ? fileTrayFull
                : fileTrayFullOutline
            }
            className="size-6"
          />
          <IonLabel className="text-xs">Treatment</IonLabel>
        </IonTabButton>

        <IonTabButton tab="cryo" href={ROUTES.T_SAMPLES}>
          <IonIcon
            icon={matchCurrentTab(ROUTES.T_SAMPLES) ? server : serverOutline}
            className="size-6"
          />
          <Dna className="size-5 absolute bottom-[46%] right-[10%]" />
          <IonLabel className="text-xs">Samples</IonLabel>
        </IonTabButton>

        <IonTabButton tab="account" href={ROUTES.T_ACCOUNT}>
          <IonIcon
            icon={
              matchCurrentTab(ROUTES.T_ACCOUNT)
                ? personCircle
                : personCircleOutline
            }
            className="size-6"
          />
          <IonLabel className="text-xs">Account</IonLabel>
        </IonTabButton>

        <IonTabButton tab="dev" href={"/tabs/dev"}>
          <IonIcon
            icon={
              matchCurrentTab("/tabs/dev") ? codeWorking : codeWorkingOutline
            }
            className="size-6"
          />
          <IonLabel className="text-xs">Dev</IonLabel>
        </IonTabButton>
      </IonTabBar>

      <IonFab vertical="bottom" horizontal="end">
        <IonFabButton className="ion-bg-sky-700">
          <Stethoscope className="size-8" />
        </IonFabButton>

        <IonFabList side="start" className="flex gap-2 me-20">
          <IonFabButton
            onClick={() => router.push(ROUTES.BOOK_TREATMENT)}
            className="ion-b-r-[6px] w-[10rem] h-14 ion-bg-sky-500"
          >
            <ClipboardPlus className="me-4 text-gray-50" />
            <p className="text-gray-50 font-semibold text-lg [text-box:trim-both_cap_alphabetic]">
              Treatment
            </p>
          </IonFabButton>

          <IonFabButton
            onClick={() => router.push(ROUTES.START_CONTRACT_FORM)}
            className="ion-b-r-[6px] w-[8rem] h-14 ion-bg-blue-500"
          >
            <Snowflake className="me-4 text-gray-50" />
            <p className="text-gray-50 font-semibold text-lg [text-box:trim-both_cap_alphabetic]">
              Cryo
            </p>
          </IonFabButton>
        </IonFabList>
      </IonFab>
    </IonTabs>
  );
}
