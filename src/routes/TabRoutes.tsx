import {
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import { Route } from "react-router-dom";
import Home from "@src/pages/Home";
import Login from "@src/pages/Login";
import { ROUTES } from "@src/routes/routes";

export default function TabRoutes() {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path={ROUTES.TABS_HOME} component={Home} />
        <Route exact path={ROUTES.TABS_LOGIN} component={Login} />
      </IonRouterOutlet>

      <IonTabBar slot="bottom">
        <IonTabButton tab="home" href={ROUTES.TABS_HOME}>
          <IonLabel>Trang chủ</IonLabel>
        </IonTabButton>
        <IonTabButton tab="login" href={ROUTES.TABS_LOGIN}>
          <IonLabel>Đăng nhập</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
}
