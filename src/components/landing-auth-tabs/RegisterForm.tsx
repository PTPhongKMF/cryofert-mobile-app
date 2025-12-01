import { valibotResolver } from "@hookform/resolvers/valibot";
import {
  IonButton,
  IonDatetime,
  IonDatetimeButton,
  IonIcon,
  IonInput,
  IonModal,
  IonNote,
  IonRadio,
  IonRadioGroup,
  useIonRouter,
} from "@ionic/react";
import { RegisterRequestSchema, type RegisterRequest } from "@src/schemas/auth";
import {
  alertCircleOutline,
  arrowBackCircleOutline,
  eyeOffOutline,
  eyeOutline,
  lockClosedOutline,
  mailOutline,
} from "ionicons/icons";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { cn } from "@src/utils/cn";
import { useGenericDialogStore, useOtpDialogStore } from "@src/stores/dialog";
import { useAppLoadingStore } from "@src/stores/app-loading";
import { useShallow } from "zustand/react/shallow";
import { useRegisterMutation } from "@src/hooks/auth-hook";
import { VenusAndMars } from "lucide-react";
import { ROUTES } from "@src/routes/routes";

const LOADER_KEY = "RegisterForm";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showRpPassword, setShowRpPassword] = useState(false);

  const router = useIonRouter();
  const genderDateModal = useRef<HTMLIonModalElement>(null);

  const { startLoading, stopLoading } = useAppLoadingStore(
    useShallow((s) => ({
      startLoading: s.startLoading,
      stopLoading: s.stopLoading,
    }))
  );
  const openOtpDialog = useOtpDialogStore((s) => s.openOtpDialog);
  const openGenericDialog = useGenericDialogStore((s) => s.openGenericDialog);

  const registerMutation = useRegisterMutation();

  const registerForm = useForm<RegisterRequest>({
    defaultValues: {
      email: "",
      password: "",
      gender: true,
      birthDate: new Date().toISOString(),
      repeatPassword: "",
    },
    reValidateMode: "onSubmit",
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
        openGenericDialog({
          title: error.name,
          content: error.message,
          svgIcon: alertCircleOutline,
          svgIconColor: "danger",
        });
      },
      onSuccess: () => {
        openOtpDialog(formData.email);
      },
    });
  }

  return (
    <div className="grid grid-rows-[1fr_4rem] h-full px-6 pt-10">
      <form
        onSubmit={registerForm.handleSubmit(handleRegister)}
        className="grid grid-rows-[4rem_4rem_4rem_4rem_4rem_1fr] items-center gap-2"
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

        <Controller
          name="gender"
          control={registerForm.control}
          render={(gender) => (
            <IonRadioGroup
              errorText={gender.fieldState.error?.message}
              value={gender.field.value}
              onIonChange={gender.field.onChange}
              ref={gender.field.ref}
              className={cn(
                "w-full px-2",
                gender.fieldState.error && "ion-invalid ion-touched"
              )}
            >
              <div className="flex w-full justify-between items-center">
                <p className="flex justify-center items-center gap-2 text-gray-700">
                  <VenusAndMars className="size-5" />
                  Gender
                </p>

                <div className="flex justify-center items-center gap-10 px-4">
                  <IonRadio value={true} className="text-sm">
                    Male
                  </IonRadio>
                  <IonRadio value={false} className="text-sm">
                    Female
                  </IonRadio>
                </div>
              </div>
            </IonRadioGroup>
          )}
        />

        <Controller
          name="birthDate"
          control={registerForm.control}
          render={(birthDate) => (
            <div
              onClick={() => genderDateModal.current?.present()}
              className="w-full h-fit flex flex-col justify-center items-start gap-2"
            >
              <div
                className={cn(
                  "flex justify-between items-center w-full",
                  "bg-white border-1 rounded-[7px] h-12 py-[0.45rem]py-2 px-2",
                  birthDate.fieldState.error && "border-red-400"
                )}
              >
                <label className="">Birth Date</label>

                <IonDatetimeButton
                  datetime="birth-date"
                  className="self-center"
                ></IonDatetimeButton>
              </div>

              <IonNote className="ps-4 text-xs text-red-700!">
                {birthDate.fieldState.error?.message}
              </IonNote>

              <IonModal
                keepContentsMounted
                initialBreakpoint={1}
                breakpoints={[0, 1]}
                ref={genderDateModal}
                className="ion-w-[100%]! ion-bg-gray-100"
              >
                <IonDatetime
                  id="birth-date"
                  presentation="date"
                  preferWheel
                  showAdjacentDays
                  value={birthDate.field.value}
                  onIonChange={birthDate.field.onChange}
                  onIonBlur={birthDate.field.onBlur}
                  ref={birthDate.field.ref}
                  max={registerForm.formState.defaultValues?.birthDate}
                  className="mx-auto h-full"
                />
              </IonModal>
            </div>
          )}
        />

        <IonButton
          type="submit"
          size="small"
          className="text-base font-semibold ion-py-[0.75rem] self-end ion-bg-blue-600"
        >
          Register
        </IonButton>
      </form>

      <IonButton
        size="small"
        fill="clear"
        color="warning"
        onClick={() =>
          router.push(`${ROUTES.L_AUTH}?authPage=0`, "none", "replace")
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
  );
}
