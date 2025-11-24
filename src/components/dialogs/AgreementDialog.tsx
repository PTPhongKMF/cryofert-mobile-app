import {
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonInputOtp,
  IonModal,
  IonSpinner,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import {
  useRequestSignAgreementMutation,
  useVerifySignAgreementMutation,
} from "@src/hooks/agreement-hook";
import type { AgreementResponse } from "@src/schemas/agreement";
import { useAppLoadingStore } from "@src/stores/app-loading";
import { useGenericDialogStore } from "@src/stores/dialog";
import { cn } from "@utils/cn";
import { alertCircleOutline, checkmarkCircleOutline } from "ionicons/icons";
import { ShieldQuestionMark } from "lucide-react";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import * as v from "valibot";
import { useShallow } from "zustand/react/shallow";

interface AgreementDialogProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  agreement: AgreementResponse | null;
}

const LOADER_KEY = "agreement-sign";

export default function AgreementDialog(props: AgreementDialogProps) {
  const [otpIsOpen, setOtpIsOpen] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [otpError, setOtpError] = useState(false);
  const [otp, setOtp] = useState("");

  const isViewable =
    props.agreement?.status === "Canceled" ||
    props.agreement?.status === "Completed";

  const { startLoading, stopLoading } = useAppLoadingStore(
    useShallow((s) => ({
      startLoading: s.startLoading,
      stopLoading: s.stopLoading,
    }))
  );
  const openGenericDialog = useGenericDialogStore((s) => s.openGenericDialog);

  const requestSignAgreementMutation = useRequestSignAgreementMutation();
  const verifySignAgreementMutation = useVerifySignAgreementMutation();

  useEffect(() => {
    if (requestSignAgreementMutation.isPending) {
      startLoading(LOADER_KEY);
    } else {
      stopLoading(LOADER_KEY);
    }
  }, [startLoading, stopLoading, requestSignAgreementMutation.isPending]);

  useEffect(() => {
    if (verifySignAgreementMutation.isPending) {
      startLoading(LOADER_KEY);
      setDisabled(true);
    } else {
      stopLoading(LOADER_KEY);
      setDisabled(false);
    }
  }, [verifySignAgreementMutation.isPending, startLoading, stopLoading]);

  function handleAgree() {
    requestSignAgreementMutation.mutate(props.agreement?.id || "", {
      onSuccess: () => setOtpIsOpen(true),
      onError: (error) =>
        openGenericDialog({
          title: error.name,
          content: error.message,
          svgIcon: alertCircleOutline,
          svgIconColor: "danger",
        }),
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
      verifySignAgreementMutation.mutate(
        {
          id: props.agreement?.id || "",
          otpCode: result.output,
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
                  setOtpIsOpen(false);
                  props.setIsOpen(false);
                },
              },
            });
          },
        }
      );
    } else {
      setOtpError(true);
    }
  }

  return (
    <>
      <IonModal
        isOpen={props.isOpen}
        onDidDismiss={() => props.setIsOpen(false)}
      >
        <IonHeader>
          <IonToolbar>
            <IonTitle className="ms-4">Agreement</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => props.setIsOpen(false)}>
                Close
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <p className="text-center text-[70px] bg-neutral-200">
            SẼ CÓ MỘT BẢN AGREEMENT SAU Ở ĐÂY
          </p>
        </IonContent>

        {!isViewable && (
          <IonFooter>
            <IonToolbar className="ion-px-[0.5rem]">
              <IonButton onClick={handleAgree} fill="solid" className="w-full">
                I Agree
              </IonButton>
            </IonToolbar>
          </IonFooter>
        )}
      </IonModal>

      <IonModal
        isOpen={otpIsOpen}
        onDidDismiss={() => setOtpIsOpen(false)}
        backdropDismiss={false}
        className="ion-w-fit ion-h-fit ion-b-r-[10px]! ion-box-shadow!"
      >
        <div
          className="size-full p-4 w-[80vw] max-h-[50vh]
        grid grid-rows-[2.5rem_3rem_1fr_3rem] justify-items-center items-center gap-2"
        >
          <ShieldQuestionMark className="size-10 text-blue-500" />
          <h2 className="mt-0! font-semibold!">
            Please verify with your email
          </h2>

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
    </>
  );
}
