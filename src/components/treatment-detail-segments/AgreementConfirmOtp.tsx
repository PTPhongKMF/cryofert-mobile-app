import {
  IonButton,
  IonInputOtp,
  IonModal,
  IonSpinner,
} from "@ionic/react";
import {
  alertCircleOutline,
  checkmarkCircleOutline,
} from "ionicons/icons";
import { useVerifySignAgreementMutation } from "@src/hooks/agreement-hook";
import { useAppLoadingStore } from "@src/stores/app-loading";
import { useGenericDialogStore } from "@src/stores/dialog";
import { cn } from "@src/utils/cn";
import { ShieldQuestionMark } from "lucide-react";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import * as v from "valibot";

const LOADER_KEY = "agreement-sign";

interface AgreementConfirmOtpProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  agreementId: string;
  agreementCode?: string;
  templateHtml?: string;
  onAgreementSigned?: () => void;
}

export default function AgreementConfirmOtp(props: AgreementConfirmOtpProps) {
  const { startLoading, stopLoading } = useAppLoadingStore(
    useShallow((s) => ({
      startLoading: s.startLoading,
      stopLoading: s.stopLoading,
    }))
  );

  const openGenericDialog = useGenericDialogStore((s) => s.openGenericDialog);

  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const verifySignAgreementMutation = useVerifySignAgreementMutation();

  useEffect(() => {
    if (verifySignAgreementMutation.isPending) {
      startLoading(LOADER_KEY);
      setDisabled(true);
    } else {
      stopLoading(LOADER_KEY);
      setDisabled(false);
    }
  }, [verifySignAgreementMutation.isPending, startLoading, stopLoading]);

  useEffect(() => {
    if (!props.isOpen) {
      setOtp("");
      setOtpError(false);
    }
  }, [props.isOpen]);

  function handleConfirm(code?: string) {
    const verfCode = code ?? otp;

    const result = v.safeParse(
      v.pipe(
        v.union([v.string(), v.number()]),
        v.transform((i) => i.toString()),
        v.minLength(6)
      ),
      verfCode
    );

    if (!result.success) {
      setOtpError(true);
      return;
    }

    const html = props.templateHtml;

    if (!html) {
      setOtpError(true);
      openGenericDialog({
        title: "Template Error",
        content: "Agreement HTML is not available yet",
        svgIcon: alertCircleOutline,
        svgIconColor: "danger",
      });
      return;
    }

    const agreementFile = new File(
      [html.replace(/(<head[^>]*>)/i, `$1<meta charset="utf-8" />`)],
      `agreement-${props.agreementCode ?? "unknown"}.html`,
      { type: "text/html" }
    );

    verifySignAgreementMutation.mutate(
      {
        id: props.agreementId,
        otpCode: result.output,
        signedAgreementFile: agreementFile,
      },
      {
        onError: (error) => {
          setOtpError(true);
          openGenericDialog({
            title: error.name,
            content: error.message,
            svgIcon: alertCircleOutline,
            svgIconColor: "danger",
          });
        },
        onSuccess: () => {
          setOtp("");
          setOtpError(false);
          openGenericDialog({
            title: "Verified Successfully",
            svgIcon: checkmarkCircleOutline,
            svgIconColor: "success",
            buttons: {
              text: "Ok",
              color: "success",
              closeFn: () => {
                props.setIsOpen(false);
                props.onAgreementSigned?.();
              },
            },
          });
        },
      }
    );
  }

  return (
    <IonModal
      isOpen={props.isOpen}
      onDidDismiss={() => props.setIsOpen(false)}
      backdropDismiss={false}
      className="ion-w-fit ion-h-fit ion-b-r-[10px]! ion-box-shadow!"
    >
      <div
        className="size-full p-4 w-[80vw] max-h-[50vh]
        grid grid-rows-[2.5rem_3rem_1fr_3rem] justify-items-center items-center gap-2"
      >
        <ShieldQuestionMark className="size-10 text-blue-500" />
        <h2 className="mt-0! font-semibold!">Please verify with your email</h2>

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
            onClick={() => handleConfirm()}
            disabled={disabled}
            size="small"
            className="w-full text-base"
          >
            {verifySignAgreementMutation.isPending ? (
              <IonSpinner name="crescent"></IonSpinner>
            ) : (
              "Confirm"
            )}
          </IonButton>
        </div>
      </div>
    </IonModal>
  );
}
