import { IonRouterOutlet } from "@ionic/react";
import LoginForm from "@src/components/auth-pages/LoginForm";
import RegisterForm from "@src/components/auth-pages/RegisterForm";
import { ROUTES } from "@src/routes/routes";
import { Redirect, Route } from "react-router";

export default function AuthTabOutlet() {
  return (
    <IonRouterOutlet className="h-full">
      <Redirect exact from={ROUTES.L_AUTH} to={ROUTES.AUTH_LOGIN} />

      <Route path={ROUTES.AUTH_LOGIN} component={LoginForm} />
      <Route path={ROUTES.AUTH_REGISTER} component={RegisterForm} />
    </IonRouterOutlet>
  );
}
