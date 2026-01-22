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
import {
  lockClosedOutline,
  eyeOutline,
  eyeOffOutline,
  alertCircleOutline,
  checkmarkCircleOutline,
} from "ionicons/icons";
import { useState, useEffect } from "react";
import * as v from "valibot";
import { useChangePasswordMutation } from "@src/hooks/auth-hook";
import { useAppLoadingStore } from "@src/stores/app-loading";
import { useGenericDialogStore } from "@src/stores/dialog";
import { useShallow } from "zustand/react/shallow";

const LOADER_KEY = "ChangePassword";

const PasswordSchema = v.pipe(v.string(), v.nonEmpty("Password is required"));

const ChangePasswordSchema = v.object({
  currentPassword: PasswordSchema,
  newPassword: PasswordSchema,
  confirmPassword: PasswordSchema,
});

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentPasswordErr, setCurrentPasswordErr] = useState("");
  const [newPasswordErr, setNewPasswordErr] = useState("");
  const [confirmPasswordErr, setConfirmPasswordErr] = useState("");
  const router = useIonRouter();

  const { startLoading, stopLoading } = useAppLoadingStore(
    useShallow((s) => ({
      startLoading: s.startLoading,
      stopLoading: s.stopLoading,
    }))
  );
  const openGenericDialog = useGenericDialogStore((s) => s.openGenericDialog);
  const changePasswordMutation = useChangePasswordMutation();

  useEffect(() => {
    if (changePasswordMutation.isPending) {
      startLoading(LOADER_KEY);
    } else {
      stopLoading(LOADER_KEY);
    }
  }, [changePasswordMutation.isPending, startLoading, stopLoading]);

  function handleChangePassword() {
    // Reset error messages
    setCurrentPasswordErr("");
    setNewPasswordErr("");
    setConfirmPasswordErr("");

    // Validate all fields
    const result = v.safeParse(ChangePasswordSchema, {
      currentPassword,
      newPassword,
      confirmPassword,
    });

    if (!result.success) {
      // Set individual field errors
      result.issues.forEach((issue) => {
        const path = issue.path?.[0]?.key;
        if (path === "currentPassword") {
          setCurrentPasswordErr(issue.message);
        } else if (path === "newPassword") {
          setNewPasswordErr(issue.message);
        } else if (path === "confirmPassword") {
          setConfirmPasswordErr(issue.message);
        }
      });
      return;
    }

    // Check if new password matches confirm password
    if (newPassword !== confirmPassword) {
      setConfirmPasswordErr("Passwords do not match");
      return;
    }

    // Call mutation
    changePasswordMutation.mutate(
      {
        currentPassword,
        newPassword,
        confirmPassword,
      },
      {
        onSuccess: () => {
          openGenericDialog({
            title: "Success",
            content: "Your password has been changed successfully",
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
      }
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>Change Password</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="relative">
        <BlueToGrayGradientBg />

        <div className="relative flex flex-col h-full px-6">
          <div className="mt-20! mb-10! flex flex-col justify-center items-center">
            <h1 className="font-semibold! text-blue-600">Change Password</h1>
            <p className="text-center">
              Enter your current password and choose a new one
            </p>
          </div>

          <IonInput
            type={showCurrentPassword ? "text" : "password"}
            placeholder="Current Password"
            mode="md"
            fill="outline"
            clearInput={true}
            errorText={currentPasswordErr}
            value={currentPassword}
            onIonInput={(e) => {
              setCurrentPassword(e.target.value?.toString() ?? "");
              if (currentPasswordErr) {
                setCurrentPasswordErr("");
              }
            }}
            className={cn(
              "ion-bg-white! ion-b-r-[7px]!  min-h-[1px]! ion-py-[0.45rem]!",
              currentPasswordErr && "ion-invalid ion-touched",
            )}
          >
            <IonIcon
              icon={lockClosedOutline}
              slot="start"
              className="text-black me-4"
            />
            <IonIcon
              slot="end"
              onClick={() => setShowCurrentPassword((prev) => !prev)}
              icon={showCurrentPassword ? eyeOffOutline : eyeOutline}
              className="size-5"
            />
          </IonInput>

          <IonInput
            type={showNewPassword ? "text" : "password"}
            placeholder="New Password"
            mode="md"
            fill="outline"
            clearInput={true}
            errorText={newPasswordErr}
            value={newPassword}
            onIonInput={(e) => {
              setNewPassword(e.target.value?.toString() ?? "");
              if (newPasswordErr) {
                setNewPasswordErr("");
              }
            }}
            className={cn(
              "ion-bg-white! ion-b-r-[7px]!  min-h-[1px]! ion-py-[0.45rem]! mt-4",
              newPasswordErr && "ion-invalid ion-touched",
            )}
          >
            <IonIcon
              icon={lockClosedOutline}
              slot="start"
              className="text-black me-4"
            />
            <IonIcon
              slot="end"
              onClick={() => setShowNewPassword((prev) => !prev)}
              icon={showNewPassword ? eyeOffOutline : eyeOutline}
              className="size-5"
            />
          </IonInput>

          <IonInput
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm New Password"
            mode="md"
            fill="outline"
            clearInput={true}
            errorText={confirmPasswordErr}
            value={confirmPassword}
            onIonInput={(e) => {
              setConfirmPassword(e.target.value?.toString() ?? "");
              if (confirmPasswordErr) {
                setConfirmPasswordErr("");
              }
            }}
            className={cn(
              "ion-bg-white! ion-b-r-[7px]!  min-h-[1px]! ion-py-[0.45rem]! mt-4",
              confirmPasswordErr && "ion-invalid ion-touched",
            )}
          >
            <IonIcon
              icon={lockClosedOutline}
              slot="start"
              className="text-black me-4"
            />
            <IonIcon
              slot="end"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              icon={showConfirmPassword ? eyeOffOutline : eyeOutline}
              className="size-5"
            />
          </IonInput>

          <IonButton
            size="small"
            disabled={
              !currentPassword ||
              !newPassword ||
              !confirmPassword ||
              changePasswordMutation.isPending
            }
            onClick={handleChangePassword}
            className="mt-20 w-full text-base font-semibold ion-py-[0.75rem] self-end ion-bg-blue-600"
          >
            Change Password
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
}
