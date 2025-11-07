import {
  IonButton,
  IonContent,
  IonIcon,
  IonInput,
  IonInputPasswordToggle,
  IonItem,
  IonModal,
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
import { LoginRequestSchema, type LoginRequest } from "@src/schemas/auth";
import {
  arrowForwardCircleOutline,
  closeCircle,
  eyeOffOutline,
  eyeOutline,
  lockClosedOutline,
  mailOutline,
} from "ionicons/icons";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { cn } from "@src/utils/cn";
import { useAlertDialogStore } from "@src/stores/dialog";
import { useLoginMutation } from "@src/services/api-services/auth-service";
import { useAppLoadingStore } from "@src/stores/app-loading";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const openAlertDialog = useAlertDialogStore((s) => s.openAlertDialog);
  const setAppLoadingState = useAppLoadingStore((s) => s.setAppLoadingState);

  const router = useIonRouter();

  const loginMutation = useLoginMutation();
  const loginForm = useForm<LoginRequest>({
    defaultValues: {
      email: "",
      password: "",
    },
    reValidateMode: "onSubmit",
    resolver: valibotResolver(LoginRequestSchema),
  });

  useEffect(() => {
    if (loginMutation.isPending) {
      setAppLoadingState(true);
    } else {
      setAppLoadingState(false);
    }
  }, [loginMutation.isPending, setAppLoadingState]);

  function handleLogin(data: LoginRequest) {
    console.log(data);
    loginMutation.mutate(data, {
      onError: (error) => {
        openAlertDialog({ title: error.name, content: error.message });
      },
      onSuccess: () => {
        router.push(ROUTES.T_HOME, "none");
      },
    });
  }

  return (
    <IonPage>
      <div className="grid grid-rows-[1fr_4rem] h-full pb-2 px-6 py-10">
        <form
          noValidate
          onSubmit={loginForm.handleSubmit(handleLogin)}
          className="grid grid-rows-[4rem_4rem_1fr] items-center gap-2"
        >
          <Controller
            name="email"
            control={loginForm.control}
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
            control={loginForm.control}
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

          <Button
            type="submit"
            variant="outline"
            className="text-base font-semibold bg-transparent border-1! border-blue-500! text-blue-500 rounded-lg!
            active:bg-blue-100 transition-colors duration-100"
          >
            Log In
          </Button>
        </form>

        <Button
          onClick={() =>
            router.push(
              ROUTES.AUTH_REGISTER,
              "forward",
              "push",
              undefined,
              slideDirectionRouter
            )
          }
          className="text-base font-semibold bg-amber-400 border-1! border-amber-200! text-white rounded-lg!
          active:bg-amber-600 transition-colors duration-100"
        >
          Create an account
          <IonIcon icon={arrowForwardCircleOutline} className="size-6" />
        </Button>
      </div>
    </IonPage>
  );
}
