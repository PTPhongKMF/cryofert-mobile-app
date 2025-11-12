import { valibotResolver } from "@hookform/resolvers/valibot";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonFooter,
} from "@ionic/react";
import { useForm } from "react-hook-form";

export default function UpdateAccount() {
  // const updateAccountForm = useForm<>({
  //   defaultValues: {
  //     email: "",
  //     password: "",
  //   },
  //   reValidateMode: "onSubmit",
  //   resolver: valibotResolver(),
  // });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>Update Information</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="p-4">
          <form
            noValidate
            // onSubmit={loginForm.handleSubmit(handleLogin)}
            className="grid grid-rows-[4rem_4rem_1fr] items-center gap-2"
          ></form>
        </div>
      </IonContent>

      <IonFooter>
        <IonToolbar></IonToolbar>
      </IonFooter>
    </IonPage>
  );
}
