import React from "react";
import { IonRouterOutlet } from "@ionic/react";
import { Route } from "react-router";
import SplashScreen from "@src/pages/SplashScreen";
import TabRoutes from "@src/routes/TabRoutes";
import { ROUTES } from "@src/routes/routes";

export default function AppRoutes() {
  return (
    <IonRouterOutlet>
      <Route exact path={ROUTES.ROOT} component={SplashScreen} />
      <Route path={ROUTES.TABS} component={TabRoutes} />
    </IonRouterOutlet>
  );
}
