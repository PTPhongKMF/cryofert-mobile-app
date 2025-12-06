import { format } from "@formkit/tempo";
import {
  IonButton,
  IonButtons,
  IonCheckbox,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonModal,
  IonSpinner,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useRequestSignAgreementMutation } from "@src/hooks/agreement-hook";
import { usePatientDetailQuery } from "@src/hooks/account-hook";
import {
  useBuildAgreementTemplateQuery,
  type AgreementTemplatePayload,
} from "@src/hooks/media-template-hook";
import {
  useMediaTemplateQuery,
  useViewMediaQuery,
} from "@src/hooks/media-hook";
import type { AgreementResponse } from "@src/schemas/agreement";
import type { PatientResponse } from "@src/schemas/account";
import type { TreatmentDetail } from "@src/schemas/treatment";
import { useAppLoadingStore } from "@src/stores/app-loading";
import { useGenericDialogStore } from "@src/stores/dialog";
import {
  alertCircleOutline,
  chevronBack,
  close,
  createOutline,
} from "ionicons/icons";
import AgreementFormEdit, {
  getAgreementFormDefaults,
  mapTemplateToFormValues,
} from "./AgreementFormEdit";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { useShallow } from "zustand/react/shallow";
import AgreementConfirmOtp from "./AgreementConfirmOtp";
import { valibotResolver } from "@hookform/resolvers/valibot";
import type { AgreementFormData } from "@src/schemas/media-template";
import { AgreementFormSchema } from "@src/schemas/media-template";
import { useForm } from "react-hook-form";

interface AgreementDialogProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  agreement: AgreementResponse | null;
  treatment: TreatmentDetail | null;
  onAgreementSigned?: () => void;
}

const LOADER_KEY = "agreement-sign";

export default function AgreementDialog(props: AgreementDialogProps) {
  const [isAgree, setIsAgree] = useState(false);
  const agreeRef = useRef<HTMLIonCheckboxElement>(null);
  const [templatePayload, setTemplatePayload] =
    useState<AgreementTemplatePayload | null>(null);
  const [fetchInitialData, setFetchInitialData] = useState(true);
  const [otpIsOpen, setOtpIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const form = useForm<AgreementFormData>({
    resolver: valibotResolver(AgreementFormSchema),
    defaultValues: getAgreementFormDefaults(),
  });

  const { control, handleSubmit, reset, setValue, watch, clearErrors } = form;

  useEffect(() => {
    reset(mapTemplateToFormValues(templatePayload));
  }, [reset, templatePayload]);

  const handleEditSubmit = handleSubmit((values) => {
    if (!templatePayload) return;

    const updatedPayload: AgreementTemplatePayload = {
      ...templatePayload,
      variables: {
        ...templatePayload.variables,
        patient: {
          ...values.patient,
        },
        spouse: values.spouse
          ? {
              ...values.spouse,
            }
          : undefined,
      },
    };

    setTemplatePayload(updatedPayload);
    setIsEditMode(false);
  });

  const handleEditCancel = useCallback(() => {
    reset(mapTemplateToFormValues(templatePayload));
    setIsEditMode(false);
  }, [reset, templatePayload]);

  const agreement = props.agreement;
  const treatment = props.treatment;
  const patientId = agreement?.patientId ?? "";

  const isViewMode =
    agreement?.status === "Canceled" || agreement?.status === "Completed";

  const viewAgreementMediaQuery = useViewMediaQuery(
    { relatedEntityId: agreement?.id, relatedEntityType: "Agreement" },
    Boolean(agreement?.id) && fetchInitialData && isViewMode
  );

  const { startLoading, stopLoading } = useAppLoadingStore(
    useShallow((s) => ({
      startLoading: s.startLoading,
      stopLoading: s.stopLoading,
    }))
  );
  const openGenericDialog = useGenericDialogStore((s) => s.openGenericDialog);

  const requestSignAgreementMutation = useRequestSignAgreementMutation();

  const patientQuery = usePatientDetailQuery(
    patientId,
    Boolean(patientId) && fetchInitialData && !isViewMode
  );
  const mediaTemplateQuery = useMediaTemplateQuery(
    "Agreement",
    fetchInitialData && !isViewMode
  );

  const buildTemplateQuery = useBuildAgreementTemplateQuery(
    isEditMode ? null : templatePayload
  );

  useEffect(() => {
    if (!fetchInitialData) return;

    if (isViewMode) {
      if (!viewAgreementMediaQuery.isFetching) setFetchInitialData(false);
    } else {
      if (!patientQuery.isFetching && !mediaTemplateQuery.isFetching)
        setFetchInitialData(false);
    }
  }, [
    fetchInitialData,
    isViewMode,
    mediaTemplateQuery.isFetching,
    patientQuery.isFetching,
    viewAgreementMediaQuery.isFetching,
  ]);

  useEffect(() => {
    if (isViewMode) return;

    if (!patientId || !agreement || !treatment) return;

    if (!patientQuery.isSuccess || !mediaTemplateQuery.isSuccess) return;

    const patientData = patientQuery.data?.data;
    const templateString = mediaTemplateQuery.data;

    if (!patientData || !templateString) return;

    setTemplatePayload({
      template: templateString,
      variables: createAgreementTemplateVariables({
        patient: patientData,
        treatment,
        agreement,
      }),
    });
  }, [
    isViewMode,
    patientId,
    agreement,
    treatment,
    patientQuery.data,
    patientQuery.isSuccess,
    mediaTemplateQuery.data,
    mediaTemplateQuery.isSuccess,
  ]);

  useEffect(() => {
    if (patientQuery.isError) console.log(patientQuery.error);
    if (mediaTemplateQuery.isError) console.log(mediaTemplateQuery.error);
    if (isViewMode && viewAgreementMediaQuery.isError)
      console.log(viewAgreementMediaQuery.error);
  }, [
    patientQuery.error,
    patientQuery.isError,
    mediaTemplateQuery.error,
    mediaTemplateQuery.isError,
    isViewMode,
    viewAgreementMediaQuery.error,
    viewAgreementMediaQuery.isError,
  ]);

  useEffect(() => {
    if (!props.isOpen && isEditMode) {
      handleEditCancel();
    }
  }, [isEditMode, props.isOpen, handleEditCancel]);

  useEffect(() => {
    if (requestSignAgreementMutation.isPending) {
      startLoading(LOADER_KEY);
    } else {
      stopLoading(LOADER_KEY);
    }
  }, [startLoading, stopLoading, requestSignAgreementMutation.isPending]);

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

  function handleRetryOnError() {
    setTemplatePayload(null);
    setFetchInitialData(true);
  }

  const hasErrorScreen =
    patientQuery.isError ||
    mediaTemplateQuery.isError ||
    buildTemplateQuery.isError ||
    (isViewMode && viewAgreementMediaQuery.isError);

  const isFetchingData = isViewMode
    ? viewAgreementMediaQuery.isFetching ||
      !viewAgreementMediaQuery.data?.objectUrl
    : patientQuery.isFetching ||
      mediaTemplateQuery.isFetching ||
      !templatePayload ||
      buildTemplateQuery.isFetching;

  const previewSource = isViewMode
    ? viewAgreementMediaQuery.data?.objectUrl
    : buildTemplateQuery.data?.objectUrl;

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
                <IonIcon icon={chevronBack} slot="icon-only" />
              </IonButton>
            </IonButtons>
            <IonTitle className="ms-4">Agreement</IonTitle>

            {!isViewMode &&
              (!isEditMode ? (
                <IonButtons slot="primary">
                  <IonButton
                    disabled={isFetchingData}
                    onClick={() => setIsEditMode(true)}
                  >
                    Edit
                    <IonIcon icon={createOutline} slot="end" />
                  </IonButton>
                </IonButtons>
              ) : (
                <>
                  <IonButtons slot="secondary">
                    <IonButton
                      fill="clear"
                      size="small"
                      onClick={handleEditCancel}
                    >
                      Cancel
                    </IonButton>
                  </IonButtons>

                  <IonButtons slot="primary">
                    <IonButton
                      onClick={handleEditSubmit}
                      disabled={!templatePayload}
                    >
                      Confirm
                    </IonButton>
                  </IonButtons>
                </>
              ))}
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
              {patientQuery.isError && (
                <p className="text-center text-sm text-red-600">
                  Patient error: {patientQuery.error.message}
                </p>
              )}
              {mediaTemplateQuery.isError && (
                <p className="text-center text-sm text-red-600">
                  Media error: {mediaTemplateQuery.error.message}
                </p>
              )}
              {buildTemplateQuery.isError && (
                <p className="text-center text-sm text-red-600">
                  Template build error: {buildTemplateQuery.error?.message}
                </p>
              )}
              {isViewMode && viewAgreementMediaQuery.isError && (
                <p className="text-center text-sm text-red-600">
                  View media error: {viewAgreementMediaQuery.error?.message}
                </p>
              )}
              <IonButton
                size="small"
                onClick={handleRetryOnError}
                disabled={fetchInitialData}
              >
                Retry loading
              </IonButton>
            </div>
          ) : isEditMode ? (
            <div className="size-full">
              <AgreementFormEdit
                control={control}
                setValue={setValue}
                watch={watch}
                clearErrors={clearErrors}
              />
            </div>
          ) : isFetchingData ? (
            <div className="w-full flex justify-center items-center py-10">
              <IonSpinner name="crescent" />
            </div>
          ) : (
            <div className="w-full h-full min-h-[70vh] px-1 py-4">
              {previewSource ? (
                <iframe
                  title="agreement-template-preview"
                  src={previewSource}
                  className="w-full h-full border-0"
                />
              ) : (
                <div className="flex flex-col items-center justify-center gap-1 py-10">
                  <p className="text-center text-base">Agreement ready</p>
                  <p className="text-center text-sm text-slate-500">
                    Preparing preview...
                  </p>
                </div>
              )}
            </div>
          )}
        </IonContent>

        {!isViewMode && !isEditMode && (
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

      <AgreementConfirmOtp
        isOpen={otpIsOpen}
        setIsOpen={setOtpIsOpen}
        agreementId={agreement?.id ?? ""}
        agreementCode={agreement?.agreementCode}
        templateHtml={buildTemplateQuery.data?.value}
        onAgreementSigned={() => {
          props.setIsOpen(false);
          props.onAgreementSigned?.();
        }}
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
