import {
  IonButton,
  IonIcon,
  IonInput,
  IonPage,
  useIonRouter,
} from "@ionic/react";
import { slideDirectionRouter } from "@src/animations/slide-directional";
import { Button } from "@src/components/libs/shadcn/Button";
import { ROUTES } from "@src/routes/routes";
import { LoginRequestSchema, type LoginRequest } from "@src/schemas/auth";
import {
  arrowForwardCircleOutline,
  eyeOffOutline,
  eyeOutline,
  lockClosedOutline,
  mailOutline,
} from "ionicons/icons";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { cn } from "@src/utils/cn";
import { useAlertDialogStore, useOtpDialogStore } from "@src/stores/dialog";
import { useLoginMutation } from "@src/services/api-services/auth-service";
import { useAppLoadingStore } from "@src/stores/app-loading";
import { setSecuredToken } from "@src/services/token-service";
import { useLocalUserStore } from "@src/stores/user";
import { useShallow } from "zustand/react/shallow";

const LOADER_KEY = "LoginForm";
export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const { startLoading, stopLoading } = useAppLoadingStore(
    useShallow((s) => ({
      startLoading: s.startLoading,
      stopLoading: s.stopLoading,
    }))
  );
  const setLocalUser = useLocalUserStore((s) => s.setLocalUser);
  const openAlertDialog = useAlertDialogStore((s) => s.openAlertDialog);
  const openOtpDialog = useOtpDialogStore((s) => s.openOtpDialog);

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
      startLoading(LOADER_KEY);
    } else {
      stopLoading(LOADER_KEY);
    }
  }, [loginMutation.isPending, startLoading, stopLoading]);

  function handleLogin(data: LoginRequest) {
    console.log(data);
    loginMutation.mutate(data, {
      onError: (error) => {
        openAlertDialog({ title: error.name, content: error.message });
      },
      onSuccess: (data) => {
        if (data.systemCode === "NEED_OTP") {
          openOtpDialog(data.data.user.email);
        } else {
          setLocalUser({
            id: data.data.user.id,
            roleId: data.data.user.roleId,
            roleName: data.data.user.roleName,
            userName: data.data.user.userName,
          });
          setSecuredToken("access-token", data.data.token ?? "");
          setSecuredToken("refresh-token", data.data.refreshToken ?? "");
          router.push(ROUTES.T_HOME, "none");
        }
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
                  className="text-black me-4"
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

          <IonButton
            type="submit"
            size="small"
            className="text-base font-semibold ion-py-[0.75rem] ion-bg-blue-600"
          >
            Log In
          </IonButton>
        </form>

        <IonButton
          size="small"
          fill="clear"
          color="warning"
          onClick={() =>
            router.push(
              ROUTES.AUTH_REGISTER,
              "forward",
              "push",
              undefined,
              slideDirectionRouter
            )
          }
          className="text-base font-semibold ion-py-[0.1rem] self-center ion-b-w-[1px] text-amber-900!"
        >
          Create an account
          <IonIcon
            slot="end"
            icon={arrowForwardCircleOutline}
            className="size-6 ms-4"
          ></IonIcon>
        </IonButton>
      </div>
    </IonPage>
  );
}
