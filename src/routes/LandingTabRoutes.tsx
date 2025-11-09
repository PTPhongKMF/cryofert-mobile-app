import {
  IonContent,
  IonFooter,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { Route } from "react-router-dom";
import Home from "@src/pages/Home";
import Auth from "@src/pages/landing-tabs/Auth";
import { ROUTES } from "@src/routes/routes";
import { home, logInOutline } from "ionicons/icons";

export default function LandingTabRoutes() {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path={ROUTES.L_HOME} component={Home} />
        <Route path={ROUTES.L_AUTH} component={Auth} />
      </IonRouterOutlet>

      <IonTabBar slot="bottom" className="ion-bg-violet-100">
        <IonTabButton tab="home" href={ROUTES.L_HOME}>
          <IonIcon icon={home} className="size-6" />
          <IonLabel className="text-xs">Home</IonLabel>
        </IonTabButton>
        <IonTabButton tab="auth" href={ROUTES.L_AUTH}>
          <IonIcon icon={logInOutline} className="size-6" />
          <IonLabel className="text-xs">Log in</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
}
