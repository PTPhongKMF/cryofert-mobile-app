import LoginForm from "@src/components/auth-pages/LoginForm";
import RegisterForm from "@src/components/auth-pages/RegisterForm";
import { ROUTES } from "@src/routes/routes";
import { Redirect, Route, Switch } from "react-router";

export default function AuthTabOutlet() {
  return (
    <Switch>
      <Redirect exact from={ROUTES.AUTH} to={`${ROUTES.AUTH}/login`} />

      <Route path={`${ROUTES.AUTH}/login`} component={LoginForm} />
      <Route path={`${ROUTES.AUTH}/register`} component={RegisterForm} />
    </Switch>
  );
}
