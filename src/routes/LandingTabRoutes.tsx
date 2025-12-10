import {
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  useIonRouter,
} from "@ionic/react";
import { Redirect, Route } from "react-router-dom";
import LandingHome from "@src/pages/LandingHome";
import LandingAuth from "@src/pages/LandingAuth";
import { ROUTES } from "@src/routes/routes";
import { home, homeOutline, logIn, logInOutline } from "ionicons/icons";

export default function LandingTabRoutes() {
  const router = useIonRouter();
  const matchCurrentTab = (path: string) =>
    router.routeInfo.pathname?.startsWith(path) ?? false;

  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path={ROUTES.L_HOME} component={LandingHome} />
        <Redirect exact path={ROUTES.L_AUTH} to={ROUTES.L_AUTH_LOGIN} />
        <Route exact path={ROUTES.L_AUTH_LOGIN} component={LandingAuth} />
        <Route exact path={ROUTES.L_AUTH_REGISTER} component={LandingAuth} />
      </IonRouterOutlet>

      <IonTabBar slot="bottom" className="ion-bg-violet-100 pb-1">
        <IonTabButton tab="home" href={ROUTES.L_HOME}>
          <IonIcon
            icon={matchCurrentTab(ROUTES.L_HOME) ? home : homeOutline}
            className="size-6"
          />
          <IonLabel className="text-xs">Home</IonLabel>
        </IonTabButton>
        <IonTabButton tab="auth" href={ROUTES.L_AUTH}>
          <IonIcon
            icon={matchCurrentTab(ROUTES.L_AUTH) ? logIn : logInOutline}
            className="size-6"
          />
          <IonLabel className="text-xs">Log in</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
}
