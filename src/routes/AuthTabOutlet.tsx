import { IonContent, IonRouterOutlet } from "@ionic/react";
import LoginForm from "@src/pages/landing-tabs/LoginForm";
import RegisterForm from "@src/pages/landing-tabs/RegisterForm";
import { ROUTES } from "@src/routes/routes";
import { Redirect, Route, Switch } from "react-router";

export default function AuthTabOutlet() {
  return (
    <IonRouterOutlet>
      <Redirect exact from={ROUTES.L_AUTH} to={ROUTES.AUTH_LOGIN} />

      <Route path={ROUTES.AUTH_LOGIN} component={LoginForm} />
      <Route path={ROUTES.AUTH_REGISTER} component={RegisterForm} />
    </IonRouterOutlet>
  );
}
