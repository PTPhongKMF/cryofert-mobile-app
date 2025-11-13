import {
  IonButton,
  IonInputOtp,
  IonModal,
  IonSpinner,
  useIonRouter,
} from "@ionic/react";
import { ROUTES } from "@src/routes/routes";
import {
  useConfirmOtpMutation,
  useResendOtpMutation,
} from "@src/services/api-services/auth-service";
import { useAppLoadingStore } from "@src/stores/app-loading";
import { useOtpDialogStore, useGenericDialogStore } from "@src/stores/dialog";
import { cn } from "@utils/cn";
import { alertCircleOutline, checkmarkCircleOutline } from "ionicons/icons";
import { ShieldQuestionMark } from "lucide-react";
import { useEffect, useState } from "react";
import * as v from "valibot";
import { useShallow } from "zustand/react/shallow";

export interface ConfirmOtpRequest {
  email: string;
  verificationCode: string;
}

const LOADER_KEY = "OtpDialog";

export default function OtpDialog() {
  const [disabled, setDisabled] = useState(false);
  const [otpError, setOtpError] = useState(false);
  const [otp, setOtp] = useState("");

  const { email, isOpen, closeOtpDialog } = useOtpDialogStore(
    useShallow((s) => ({
      email: s.email,
      isOpen: s.isOpen,
      closeOtpDialog: s.closeOtpDialog,
    }))
  );
  const { startLoading, stopLoading } = useAppLoadingStore(
    useShallow((s) => ({
      startLoading: s.startLoading,
      stopLoading: s.stopLoading,
    }))
  );

  const openGenericDialog = useGenericDialogStore((s) => s.openGenericDialog);

  const router = useIonRouter();
  const resendOtpMutation = useResendOtpMutation();
  const confirmOtpMutation = useConfirmOtpMutation();

  useEffect(() => {
    if (confirmOtpMutation.isPending) {
      startLoading(LOADER_KEY);
    } else {
      stopLoading(LOADER_KEY);
    }
  }, [confirmOtpMutation.isPending, startLoading, stopLoading]);

  function handleResend() {
    setDisabled(true);
    resendOtpMutation.mutate(email, {
      onError: (error) =>
        openGenericDialog({
          title: error.name,
          content: error.message,
          svgIcon: alertCircleOutline,
          svgIconColor: "danger",
        }),
      onSettled: () => {
        setDisabled(false);
      },
    });
  }

  function handleConfirm(code?: string) {
    const verfCode = code ? code : otp;

    const result = v.safeParse(
      v.pipe(
        v.union([v.string(), v.number()]),
        v.transform((i) => i.toString()),
        v.minLength(6)
      ),
      verfCode
    );

    if (result.success) {
      confirmOtpMutation.mutate(
        {
          email: email,
          verificationCode: result.output,
        },
        {
          onError: (error) =>
            openGenericDialog({
              title: error.name,
              content: error.message,
              svgIcon: alertCircleOutline,
              svgIconColor: "danger",
            }),
          onSuccess: () => {
            openGenericDialog({
              title: "Verified Successfully",
              svgIcon: checkmarkCircleOutline,
              svgIconColor: "success",
              showBtn: true,
              btnText: "Back to Log In",
              btnColor: "success",
              closeFn: () => {
                router.push(ROUTES.L_AUTH);
              },
            });
            closeOtpDialog();
          },
        }
      );
    } else {
      setOtpError(true);
    }
  }

  return (
    <IonModal
      isOpen={isOpen}
      onDidDismiss={closeOtpDialog}
      backdropDismiss={false}
      className="ion-w-fit ion-h-fit ion-b-r-[10px] ion-box-shadow"
    >
      <div
        className="size-full p-4 w-[80vw] max-h-[50vh]
        grid grid-rows-[2.5rem_3rem_1fr_3rem] justify-items-center items-center gap-2"
      >
        <ShieldQuestionMark className="size-10 text-blue-500" />
        <h2 className="mt-0! font-semibold!">Please verify your email</h2>

        <IonInputOtp
          disabled={disabled}
          type="number"
          length={6}
          size="small"
          value={otp}
          onIonInput={(e) => {
            setOtp(e.detail.value ?? "");
          }}
          onIonFocus={() => {
            setOtpError(false);
          }}
          onIonComplete={(e) => handleConfirm(e.detail.value ?? "")}
          className={cn(
            "ion-min-w-[0px]! ion-w-[2.4rem]!",
            otpError && "ion-invalid ion-touched"
          )}
        >
          <p className={cn(otpError && "text-red-500")}>
            {otpError
              ? "Invalid OTP"
              : "Please check your registered email for otp"}
          </p>
        </IonInputOtp>

        <div className="flex justify-center items-center w-full gap-1 self-end text-base">
          <IonButton
            onClick={handleResend}
            disabled={disabled}
            size="small"
            className="min-w-20 text-base ion-bg-amber-500"
          >
            {resendOtpMutation.isPending ? (
              <IonSpinner name="crescent"></IonSpinner>
            ) : (
              "Resend"
            )}
          </IonButton>
          <IonButton
            onClick={() => handleConfirm()}
            disabled={disabled}
            size="small"
            className="w-full text-base"
          >
            Confirm
          </IonButton>
        </div>
      </div>
    </IonModal>
  );
}
