import {
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import { Route } from "react-router-dom";
import Home from "@src/pages/Home";
import { ROUTES } from "@src/routes/routes";
import Service from "@src/pages/Service";
import History from "@src/pages/History";
import Profile from "@src/pages/Profile";

export default function TabRoutes() {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path={ROUTES.T_HOME} component={Home} />
        <Route exact path={ROUTES.T_SERVICE} component={Service} />
        <Route exact path={ROUTES.T_HISTORY} component={History} />
        <Route exact path={ROUTES.T_PROFILE} component={Profile} />
      </IonRouterOutlet>

      <IonTabBar slot="bottom">
        <IonTabButton tab="home" href={ROUTES.T_HOME}>
          <IonLabel>Home</IonLabel>
        </IonTabButton>

        <IonTabButton tab="service" href={ROUTES.T_SERVICE}>
          <IonLabel>Services</IonLabel>
        </IonTabButton>

        <IonTabButton tab="history" href={ROUTES.T_HISTORY}>
          <IonLabel>History</IonLabel>
        </IonTabButton>

        <IonTabButton tab="profile" href={ROUTES.T_PROFILE}>
          <IonLabel>Profile</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
}
