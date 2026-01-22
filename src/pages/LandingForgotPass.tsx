import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonIcon,
  IonInput,
  IonButton,
  useIonRouter,
} from "@ionic/react";
import BlueToGrayGradientBg from "@src/components/backgrounds/BlueToGrayGradientBg";
import { cn } from "@utils/cn";
import { mailOutline, alertCircleOutline, checkmarkCircleOutline } from "ionicons/icons";
import { useState, useEffect } from "react";
import * as v from "valibot";
import { useForgotPasswordMutation } from "@src/hooks/auth-hook";
import { useAppLoadingStore } from "@src/stores/app-loading";
import { useGenericDialogStore } from "@src/stores/dialog";
import { useShallow } from "zustand/react/shallow";

const LOADER_KEY = "LandingForgotPass";

const EmailSchema = v.pipe(
  v.string(),
  v.nonEmpty("Email is required"),
  v.email("Invalid email format")
);

export default function LandingForgotPass() {
  const [email, setEmail] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const router = useIonRouter();

  const { startLoading, stopLoading } = useAppLoadingStore(
    useShallow((s) => ({
      startLoading: s.startLoading,
      stopLoading: s.stopLoading,
    }))
  );
  const openGenericDialog = useGenericDialogStore((s) => s.openGenericDialog);
  const forgotPasswordMutation = useForgotPasswordMutation();

  useEffect(() => {
    if (forgotPasswordMutation.isPending) {
      startLoading(LOADER_KEY);
    } else {
      stopLoading(LOADER_KEY);
    }
  }, [forgotPasswordMutation.isPending, startLoading, stopLoading]);

  function handleSendReset() {
    // Reset error message
    setErrMsg("");

    // Validate email
    const result = v.safeParse(EmailSchema, email);
    if (!result.success) {
      setErrMsg(result.issues[0].message);
      return;
    }

    // Call mutation
    forgotPasswordMutation.mutate(email, {
      onSuccess: () => {
        openGenericDialog({
          title: "Success",
          content: "A new password will be sent to your email",
          svgIcon: checkmarkCircleOutline,
          svgIconColor: "success",
          backdropDismiss: false,
          buttons: {
            text: "Ok",
            color: "primary",
            closeFn: () => {
              router.goBack();
            },
          },
        });
      },
      onError: (error) => {
        openGenericDialog({
          title: "Failed",
          content: error.message || "An error occurred. Please try again.",
          svgIcon: alertCircleOutline,
          svgIconColor: "danger",
          backdropDismiss: true,
        });
      },
    });
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>Reset your password</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="relative">
        <BlueToGrayGradientBg />

        <div className="relative flex flex-col h-full px-6">
          <div className="mt-20! mb-10! flex flex-col justify-center items-center">
            <h1 className="font-semibold! text-blue-600">Enter your email</h1>
            <p className="text-center">
              we will sent a reset password to your registered email
            </p>
          </div>

          <IonInput
            type="email"
            placeholder="Email"
            mode="md"
            fill="outline"
            clearInput={true}
            errorText={errMsg}
            value={email}
            onIonInput={(e) => {
              setEmail(e.target.value?.toString() ?? "");
              // Reset error message when user types
              if (errMsg) {
                setErrMsg("");
              }
            }}
            className={cn(
              "ion-bg-white! ion-b-r-[7px]!  min-h-[1px]! ion-py-[0.45rem]!",
              errMsg && "ion-invalid ion-touched",
            )}
          >
            <IonIcon
              icon={mailOutline}
              slot="start"
              className="text-black me-4"
            />
          </IonInput>

          <IonButton
            size="small"
            disabled={!email || forgotPasswordMutation.isPending}
            onClick={handleSendReset}
            className="mt-20 w-full text-base font-semibold ion-py-[0.75rem] self-end ion-bg-blue-600"
          >
            Send
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
}
