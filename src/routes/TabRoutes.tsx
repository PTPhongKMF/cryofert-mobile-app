import {
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import { Route } from "react-router-dom";
import Home from "@src/pages/Home";
import Auth from "@src/pages/Auth";
import { ROUTES } from "@src/routes/routes";

export default function TabRoutes() {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path={ROUTES.HOME} component={Home} />
        <Route path={ROUTES.AUTH} component={Auth} />
      </IonRouterOutlet>

      <IonTabBar slot="bottom">
        <IonTabButton tab="home" href={ROUTES.HOME}>
          <IonLabel>Trang chủ</IonLabel>
        </IonTabButton>
        <IonTabButton tab="auth" href={ROUTES.AUTH}>
          <IonLabel>Đăng nhập</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
}
