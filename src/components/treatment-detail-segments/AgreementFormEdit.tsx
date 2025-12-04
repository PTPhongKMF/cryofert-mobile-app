import {
  IonButton,
  IonButtons,
  IonContent,
  IonDatetime,
  IonDatetimeButton,
  IonFooter,
  IonHeader,
  IonIcon,
  IonInput,
  IonModal,
  IonNote,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import type { AgreementTemplatePayload } from "@src/hooks/media-template-hook";
import { cn } from "@src/utils/cn";
import {
  close,
  personOutline,
  callOutline,
  homeOutline,
  cardOutline,
  calendarOutline,
  peopleOutline,
} from "ionicons/icons";
import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

interface AgreementFormEditProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  templatePayload: AgreementTemplatePayload | null;
  onConfirm: (updatedPayload: AgreementTemplatePayload) => void;
}

interface PatientFormData {
  name: string;
  dob: string;
  nationalId: string;
  address: string;
  phone: string;
}

interface SpouseFormData {
  name: string;
  dob: string;
  nationalId: string;
}

interface FormErrors {
  patient: Partial<Record<keyof PatientFormData, string>>;
  spouse: Partial<Record<keyof SpouseFormData, string>>;
}

const inputClassName =
  "ion-bg-white! ion-b-r-[7px]! min-h-[1px]! ion-py-[0.45rem]!";

export default function AgreementFormEdit(props: AgreementFormEditProps) {
  const [shouldConfirm, setShouldConfirm] = useState(false);

  const [patient, setPatient] = useState<PatientFormData>({
    name: "",
    dob: new Date().toISOString(),
    nationalId: "",
    address: "",
    phone: "",
  });

  const [spouse, setSpouse] = useState<SpouseFormData | null>(null);

  const [errors, setErrors] = useState<FormErrors>({
    patient: {},
    spouse: {},
  });

  const patientDobModalRef = useRef<HTMLIonModalElement>(null);
  const spouseDobModalRef = useRef<HTMLIonModalElement>(null);

  // Prefill state when modal opens or templatePayload changes
  useEffect(() => {
    if (props.isOpen && props.templatePayload) {
      const { variables } = props.templatePayload;

      setPatient({
        name: variables.patient.name,
        dob: variables.patient.dob || new Date().toISOString(),
        nationalId: variables.patient.nationalId,
        address: variables.patient.address,
        phone: variables.patient.phone,
      });

      if (variables.spouse) {
        setSpouse({
          name: variables.spouse.name,
          dob: variables.spouse.dob || new Date().toISOString(),
          nationalId: variables.spouse.nationalId,
        });
      } else {
        setSpouse(null);
      }

      setShouldConfirm(false);
      setErrors({ patient: {}, spouse: {} });
    }
  }, [props.isOpen, props.templatePayload]);

  function validateForm(): boolean {
    const newErrors: FormErrors = { patient: {}, spouse: {} };
    let isValid = true;

    // Validate patient fields
    if (!patient.name.trim()) {
      newErrors.patient.name = "Name is required";
      isValid = false;
    }
    if (!patient.dob) {
      newErrors.patient.dob = "Date of birth is required";
      isValid = false;
    }
    if (!patient.nationalId.trim()) {
      newErrors.patient.nationalId = "National ID is required";
      isValid = false;
    }
    if (!patient.address.trim()) {
      newErrors.patient.address = "Address is required";
      isValid = false;
    }
    if (!patient.phone.trim()) {
      newErrors.patient.phone = "Phone is required";
      isValid = false;
    }

    // Validate spouse fields if spouse exists
    if (spouse) {
      if (!spouse.name.trim()) {
        newErrors.spouse.name = "Spouse name is required";
        isValid = false;
      }
      if (!spouse.dob) {
        newErrors.spouse.dob = "Spouse date of birth is required";
        isValid = false;
      }
      if (!spouse.nationalId.trim()) {
        newErrors.spouse.nationalId = "Spouse national ID is required";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  }

  function handleConfirm() {
    if (validateForm()) {
      setShouldConfirm(true);
      props.setIsOpen(false);
    }
  }

  function handleClose() {
    setShouldConfirm(false);
    props.setIsOpen(false);
  }

  function handleWillDismiss() {
    if (shouldConfirm && props.templatePayload) {
      const updatedPayload: AgreementTemplatePayload = {
        ...props.templatePayload,
        variables: {
          ...props.templatePayload.variables,
          patient: { ...patient },
          spouse: spouse ? { ...spouse } : undefined,
        },
      };
      props.onConfirm(updatedPayload);
    }
    setShouldConfirm(false);
  }

  function updatePatient<K extends keyof PatientFormData>(
    field: K,
    value: PatientFormData[K]
  ) {
    setPatient((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors.patient[field]) {
      setErrors((prev) => ({
        ...prev,
        patient: { ...prev.patient, [field]: undefined },
      }));
    }
  }

  function updateSpouse<K extends keyof SpouseFormData>(
    field: K,
    value: SpouseFormData[K]
  ) {
    setSpouse((prev) => (prev ? { ...prev, [field]: value } : null));
    // Clear error when user starts typing
    if (errors.spouse[field]) {
      setErrors((prev) => ({
        ...prev,
        spouse: { ...prev.spouse, [field]: undefined },
      }));
    }
  }

  function addSpouse() {
    setSpouse({ name: "", dob: new Date().toISOString(), nationalId: "" });
  }

  function removeSpouse() {
    setSpouse(null);
    setErrors((prev) => ({ ...prev, spouse: {} }));
  }

  return (
    <IonModal
      isOpen={props.isOpen}
      onWillDismiss={handleWillDismiss}
      onDidDismiss={() => props.setIsOpen(false)}
    >
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={handleClose}>
              <IonIcon icon={close} slot="icon-only" />
            </IonButton>
          </IonButtons>
          <IonTitle className="ms-4">Edit Agreement Info</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div className="flex flex-col gap-4">
          {/* Patient Section */}
          <div className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
              <IonIcon icon={personOutline} className="text-blue-600" />
              Patient Information
            </h2>

            <IonInput
              mode="md"
              fill="outline"
              label="Full Name"
              labelPlacement="floating"
              value={patient.name}
              onIonInput={(e) =>
                updatePatient("name", (e.detail.value as string) ?? "")
              }
              className={cn(
                inputClassName,
                errors.patient.name && "ion-invalid ion-touched"
              )}
              errorText={errors.patient.name}
            >
              <IonIcon
                icon={personOutline}
                slot="start"
                className="text-slate-500 me-2"
              />
            </IonInput>

            {/* Patient Date of Birth */}
            <div className="w-full h-fit flex flex-col justify-center items-start gap-1">
              <div
                onClick={() => patientDobModalRef.current?.present()}
                className={cn(
                  "flex justify-between items-center w-full",
                  "bg-white border-1 rounded-[7px] h-12 py-[0.45rem] px-2",
                  errors.patient.dob && "border-red-400"
                )}
              >
                <div className="flex items-center gap-2">
                  <IonIcon icon={calendarOutline} className="text-slate-500" />
                  <label>Date of Birth</label>
                </div>

                <IonDatetimeButton
                  datetime="patient-dob"
                  className="self-center"
                />
              </div>

              {errors.patient.dob && (
                <IonNote className="ps-4 text-xs text-red-700!">
                  {errors.patient.dob}
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
                  value={patient.dob}
                  onIonChange={(e) => {
                    const value = e.detail.value;
                    if (typeof value === "string") {
                      updatePatient("dob", value);
                    }
                  }}
                  max={new Date().toISOString()}
                  className="mx-auto h-full"
                />
              </IonModal>
            </div>

            <IonInput
              mode="md"
              fill="outline"
              label="National ID"
              labelPlacement="floating"
              value={patient.nationalId}
              onIonInput={(e) =>
                updatePatient("nationalId", (e.detail.value as string) ?? "")
              }
              className={cn(
                inputClassName,
                errors.patient.nationalId && "ion-invalid ion-touched"
              )}
              errorText={errors.patient.nationalId}
            >
              <IonIcon
                icon={cardOutline}
                slot="start"
                className="text-slate-500 me-2"
              />
            </IonInput>

            <IonInput
              mode="md"
              fill="outline"
              label="Address"
              labelPlacement="floating"
              value={patient.address}
              onIonInput={(e) =>
                updatePatient("address", (e.detail.value as string) ?? "")
              }
              className={cn(
                inputClassName,
                errors.patient.address && "ion-invalid ion-touched"
              )}
              errorText={errors.patient.address}
            >
              <IonIcon
                icon={homeOutline}
                slot="start"
                className="text-slate-500 me-2"
              />
            </IonInput>

            <IonInput
              mode="md"
              fill="outline"
              label="Phone"
              labelPlacement="floating"
              type="tel"
              value={patient.phone}
              onIonInput={(e) =>
                updatePatient("phone", (e.detail.value as string) ?? "")
              }
              className={cn(
                inputClassName,
                errors.patient.phone && "ion-invalid ion-touched"
              )}
              errorText={errors.patient.phone}
            >
              <IonIcon
                icon={callOutline}
                slot="start"
                className="text-slate-500 me-2"
              />
            </IonInput>
          </div>

          {/* Spouse Section */}
          <div className="flex flex-col gap-3 mt-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                <IonIcon icon={peopleOutline} className="text-blue-600" />
                Spouse Information
              </h2>
              {spouse ? (
                <IonButton
                  fill="clear"
                  size="small"
                  color="danger"
                  onClick={removeSpouse}
                >
                  Remove
                </IonButton>
              ) : (
                <IonButton fill="clear" size="small" onClick={addSpouse}>
                  Add Spouse
                </IonButton>
              )}
            </div>

            {spouse && (
              <>
                <IonInput
                  mode="md"
                  fill="outline"
                  label="Full Name"
                  labelPlacement="floating"
                  value={spouse.name}
                  onIonInput={(e) =>
                    updateSpouse("name", (e.detail.value as string) ?? "")
                  }
                  className={cn(
                    inputClassName,
                    errors.spouse.name && "ion-invalid ion-touched"
                  )}
                  errorText={errors.spouse.name}
                >
                  <IonIcon
                    icon={personOutline}
                    slot="start"
                    className="text-slate-500 me-2"
                  />
                </IonInput>

                {/* Spouse Date of Birth */}
                <div className="w-full h-fit flex flex-col justify-center items-start gap-1">
                  <div
                    onClick={() => spouseDobModalRef.current?.present()}
                    className={cn(
                      "flex justify-between items-center w-full",
                      "bg-white border-1 rounded-[7px] h-12 py-[0.45rem] px-2",
                      errors.spouse.dob && "border-red-400"
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
                      datetime="spouse-dob"
                      className="self-center"
                    />
                  </div>

                  {errors.spouse.dob && (
                    <IonNote className="ps-4 text-xs text-red-700!">
                      {errors.spouse.dob}
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
                      value={spouse.dob}
                      onIonChange={(e) => {
                        const value = e.detail.value;
                        if (typeof value === "string") {
                          updateSpouse("dob", value);
                        }
                      }}
                      max={new Date().toISOString()}
                      className="mx-auto h-full"
                    />
                  </IonModal>
                </div>

                <IonInput
                  mode="md"
                  fill="outline"
                  label="National ID"
                  labelPlacement="floating"
                  value={spouse.nationalId}
                  onIonInput={(e) =>
                    updateSpouse("nationalId", (e.detail.value as string) ?? "")
                  }
                  className={cn(
                    inputClassName,
                    errors.spouse.nationalId && "ion-invalid ion-touched"
                  )}
                  errorText={errors.spouse.nationalId}
                >
                  <IonIcon
                    icon={cardOutline}
                    slot="start"
                    className="text-slate-500 me-2"
                  />
                </IonInput>
              </>
            )}

            {!spouse && (
              <p className="text-sm text-slate-400 italic ps-2">
                No spouse information added
              </p>
            )}
          </div>
        </div>
      </IonContent>

      <IonFooter>
        <IonToolbar className="ion-px-[0.5rem]">
          <div className="flex gap-2">
            <IonButton fill="outline" className="flex-1" onClick={handleClose}>
              Cancel
            </IonButton>
            <IonButton fill="solid" className="flex-1" onClick={handleConfirm}>
              Confirm
            </IonButton>
          </div>
        </IonToolbar>
      </IonFooter>
    </IonModal>
  );
}
