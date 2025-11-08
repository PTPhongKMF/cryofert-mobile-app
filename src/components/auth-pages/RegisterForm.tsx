import { valibotResolver } from "@hookform/resolvers/valibot";
import {
  IonButton,
  IonIcon,
  IonInput,
  IonPage,
  useIonRouter,
} from "@ionic/react";
import { slideDirectionRouter } from "@src/animations/slide-directional";
import { ROUTES } from "@src/routes/routes";
import { RegisterRequestSchema, type RegisterRequest } from "@src/schemas/auth";
import {
  arrowBackCircleOutline,
  eyeOffOutline,
  eyeOutline,
  lockClosedOutline,
  mailOutline,
} from "ionicons/icons";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { cn } from "@src/utils/cn";
import { useRegisterMutation } from "@src/services/api-services/auth-service";
import { useAlertDialogStore, useOtpDialogStore } from "@src/stores/dialog";
import { useAppLoadingStore } from "@src/stores/app-loading";
import { useShallow } from "zustand/react/shallow";

  const LOADER_KEY = "RegisterForm";

  export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showRpPassword, setShowRpPassword] = useState(false);

  const router = useIonRouter();

  const { startLoading, stopLoading } = useAppLoadingStore(
    useShallow((s) => ({
      startLoading: s.startLoading,
      stopLoading: s.stopLoading,
    }))
  );
  const openOtpDialog = useOtpDialogStore((s) => s.openOtpDialog);
  const openAlertDialog = useAlertDialogStore((s) => s.openAlertDialog);

  const registerMutation = useRegisterMutation();

  const registerForm = useForm<RegisterRequest>({
    defaultValues: {
      email: "",
      password: "",
      repeatPassword: "",
    },
    resolver: valibotResolver(RegisterRequestSchema),
  });

  useEffect(() => {
    if (registerMutation.isPending) {
      startLoading(LOADER_KEY);
    } else {
      stopLoading(LOADER_KEY);
    }
  }, [registerMutation.isPending, startLoading, stopLoading]);

  function handleRegister(formData: RegisterRequest) {
    console.log(formData);

    registerMutation.mutate(formData, {
      onError: (error) => {
        openAlertDialog({ title: error.name, content: error.message });
      },
      onSuccess: () => {
        openOtpDialog(formData.email);
      },
    });
  }

  return (
    <IonPage>
      <div className="grid grid-rows-[1fr_4rem] h-full pb-2 px-6 py-10">
        <form
          onSubmit={registerForm.handleSubmit(handleRegister)}
          className="grid grid-rows-[4rem_4rem_4rem_2fr_1fr] items-center gap-2"
        >
          <Controller
            name="email"
            control={registerForm.control}
            render={(email) => (
              <IonInput
                type="email"
                placeholder="Email"
                mode="md"
                fill="outline"
                errorText={email.fieldState.error?.message}
                clearInput={true}
                value={email.field.value}
                onIonInput={email.field.onChange}
                onIonBlur={email.field.onBlur}
                ref={email.field.ref}
                className={cn(
                  "ion-bg-white! ion-b-r-[7px]!  min-h-[1px]! ion-py-[0.45rem]!",
                  email.fieldState.error && "ion-invalid ion-touched"
                )}
              >
                <IonIcon
                  icon={mailOutline}
                  slot="start"
                  className="text-black me-4"
                />
              </IonInput>
            )}
          />

          <Controller
            name="password"
            control={registerForm.control}
            render={(password) => (
              <IonInput
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                mode="md"
                fill="outline"
                errorText={password.fieldState.error?.message}
                clearInput={true}
                value={password.field.value}
                onIonInput={password.field.onChange}
                onIonBlur={password.field.onBlur}
                ref={password.field.ref}
                className={cn(
                  "ion-bg-white! ion-b-r-[7px]!  min-h-[1px]! ion-py-[0.45rem]!",
                  password.fieldState.error && "ion-invalid ion-touched"
                )}
              >
                <IonIcon
                  icon={lockClosedOutline}
                  slot="start"
                  className="text-black me-4"
                />
                <IonIcon
                  slot="end"
                  onClick={() => setShowPassword((prev) => !prev)}
                  icon={showPassword ? eyeOffOutline : eyeOutline}
                  className="size-5"
                />
              </IonInput>
            )}
          />

          <Controller
            name="repeatPassword"
            control={registerForm.control}
            render={(repeatPassword) => (
              <IonInput
                type={showRpPassword ? "text" : "password"}
                placeholder="Password"
                mode="md"
                fill="outline"
                errorText={repeatPassword.fieldState.error?.message}
                clearInput={true}
                value={repeatPassword.field.value}
                onIonInput={repeatPassword.field.onChange}
                onIonBlur={repeatPassword.field.onBlur}
                ref={repeatPassword.field.ref}
                className={cn(
                  "ion-bg-white! ion-b-r-[7px]!  min-h-[1px]! ion-py-[0.45rem]!",
                  repeatPassword.fieldState.error && "ion-invalid ion-touched"
                )}
              >
                <IonIcon
                  icon={lockClosedOutline}
                  slot="start"
                  className="text-black me-4"
                />
                <IonIcon
                  slot="end"
                  onClick={() => setShowRpPassword((prev) => !prev)}
                  icon={showRpPassword ? eyeOffOutline : eyeOutline}
                  className="size-5"
                />
              </IonInput>
            )}
          />

          <IonButton
            type="submit"
            size="small"
            className="text-base font-semibold ion-py-[0.75rem] ion-bg-blue-600"
          >
            Register
          </IonButton>
        </form>

        <IonButton
          size="small"
          fill="clear"
          color="warning"
          onClick={() =>
            router.push(
              ROUTES.AUTH_LOGIN,
              "back",
              "push",
              undefined,
              slideDirectionRouter
            )
          }
          className="text-base font-semibold ion-py-[0.1rem] self-center ion-b-w-[1px] text-amber-900!"
        >
          <IonIcon
            slot="start"
            icon={arrowBackCircleOutline}
            className="size-6 me-4"
          ></IonIcon>
          Back to Log In
        </IonButton>
      </div>
    </IonPage>
  );
}
