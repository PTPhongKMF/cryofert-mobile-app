import { IonApp, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import RootRoutes from "@src/routes/RootRoutes";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import "@ionic/react/css/palettes/dark.system.css";
import AlertDialog from "@src/components/dialogs/AlertDialog";
import AppLoading from "@src/components/AppLoading";
import OtpDialog from "@src/components/dialogs/OtpDialog";
import SuccessDialog from "@src/components/dialogs/SuccessDialog";

/* Theme variables */
// import './theme/variables.css';

setupIonicReact();

export default function App() {
  return (
    <IonApp>
      <IonReactRouter>
        <RootRoutes />

        <OtpDialog />
        <SuccessDialog />
        <AlertDialog />
        <AppLoading />
      </IonReactRouter>
    </IonApp>
  );
}
