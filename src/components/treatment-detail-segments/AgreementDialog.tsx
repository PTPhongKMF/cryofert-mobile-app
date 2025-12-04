import { format } from "@formkit/tempo";
import {
  IonButton,
  IonButtons,
  IonCheckbox,
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
import { usePatientDetailQuery } from "@src/hooks/account-hook";
import {
  useBuildAgreementTemplateMutation,
  type AgreementTemplatePayload,
} from "@src/hooks/media-template-hook";
import { useMediaTemplateQuery } from "@src/hooks/media-hook";
import type { AgreementResponse } from "@src/schemas/agreement";
import type { PatientResponse } from "@src/schemas/account";
import type { TreatmentDetail } from "@src/schemas/treatment";
import { useAppLoadingStore } from "@src/stores/app-loading";
import { useGenericDialogStore } from "@src/stores/dialog";
import { cn } from "@utils/cn";
import {
  alertCircleOutline,
  checkmarkCircleOutline,
  close,
  createOutline,
} from "ionicons/icons";
import { ShieldQuestionMark } from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import * as v from "valibot";
import { useShallow } from "zustand/react/shallow";
import AgreementFormEdit from "./AgreementFormEdit";

interface AgreementDialogProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  agreement: AgreementResponse | null;
  treatment: TreatmentDetail | null;
  onAgreementSigned?: () => void;
}

const LOADER_KEY = "agreement-sign";

export default function AgreementDialog(props: AgreementDialogProps) {
  const [otpIsOpen, setOtpIsOpen] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [otpError, setOtpError] = useState(false);
  const [otp, setOtp] = useState("");

  const [isAgree, setIsAgree] = useState(false);
  const agreeRef = useRef<HTMLIonCheckboxElement>(null);
  const [templatePayload, setTemplatePayload] =
    useState<AgreementTemplatePayload | null>(null);
  const [isPreparingTemplate, setIsPreparingTemplate] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);

  const agreement = props.agreement;
  const treatment = props.treatment;
  const patientId = agreement?.patientId ?? "";

  const isViewable =
    agreement?.status === "Canceled" || agreement?.status === "Completed";

  const { startLoading, stopLoading } = useAppLoadingStore(
    useShallow((s) => ({
      startLoading: s.startLoading,
      stopLoading: s.stopLoading,
    }))
  );
  const openGenericDialog = useGenericDialogStore((s) => s.openGenericDialog);

  const requestSignAgreementMutation = useRequestSignAgreementMutation();
  const verifySignAgreementMutation = useVerifySignAgreementMutation();
  const buildAgreementTemplate = useBuildAgreementTemplateMutation();

  const patientQuery = usePatientDetailQuery(patientId, false);
  const mediaTemplateQuery = useMediaTemplateQuery("Agreement", false);

  useEffect(() => {
    let isCancelled = false;

    async function loadTemplate() {
      if (!patientId || !agreement || !treatment) {
        setTemplatePayload(null);
        buildAgreementTemplate.reset();
        return;
      }

      setIsPreparingTemplate(true);
      setTemplatePayload(null);
      buildAgreementTemplate.reset();

      try {
        const [patientResult, templateResult] = await Promise.all([
          patientQuery.refetch(),
          mediaTemplateQuery.refetch(),
        ]);

        if (isCancelled) return;

        const patientData = patientResult.data?.data;
        const templateString = templateResult.data;

        if (patientData && templateString) {
          setTemplatePayload({
            template: templateString,
            variables: createAgreementTemplateVariables({
              patient: patientData,
              treatment,
              agreement,
            }),
          });
        }
      } catch (error) {
        if (!isCancelled) {
          console.error(error);
        }
      } finally {
        if (!isCancelled) {
          setIsPreparingTemplate(false);
        }
      }
    }

    loadTemplate();

    return () => {
      isCancelled = true;
    };
  }, [agreement, treatment, patientId, retryKey]);

  useEffect(() => {
    if (patientQuery.isError) console.log(patientQuery.error);
  }, [patientQuery.isError, patientQuery.error]);

  const handleRetryTemplateLoad = () => {
    setRetryKey((key) => key + 1);
  };

  function handleEditFormConfirm(updatedPayload: AgreementTemplatePayload) {
    setTemplatePayload(updatedPayload);
  }

  useEffect(() => {
    if (!templatePayload) return;

    buildAgreementTemplate.mutate(templatePayload);
  }, [buildAgreementTemplate, templatePayload]);

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
      const html = buildAgreementTemplate.data;

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
        [
          html.replace(
            /(<head[^>]*>)/i,
            `$1<meta charset="utf-8" />`
          ),
        ],
        `agreement-${agreement?.agreementCode}.html`,
        { type: "text/html" }
      );

      verifySignAgreementMutation.mutate(
        {
          id: props.agreement?.id || "",
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
                  setOtpIsOpen(false);
                  props.setIsOpen(false);
                  props.onAgreementSigned?.();
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

  const patientError = patientQuery.error;
  const mediaError = mediaTemplateQuery.error;
  const templateBuildError = buildAgreementTemplate.error;

  const hasErrorScreen =
    patientQuery.isError ||
    mediaTemplateQuery.isError ||
    buildAgreementTemplate.isError;

  const isFetchingData =
    isPreparingTemplate ||
    patientQuery.isFetching ||
    patientQuery.isLoading ||
    mediaTemplateQuery.isFetching ||
    mediaTemplateQuery.isLoading ||
    !templatePayload ||
    buildAgreementTemplate.isPending;

  return (
    <>
      <IonModal
        isOpen={props.isOpen}
        onDidDismiss={() => props.setIsOpen(false)}
      >
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton onClick={() => props.setIsOpen(false)}>
                <IonIcon icon={close} slot="icon-only" />
              </IonButton>
            </IonButtons>
            <IonTitle className="ms-4">Agreement</IonTitle>

            {!isViewable && (
              <IonButtons slot="end">
                <IonButton onClick={() => setIsEditFormOpen(true)}>
                  Edit
                  <IonIcon icon={createOutline} slot="end" />
                </IonButton>
              </IonButtons>
            )}
          </IonToolbar>
        </IonHeader>
        <IonContent>
          {hasErrorScreen ? (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 px-4 py-10">
              <IonIcon
                icon={alertCircleOutline}
                className="text-3xl text-red-600"
              />
              <p className="text-center text-lg font-semibold">
                Unable to load agreement resources
              </p>
              {patientError && (
                <p className="text-center text-sm text-red-600">
                  Patient error: {patientError.message}
                </p>
              )}
              {mediaError && (
                <p className="text-center text-sm text-red-600">
                  Media error: {mediaError.message}
                </p>
              )}
              {templateBuildError && (
                <p className="text-center text-sm text-red-600">
                  Template build error: {templateBuildError.message}
                </p>
              )}
              <IonButton
                size="small"
                onClick={handleRetryTemplateLoad}
                disabled={isPreparingTemplate}
              >
                Retry loading
              </IonButton>
            </div>
          ) : isFetchingData ? (
            <div className="w-full flex justify-center items-center py-10">
              <IonSpinner name="crescent" />
            </div>
          ) : (
            <div className="w-full h-full min-h-[70vh] px-1 py-4">
              {buildAgreementTemplate.data ? (
                <iframe
                  title="agreement-template-preview"
                  srcDoc={buildAgreementTemplate.data}
                  className="w-full h-full border-0"
                />
              ) : (
                <div className="flex flex-col items-center justify-center gap-1 py-10">
                  <p className="text-center text-base">
                    Agreement template ready
                  </p>
                  <p className="text-center text-sm text-slate-500">
                    Preparing preview...
                  </p>
                </div>
              )}
            </div>
          )}
        </IonContent>

        {!isViewable && (
          <IonFooter>
            <IonToolbar className="ion-px-[0.5rem]">
              <IonCheckbox
                ref={agreeRef}
                labelPlacement="end"
                disabled={isFetchingData}
                onIonChange={() =>
                  setIsAgree(agreeRef.current?.checked || false)
                }
                className="mb-2"
              >
                I certify my information and accept the agreement.
              </IonCheckbox>
              <IonButton
                onClick={handleAgree}
                fill="solid"
                className="w-full"
                disabled={isFetchingData || !isAgree}
              >
                Continue
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

      <AgreementFormEdit
        isOpen={isEditFormOpen}
        setIsOpen={setIsEditFormOpen}
        templatePayload={templatePayload}
        onConfirm={handleEditFormConfirm}
      />
    </>
  );
}

function createAgreementTemplateVariables({
  patient,
  treatment,
  agreement,
}: {
  patient: PatientResponse;
  treatment: TreatmentDetail;
  agreement: AgreementResponse;
}): AgreementTemplatePayload["variables"] {
  return {
    patient: {
      name: `${patient.accountInfo.lastName}${patient.accountInfo.firstName}`,
      dob: patient.accountInfo.birthDate ?? "",
      nationalId: patient.nationalId ?? "",
      address: patient.accountInfo.address ?? "",
      phone: patient.accountInfo.phone,
    },
    serviceType: treatment.treatmentType as "IUI" | "IVF",
    date: format(new Date(), "DD / MM / YYYY"),
    signatures: {
      patient: true,
      facility: agreement.signedByDoctor,
    },
  };
}
