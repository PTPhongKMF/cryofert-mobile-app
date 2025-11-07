import { valibotResolver } from "@hookform/resolvers/valibot";
import {
  IonButton,
  IonIcon,
  IonInput,
  IonPage,
  useIonRouter,
} from "@ionic/react";
import { slideDirectionRouter } from "@src/animations/slide-directional";
import { Button } from "@src/components/libs/shadcn/Button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@src/components/libs/shadcn/InputGroup";
import { ROUTES } from "@src/routes/routes";
import { RegisterRequestSchema, type RegisterRequest } from "@src/schemas/auth";
import {
  arrowBackCircleOutline,
  arrowForwardCircleOutline,
  closeCircle,
  eyeOffOutline,
  eyeOutline,
  lockClosedOutline,
  mailOutline,
} from "ionicons/icons";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { cn } from "@src/utils/cn";
import { useRegisterMutation } from "@src/services/api-services/auth-service";
import { useAlertDialogStore } from "@src/stores/dialog";
import OtpDialog from "@src/components/dialogs/OtpDialog";
import { useAppLoadingStore } from "@src/stores/app-loading";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showRpPassword, setShowRpPassword] = useState(false);
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [otpEmail, setOtpEmail] = useState("");

  const router = useIonRouter();

  const openAlertDialog = useAlertDialogStore((s) => s.openAlertDialog);
  const setAppLoadingState = useAppLoadingStore((s) => s.setAppLoadingState);

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
      setAppLoadingState(true);
    } else {
      setAppLoadingState(false);
    }
  }, [registerMutation.isPending, setAppLoadingState]);

  function handleRegister(formData: RegisterRequest) {
    console.log(formData);

    registerMutation.mutate(formData, {
      onError: (error) => {
        openAlertDialog({ title: error.name, content: error.message });
      },
      onSuccess: () => {
        setOtpEmail(formData.email);
        setShowOtpDialog(true);
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
                  className="text-black"
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

          <Button
            type="submit"
            variant="outline"
            className="text-base font-semibold bg-transparent border-1! border-blue-500! text-blue-500 rounded-lg!
            active:bg-blue-100 transition-colors duration-100"
          >
            Register
          </Button>
        </form>

        <Button
          onClick={() =>
            router.push(
              ROUTES.AUTH_LOGIN,
              "back",
              "push",
              undefined,
              slideDirectionRouter
            )
          }
          className="text-base font-semibold bg-amber-400 border-1! border-amber-200! text-white rounded-lg!
          active:bg-amber-600 transition-colors duration-100"
        >
          <IonIcon icon={arrowBackCircleOutline} className="size-6" />
          Back to Log In
        </Button>
      </div>

      <OtpDialog
        email={otpEmail}
        isOpen={showOtpDialog}
        setIsOpen={setShowOtpDialog}
      />
    </IonPage>
  );
}
