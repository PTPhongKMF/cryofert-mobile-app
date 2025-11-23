import React, { useEffect } from "react";
import { Route } from "react-router";
import SplashScreen from "@src/pages/SplashScreen";
import LandingTabRoutes from "@src/routes/LandingTabRoutes";
import { ROUTES } from "@src/routes/routes";
import AppTabRoutes from "@src/routes/AppTabRoutes";
import { IonRouterOutlet, useIonRouter } from "@ionic/react";
import TreatmentBooking from "@src/pages/TreatmentBooking";
import UpdateAccount from "@src/pages/UpdateAccount";
import TransactionHistory from "@src/pages/TransactionHistory";
import TreatmentDetail from "@src/pages/TreatmentDetail";
import PaymentPortal from "@src/pages/PaymentPortal";
import TestPage from "@src/pages/devs/TestPage";
import TestPage2 from "@src/pages/devs/TestPage2";
import { setGlobalPush } from "@src/services/navigation-service";

export default function RootRoutes() {
  const router = useIonRouter();

  useEffect(() =>
    setGlobalPush((path, direction) => {
      router.push(path, direction);
    })
  );
  return (
    <IonRouterOutlet>
      <Route exact path={ROUTES.ROOT} component={SplashScreen} />
      <Route path={ROUTES.LANDING} component={LandingTabRoutes} />
      <Route path={ROUTES.TABS} component={AppTabRoutes} />

      <Route path={ROUTES.UPDATE_ACCOUNT} component={UpdateAccount} />
      <Route path={ROUTES.BOOK_TREATMENT} component={TreatmentBooking} />
      <Route path={ROUTES.PAYMENT_PORTAL} component={PaymentPortal} />
      <Route path={ROUTES.TRANSACTION_HISTORY} component={TransactionHistory} />
      <Route
        path={`${ROUTES.TREATMENT_DETAIL}/:treatmentId`}
        component={TreatmentDetail}
      />

      {/* ////////////////////////////////////////////////// */}

      <Route path="/test" component={TestPage} />
      <Route path="/test2" component={TestPage2} />
    </IonRouterOutlet>
  );
}
