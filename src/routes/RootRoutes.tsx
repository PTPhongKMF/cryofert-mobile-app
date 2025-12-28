import React, { useEffect } from "react";
import { Route } from "react-router";
import SplashScreen from "@src/pages/SplashScreen";
import LandingTabRoutes from "@src/routes/LandingTabRoutes";
import { ROUTES } from "@src/routes/routes";
import AppTabRoutes from "@src/routes/AppTabRoutes";
import { IonRouterOutlet, useIonRouter } from "@ionic/react";
import TreatmentBooking from "@src/pages/TreatmentBooking";
import UpdateAccount from "@src/pages/account-center-tab/UpdateAccount";
import TransactionHistory from "@src/pages/account-center-tab/TransactionHistory";
import TreatmentDetail from "@src/pages/treatment-tab/TreatmentDetail";
import PaymentPortal from "@src/pages/PaymentPortal";
import TestPage from "@src/pages/devs/TestPage";
import TestPage2 from "@src/pages/devs/TestPage2";
import { setGlobalPush } from "@src/services/navigation-service";
import AppointmentDetail from "@src/pages/treatment-tab/AppointmentDetail";
import TreatmentCycleDetail from "@src/pages/treatment-tab/TreatmentCycleDetail";
import Relationship from "@src/pages/account-center-tab/Relationship";
import StartCryoContractForm from "@src/pages/start-cryo-contract/StartCryoContractForm";
import StartCryoContractPaper from "@src/pages/start-cryo-contract/StartCryoContractPaper";
import CryoContractDetail from "@src/pages/lab-samples-tab/CryoContractDetail";
import RenewCryoContractPaper from "@src/pages/lab-samples-tab/RenewCryoContractPaper";
import { useLocalUserStore } from "@src/stores/user";

export default function RootRoutes() {
  const router = useIonRouter();
  const hasHydrated = useLocalUserStore((s) => s.hasHydrated);
  const localUser = useLocalUserStore((s) => s.localUser);
  const setLogout = useLocalUserStore((s) => s.setLogout);

  useEffect(() =>
    setGlobalPush((path, direction) => {
      router.push(path, direction);
    })
  );

  useEffect(() => {
    if (!hasHydrated || !localUser) {
      return;
    }

    setLogout(async () => {
      router.push(ROUTES.L_AUTH_LOGIN, "back");
    });
  }, [hasHydrated, localUser, router, setLogout]);

  return (
    <IonRouterOutlet>
      <Route exact path={ROUTES.ROOT} component={SplashScreen} />
      <Route path={ROUTES.LANDING} component={LandingTabRoutes} />
      <Route path={ROUTES.TABS} component={AppTabRoutes} />

      <Route path={ROUTES.BOOK_TREATMENT} component={TreatmentBooking} />
      <Route
        path={ROUTES.START_CONTRACT_FORM}
        component={StartCryoContractForm}
      />
      <Route
        path={ROUTES.START_CONTRACT_PAPER}
        component={StartCryoContractPaper}
      />
      <Route
        path={ROUTES.RENEW_CONTRACT_PAPER}
        component={RenewCryoContractPaper}
      />

      <Route path={ROUTES.PAYMENT_PORTAL} component={PaymentPortal} />

      <Route
        path={`${ROUTES.TREATMENT}/:treatmentId`}
        component={TreatmentDetail}
      />
      <Route
        path={`${ROUTES.APPOINTMENT}/:appointmentId`}
        component={AppointmentDetail}
      />
      <Route
        path={`${ROUTES.TREATMENT_CYCLE}/:cycleId`}
        component={TreatmentCycleDetail}
      />
      <Route
        path={`${ROUTES.CRYO_CONTRACT}/:contractId`}
        component={CryoContractDetail}
      />

      <Route path={ROUTES.UPDATE_ACCOUNT} component={UpdateAccount} />
      <Route path={ROUTES.RELATIONSHIP} component={Relationship} />
      <Route path={ROUTES.TRANSACTION_HISTORY} component={TransactionHistory} />

      {/* ////////////////////////////////////////////////// */}

      <Route path="/test" component={TestPage} />
      <Route path="/test2" component={TestPage2} />
    </IonRouterOutlet>
  );
}
