import {
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import { Route } from "react-router-dom";
import Home from "@src/pages/Home";
import { ROUTES } from "@src/routes/routes";
import History from "@src/pages/History";
import Profile from "@src/pages/Profile";
import { fileTrayFull, home, personCircle } from "ionicons/icons";

export default function AppTabRoutes() {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path={ROUTES.T_HOME} component={Home} />
        <Route exact path={ROUTES.T_HISTORY} component={History} />
        <Route exact path={ROUTES.T_PROFILE} component={Profile} />
      </IonRouterOutlet>

      <IonTabBar slot="bottom" className="ion-bg-violet-100">
        <IonTabButton tab="home" href={ROUTES.T_HOME}>
          <IonIcon icon={home} className="size-6" />
          <IonLabel className="text-xs">Home</IonLabel>
        </IonTabButton>

        <IonTabButton tab="history" href={ROUTES.T_HISTORY}>
          <IonIcon icon={fileTrayFull} className="size-6" />
          <IonLabel className="text-xs">History</IonLabel>
        </IonTabButton>

        <IonTabButton tab="profile" href={ROUTES.T_PROFILE}>
          <IonIcon icon={personCircle} className="size-6" />
          <IonLabel className="text-xs">Profile</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
}
