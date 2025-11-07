import { IonButton, IonInputOtp, IonModal, IonSpinner } from "@ionic/react";
import {
  useConfirmOtpMutation,
  useResendOtpMutation,
} from "@src/services/api-services/auth-service";
import { useAppLoadingStore } from "@src/stores/app-loading";
import { useAlertDialogStore } from "@src/stores/dialog";
import { cn } from "@utils/cn";
import { ShieldQuestionMark } from "lucide-react";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import * as v from "valibot";

interface OtpDialogProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  email: string;
}

export interface ConfirmOtpRequest {
  email: string;
  verificationCode: string;
}

export default function OtpDialog(props: OtpDialogProps) {
  const [disabled, setDisabled] = useState(false);
  const [otpError, setOtpError] = useState(false);
  const [otp, setOtp] = useState<number | string>();

  const openAlertDialog = useAlertDialogStore((s) => s.openAlertDialog);
  const setAppLoadingState = useAppLoadingStore((s) => s.setAppLoadingState);

  const resendOtpMutation = useResendOtpMutation();
  const confirmOtpMutation = useConfirmOtpMutation();

  useEffect(() => {
    if (confirmOtpMutation.isPending) {
      setAppLoadingState(true);
    } else {
      setAppLoadingState(false);
    }
  }, [confirmOtpMutation.isPending, setAppLoadingState]);

  function handleResend() {
    setDisabled(true);
    resendOtpMutation.mutate(props.email, {
      onError: (error) =>
        openAlertDialog({ title: error.name, content: error.message }),
      onSettled: () => setDisabled(false),
    });
  }

  function handleConfirm() {
    const result = v.safeParse(
      v.pipe(
        v.union([v.string(), v.number()]),
        v.transform((i) => i.toString()),
        v.minLength(6)
      ),
      otp
    );

    if (result.success) {
      confirmOtpMutation.mutate(
        {
          email: props.email,
          verificationCode: result.output,
        },
        {
          onError: (error) =>
            openAlertDialog({ title: error.name, content: error.message }),
          onSuccess: () => {},
        }
      );
    } else {
      setOtpError(true);
    }
  }

  return (
    <IonModal
      isOpen={props.isOpen}
      onDidDismiss={() => props.setIsOpen(false)}
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
            setOtpError(false);
            setOtp(e.target.value ?? undefined);
          }}
          onIonComplete={handleConfirm}
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
            onClick={handleConfirm}
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
