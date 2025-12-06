import {
  IonButton,
  IonContent,
  IonDatetime,
  IonDatetimeButton,
  IonIcon,
  IonInput,
  IonModal,
  IonNote,
} from "@ionic/react";
import type {
  Control,
  UseFormClearErrors,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { Controller } from "react-hook-form";
import type { AgreementFormData } from "@src/schemas/media-template";
import { cn } from "@src/utils/cn";
import type { AgreementTemplatePayload } from "@src/hooks/media-template-hook";
import {
  calendarOutline,
  cardOutline,
  callOutline,
  homeOutline,
  peopleOutline,
  personOutline,
} from "ionicons/icons";
import { useMemo, useRef } from "react";
import { getDateOnly } from "@src/utils/date";

interface AgreementFormEditProps {
  control: Control<AgreementFormData>;
  setValue: UseFormSetValue<AgreementFormData>;
  watch: UseFormWatch<AgreementFormData>;
  clearErrors: UseFormClearErrors<AgreementFormData>;
}

export default function AgreementFormEdit(props: AgreementFormEditProps) {
  const todayDateOnly = useMemo(
    () => getDateOnly(new Date().toISOString()),
    []
  );
  const patientDobModalRef = useRef<HTMLIonModalElement>(null);
  const spouseDobModalRef = useRef<HTMLIonModalElement>(null);

  const hasSpouse = Boolean(props.watch("spouse"));

  function toggleSpouse() {
    if (hasSpouse) {
      props.setValue("spouse", undefined);
      props.clearErrors("spouse");
      return;
    }

    props.setValue("spouse", {
      name: "",
      dob: todayDateOnly,
      nationalId: "",
    });
  }

  return (
    <IonContent className="size-full!">
      <div className="flex flex-col gap-4 bg-slate-200 p-6 min-h-full">
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
            <IonIcon icon={personOutline} className="text-blue-600" />
            Patient Information
          </h2>

          <Controller
            name="patient.name"
            control={props.control}
            render={({ field, fieldState }) => (
              <IonInput
                mode="md"
                fill="outline"
                placeholder="Full Name"
                value={field.value ?? ""}
                clearInput={true}
                onIonInput={(e) =>
                  field.onChange((e.detail.value as string) ?? "")
                }
                onIonBlur={field.onBlur}
                ref={field.ref}
                className={cn(
                  "ion-bg-white! ion-b-r-[7px]! ",
                  fieldState.error && "ion-invalid ion-touched"
                )}
                errorText={fieldState.error?.message}
              >
                <IonIcon
                  icon={personOutline}
                  slot="start"
                  className="text-slate-500 me-2"
                />
              </IonInput>
            )}
          />

          <Controller
            name="patient.dob"
            control={props.control}
            render={({ field, fieldState }) => (
              <div className="w-full h-fit flex flex-col justify-center items-start gap-1">
                <div
                  onClick={() => patientDobModalRef.current?.present()}
                  className={cn(
                    "flex justify-between items-center w-full bg-white border-1 rounded-[7px] h-14 py-[0.45rem] px-2 ps-4",
                    fieldState.error && "border-red-400"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <IonIcon
                      icon={calendarOutline}
                      className="text-slate-500"
                    />
                    <label>Date of Birth</label>
                  </div>

                  <IonDatetimeButton
                    datetime="patient-dob"
                    className="self-center"
                  />
                </div>

                {fieldState.error && (
                  <IonNote className="ps-4 text-xs text-red-700!">
                    {fieldState.error.message}
                  </IonNote>
                )}

                <IonModal
                  keepContentsMounted
                  initialBreakpoint={1}
                  breakpoints={[0, 1]}
                  ref={patientDobModalRef}
                  className="ion-w-[100%]! ion-bg-gray-100"
                >
                  <IonDatetime
                    id="patient-dob"
                    presentation="date"
                    preferWheel
                    showAdjacentDays
                    value={field.value || todayDateOnly}
                    onIonChange={field.onChange}
                    onIonBlur={field.onBlur}
                    ref={field.ref}
                    max={todayDateOnly}
                    className="mx-auto h-full"
                  />
                </IonModal>
              </div>
            )}
          />

          <Controller
            name="patient.nationalId"
            control={props.control}
            render={({ field, fieldState }) => (
              <IonInput
                mode="md"
                fill="outline"
                placeholder="National ID"
                value={field.value ?? ""}
                clearInput={true}
                onIonInput={(e) =>
                  field.onChange((e.detail.value as string) ?? "")
                }
                onIonBlur={field.onBlur}
                ref={field.ref}
                className={cn(
                  "ion-bg-white! ion-b-r-[7px]! ",
                  fieldState.error && "ion-invalid ion-touched"
                )}
                errorText={fieldState.error?.message}
              >
                <IonIcon
                  icon={cardOutline}
                  slot="start"
                  className="text-slate-500 me-2"
                />
              </IonInput>
            )}
          />

          <Controller
            name="patient.address"
            control={props.control}
            render={({ field, fieldState }) => (
              <IonInput
                mode="md"
                fill="outline"
                placeholder="Address"
                value={field.value ?? ""}
                clearInput={true}
                onIonInput={(e) =>
                  field.onChange((e.detail.value as string) ?? "")
                }
                onIonBlur={field.onBlur}
                ref={field.ref}
                className={cn(
                  "ion-bg-white! ion-b-r-[7px]! ",
                  fieldState.error && "ion-invalid ion-touched"
                )}
                errorText={fieldState.error?.message}
              >
                <IonIcon
                  icon={homeOutline}
                  slot="start"
                  className="text-slate-500 me-2"
                />
              </IonInput>
            )}
          />

          <Controller
            name="patient.phone"
            control={props.control}
            render={({ field, fieldState }) => (
              <IonInput
                mode="md"
                fill="outline"
                placeholder="Phone"
                type="tel"
                value={field.value ?? ""}
                clearInput={true}
                onIonInput={(e) =>
                  field.onChange((e.detail.value as string) ?? "")
                }
                onIonBlur={field.onBlur}
                ref={field.ref}
                className={cn(
                  "ion-bg-white! ion-b-r-[7px]! ",
                  fieldState.error && "ion-invalid ion-touched"
                )}
                errorText={fieldState.error?.message}
              >
                <IonIcon
                  icon={callOutline}
                  slot="start"
                  className="text-slate-500 me-2"
                />
              </IonInput>
            )}
          />
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-baseline justify-between">
            <h2 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
              <IonIcon icon={peopleOutline} className="text-blue-600" />
              Spouse Information
            </h2>
            <IonButton
              fill="clear"
              size="small"
              color={hasSpouse ? "danger" : "primary"}
              onClick={toggleSpouse}
            >
              {hasSpouse ? "Remove" : "Add"}
            </IonButton>
          </div>

          <Controller
            name="spouse.name"
            control={props.control}
            render={({ field, fieldState }) => (
              <IonInput
                mode="md"
                fill="outline"
                placeholder="Full Name"
                disabled={!hasSpouse}
                value={field.value ?? ""}
                clearInput={true}
                onIonInput={(e) =>
                  field.onChange((e.detail.value as string) ?? "")
                }
                onIonBlur={field.onBlur}
                ref={field.ref}
                className={cn(
                  "ion-bg-white! ion-b-r-[7px]!",
                  fieldState.error && "ion-invalid ion-touched"
                )}
                errorText={fieldState.error?.message}
              >
                <IonIcon
                  icon={personOutline}
                  slot="start"
                  className="text-slate-500 me-2"
                />
              </IonInput>
            )}
          />

          <Controller
            name="spouse.dob"
            control={props.control}
            render={({ field, fieldState }) => (
              <div className="w-full h-fit flex flex-col justify-center items-start gap-1">
                <div
                  onClick={() =>
                    hasSpouse && spouseDobModalRef.current?.present()
                  }
                  className={cn(
                    "flex justify-between items-center w-full bg-white border-1 rounded-[7px]  h-14 py-[0.45rem] px-2 ps-4",
                    fieldState.error && "border-red-400",
                    !hasSpouse && "opacity-50 pointer-events-none"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <IonIcon
                      icon={calendarOutline}
                      className="text-slate-500"
                    />
                    <label className={cn(!hasSpouse && "opacity-50")}>
                      Date of Birth
                    </label>
                  </div>

                  <IonDatetimeButton
                    datetime="spouse-dob"
                    disabled={!hasSpouse}
                    className="self-center"
                  />
                </div>

                {fieldState.error && (
                  <IonNote className="ps-4 text-xs text-red-700!">
                    {fieldState.error.message}
                  </IonNote>
                )}

                <IonModal
                  keepContentsMounted
                  initialBreakpoint={1}
                  breakpoints={[0, 1]}
                  ref={spouseDobModalRef}
                  className="ion-w-[100%]! ion-bg-gray-100"
                >
                  <IonDatetime
                    id="spouse-dob"
                    presentation="date"
                    preferWheel
                    showAdjacentDays
                    value={field.value || todayDateOnly}
                    onIonChange={field.onChange}
                    onIonBlur={field.onBlur}
                    ref={field.ref}
                    max={todayDateOnly}
                    className="mx-auto h-full"
                  />
                </IonModal>
              </div>
            )}
          />

          <Controller
            name="spouse.nationalId"
            control={props.control}
            render={({ field, fieldState }) => (
              <IonInput
                mode="md"
                fill="outline"
                placeholder="National ID"
                disabled={!hasSpouse}
                value={field.value ?? ""}
                clearInput={true}
                onIonInput={(e) =>
                  field.onChange((e.detail.value as string) ?? "")
                }
                onIonBlur={field.onBlur}
                ref={field.ref}
                className={cn(
                  "ion-bg-white! ion-b-r-[7px]! ",
                  fieldState.error && "ion-invalid ion-touched"
                )}
                errorText={fieldState.error?.message}
              >
                <IonIcon
                  icon={cardOutline}
                  slot="start"
                  className="text-slate-500 me-2"
                />
              </IonInput>
            )}
          />
        </div>
      </div>
    </IonContent>
  );
}

function normalizeToDate(value: string | undefined, fallback: string) {
  return value ? getDateOnly(value) : fallback;
}

export function getAgreementFormDefaults(): AgreementFormData {
  const todayDateOnly = getDateOnly(new Date().toISOString());

  return {
    patient: {
      name: "",
      dob: todayDateOnly,
      nationalId: "",
      address: "",
      phone: "",
    },
    spouse: {
      name: "",
      dob: "",
      nationalId: "",
    },
  };
}

export function mapTemplateToFormValues(
  templatePayload: AgreementTemplatePayload | null
): AgreementFormData {
  const defaults = getAgreementFormDefaults();
  if (!templatePayload) return defaults;

  const { variables } = templatePayload;

  return {
    patient: {
      name: variables.patient.name,
      dob: normalizeToDate(variables.patient.dob, defaults.patient.dob),
      nationalId: variables.patient.nationalId ?? "",
      address: variables.patient.address ?? "",
      phone: variables.patient.phone ?? "",
    },
    spouse: {
      name: variables.spouse?.name ?? "",
      dob:
        variables.spouse?.dob && variables.spouse?.dob !== ""
          ? normalizeToDate(variables.spouse.dob, defaults.patient.dob)
          : "",
      nationalId: variables.spouse?.nationalId ?? "",
    },
  };
}
