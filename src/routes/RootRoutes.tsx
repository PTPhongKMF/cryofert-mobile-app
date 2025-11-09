import React from "react";
import { Route } from "react-router";
import SplashScreen from "@src/pages/SplashScreen";
import LandingTabRoutes from "@src/routes/LandingTabRoutes";
import { ROUTES } from "@src/routes/routes";
import AppTabRoutes from "@src/routes/AppTabRoutes";
import { IonRouterOutlet } from "@ionic/react";
import TreatmentBooking from "@src/pages/TreatmentBooking";
import UpdateAccount from "@src/pages/UpdateAccount";

export default function RootRoutes() {
  return (
    <IonRouterOutlet>
      <Route exact path={ROUTES.ROOT} component={SplashScreen} />
      <Route path={ROUTES.LANDING} component={LandingTabRoutes} />
      <Route path={ROUTES.TABS} component={AppTabRoutes} />

      <Route path={ROUTES.UPDATE_ACCOUNT} component={UpdateAccount} />
      <Route path={ROUTES.BOOK_TREATMENT} component={TreatmentBooking} />
    </IonRouterOutlet>
  );
}
