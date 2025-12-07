import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonInput,
  IonModal,
  IonPage,
  IonSpinner,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import { useEffect, useState } from "react";
import {
  usePatientDetailQuery,
  useUpdateFullAccountInfoMutation,
} from "@src/hooks/account-hook";
import { useLocalUserStore } from "@src/stores/user";
import { useGenericDialogStore } from "@src/stores/dialog";
import { cn } from "@src/utils/cn";
import { MapPin, ShieldCheck, Stethoscope, Phone } from "lucide-react";

type AccountEditableFields = {
  phone: string;
  emergencyContact: string;
  emergencyPhone: string;
  firstName: string;
  lastName: string;
  country: string;
  location: string;
  nationalId: string;
  insurance: string;
  occupation: string;
  medicalHistory: string;
  allergies: string;
  bloodType: string;
  height: string;
  weight: string;
};

export default function UpdateAccount() {
  const router = useIonRouter();
  const localUser = useLocalUserStore((s) => s.localUser);
  const setLocalUser = useLocalUserStore((s) => s.setLocalUser);
  const openGenericDialog = useGenericDialogStore((s) => s.openGenericDialog);
  const [hasPrefilled, setHasPrefilled] = useState(false);
  const updateAccountMutation = useUpdateFullAccountInfoMutation();
  const [isEditing, setIsEditing] = useState(false);
  const patientQuery = usePatientDetailQuery(localUser?.id ?? "", !isEditing);
  const [formValues, setFormValues] = useState<AccountEditableFields>({
    phone: "",
    emergencyContact: "",
    emergencyPhone: "",
    firstName: "",
    lastName: "",
    country: "",
    location: "",
    nationalId: "",
    insurance: "",
    occupation: "",
    medicalHistory: "",
    allergies: "",
    bloodType: "",
    height: "",
    weight: "",
  });
  const [initialValues, setInitialValues] =
    useState<AccountEditableFields>(formValues);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    if (!patientQuery.isSuccess || hasPrefilled || !patientQuery.data?.data) {
      return;
    }

    const patient = patientQuery.data.data;
    const stripPlus = (value: string | null) =>
      value && value.startsWith("+") ? value.slice(1) : value ?? "";
    const nextValues: AccountEditableFields = {
      phone: stripPlus(patient.accountInfo.phone),
      emergencyContact: patient.emergencyContact ?? "",
      emergencyPhone: stripPlus(patient.emergencyPhone),
      firstName: patient.accountInfo.firstName ?? "",
      lastName: patient.accountInfo.lastName ?? "",
      country: patient.accountInfo.address ?? "",
      location: patient.accountInfo.address ?? "",
      nationalId: patient.nationalId ?? "",
      insurance: patient.insurance ?? "",
      occupation: patient.occupation ?? "",
      medicalHistory: patient.medicalHistory ?? "",
      allergies: patient.allergies ?? "",
      bloodType: patient.bloodType ?? "",
      height: patient.height ? String(patient.height) : "",
      weight: patient.weight ? String(patient.weight) : "",
    };

    setFormValues(nextValues);
    setInitialValues(nextValues);
    setHasPrefilled(true);
  }, [hasPrefilled, patientQuery.data?.data, patientQuery.isSuccess]);

  const isSaving = updateAccountMutation.isPending;
  const showOverlay = patientQuery.isLoading || updateAccountMutation.isPending;

  function handleChange(
    key: keyof AccountEditableFields,
    value: string | null | undefined
  ) {
    setFormValues((prev) => ({
      ...prev,
      [key]: value ?? "",
    }));
  }

  async function handleConfirmSave() {
    const patientId = patientQuery.data?.data.id ?? localUser?.id ?? "";
    if (!patientId) return;

    const payload = {
      patientId,
      firstName: formValues.firstName.trim(),
      lastName: formValues.lastName.trim(),
      location: formValues.location.trim(),
      country: formValues.country.trim(),
      nationalId: formValues.nationalId.trim(),
      emergencyContact: formValues.emergencyContact.trim(),
      insurance: formValues.insurance.trim(),
      occupation: formValues.occupation.trim(),
      medicalHistory: formValues.medicalHistory.trim(),
      allergies: formValues.allergies.trim(),
      bloodType: formValues.bloodType.trim(),
      height:
        formValues.height.trim() === ""
          ? undefined
          : Number.parseFloat(formValues.height),
      weight:
        formValues.weight.trim() === ""
          ? undefined
          : Number.parseFloat(formValues.weight),
      ...(formValues.phone.trim()
        ? { phone: "+" + formValues.phone.trim() }
        : {}),
      ...(formValues.emergencyPhone.trim()
        ? { emergencyPhone: "+" + formValues.emergencyPhone.trim() }
        : {}),
    };

    setIsConfirmOpen(false);

    updateAccountMutation.mutate(payload, {
      onError: (error) => {
        openGenericDialog({
          title: error.name,
          content: error.message,
          svgIconColor: "danger",
        });
      },
      onSuccess: (data) => {
        openGenericDialog({
          title: "Update successful",
          content: "Your account information has been updated.",
          svgIconColor: "success",
          buttons: {
            text: "OK",
            color: "primary",
            closeFn: () => {
              const account = data.data.accountInfo;
              setLocalUser({
                id: account.id,
                userName: account.username,
                firstName: account.firstName,
                lastName: account.lastName,
                email: account.email,
                roleId: account.roleId,
                roleName: localUser?.roleName ?? "",
                gender: account.gender,
              });
              setInitialValues(formValues);
              setIsEditing(false);
              router.goBack();
            },
          },
        });
      },
    });
  }

  function handleCancelEdit() {
    setFormValues(initialValues);
    setIsEditing(false);
  }

  function handleStartEdit() {
    setIsEditing(true);
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>Update Information</IonTitle>
          {!isEditing ? (
            <IonButtons slot="end">
              <IonButton
                color="primary"
                onClick={handleStartEdit}
                disabled={patientQuery.isLoading}
              >
                Edit
              </IonButton>
            </IonButtons>
          ) : (
            <>
              <IonButtons slot="secondary">
                <IonButton
                  color="medium"
                  onClick={handleCancelEdit}
                  disabled={isSaving || patientQuery.isLoading}
                >
                  Cancel
                </IonButton>
              </IonButtons>
              <IonButtons slot="primary">
                <IonButton
                  color="primary"
                  onClick={() => setIsConfirmOpen(true)}
                  disabled={isSaving || patientQuery.isLoading}
                >
                  Save
                </IonButton>
              </IonButtons>
            </>
          )}
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-bg-neutral-100">
        <div className="relative min-h-0">
          {showOverlay && (
            <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/50">
              <IonSpinner name="circular" className="text-blue-500 size-10" />
            </div>
          )}

          <div className="flex flex-col gap-5 bg-slate-200 p-6 min-h-full">
            <div className="flex flex-col gap-3">
              <div className="flex items-baseline gap-2 text-slate-700">
                <Phone className="size-5" />
                <p className="text-lg font-semibold">Contact & Identity</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <IonInput
                  mode="md"
                  fill="outline"
                  label="First Name"
                  labelPlacement="stacked"
                  value={formValues.firstName}
                  onIonInput={(e) => handleChange("firstName", e.detail.value)}
                  className={cn("ion-bg-white! ion-b-r-[7px]!")}
                  clearInput={true}
                  disabled={!isEditing || patientQuery.isLoading}
                />
                <IonInput
                  mode="md"
                  fill="outline"
                  label="Last Name"
                  labelPlacement="stacked"
                  value={formValues.lastName}
                  onIonInput={(e) => handleChange("lastName", e.detail.value)}
                  className={cn("ion-bg-white! ion-b-r-[7px]!")}
                  clearInput={true}
                  disabled={!isEditing || patientQuery.isLoading}
                />
              </div>
              <IonInput
                mode="md"
                type="tel"
                fill="outline"
                label="Phone"
                labelPlacement="stacked"
                value={formValues.phone}
                onIonInput={(e) => handleChange("phone", e.detail.value)}
                className={cn("ion-bg-white! ion-b-r-[7px]!")}
                clearInput={true}
                disabled={!isEditing || patientQuery.isLoading}
              >
                <p slot="start">+</p>
              </IonInput>
              <IonInput
                mode="md"
                fill="outline"
                label="Emergency Contact"
                labelPlacement="stacked"
                value={formValues.emergencyContact}
                onIonInput={(e) =>
                  handleChange("emergencyContact", e.detail.value)
                }
                className={cn("ion-bg-white! ion-b-r-[7px]!")}
                clearInput={true}
                disabled={!isEditing || patientQuery.isLoading}
              />
              <IonInput
                mode="md"
                type="tel"
                fill="outline"
                label="Emergency Phone"
                labelPlacement="stacked"
                value={formValues.emergencyPhone}
                onIonInput={(e) =>
                  handleChange("emergencyPhone", e.detail.value)
                }
                className={cn("ion-bg-white! ion-b-r-[7px]!")}
                clearInput={true}
                disabled={!isEditing || patientQuery.isLoading}
              >
                <p slot="start">+</p>
              </IonInput>
              <IonInput
                mode="md"
                fill="outline"
                label="National ID"
                labelPlacement="stacked"
                value={formValues.nationalId}
                onIonInput={(e) => handleChange("nationalId", e.detail.value)}
                className={cn("ion-bg-white! ion-b-r-[7px]!")}
                clearInput={true}
                disabled={!isEditing || patientQuery.isLoading}
              />
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-baseline gap-2 text-slate-700">
                <MapPin className="size-5" />
                <p className="text-lg font-semibold">Address</p>
              </div>
              <IonInput
                mode="md"
                fill="outline"
                label="Country"
                labelPlacement="stacked"
                value={formValues.country}
                onIonInput={(e) => handleChange("country", e.detail.value)}
                className={cn("ion-bg-white! ion-b-r-[7px]!")}
                clearInput={true}
                disabled={!isEditing || patientQuery.isLoading}
              />
              <IonInput
                mode="md"
                fill="outline"
                label="Location"
                labelPlacement="stacked"
                value={formValues.location}
                onIonInput={(e) => handleChange("location", e.detail.value)}
                className={cn("ion-bg-white! ion-b-r-[7px]!")}
                clearInput={true}
                disabled={!isEditing || patientQuery.isLoading}
              />
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-baseline gap-2 text-slate-700">
                <ShieldCheck className="size-5" />
                <p className="text-lg font-semibold">Coverage & Work</p>
              </div>
              <IonInput
                mode="md"
                fill="outline"
                label="Insurance"
                labelPlacement="stacked"
                value={formValues.insurance}
                onIonInput={(e) => handleChange("insurance", e.detail.value)}
                className={cn("ion-bg-white! ion-b-r-[7px]!")}
                clearInput={true}
                disabled={!isEditing || patientQuery.isLoading}
              />
              <IonInput
                mode="md"
                fill="outline"
                label="Occupation"
                labelPlacement="stacked"
                value={formValues.occupation}
                onIonInput={(e) => handleChange("occupation", e.detail.value)}
                className={cn("ion-bg-white! ion-b-r-[7px]!")}
                clearInput={true}
                disabled={!isEditing || patientQuery.isLoading}
              />
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-baseline gap-2 text-slate-700">
                <Stethoscope className="size-5" />
                <p className="text-lg font-semibold">Medical Details</p>
              </div>
              <IonInput
                mode="md"
                fill="outline"
                label="Medical History"
                labelPlacement="stacked"
                value={formValues.medicalHistory}
                onIonInput={(e) =>
                  handleChange("medicalHistory", e.detail.value)
                }
                className={cn("ion-bg-white! ion-b-r-[7px]!")}
                clearInput={true}
                disabled={!isEditing || patientQuery.isLoading}
              />
              <IonInput
                mode="md"
                fill="outline"
                label="Allergies"
                labelPlacement="stacked"
                value={formValues.allergies}
                onIonInput={(e) => handleChange("allergies", e.detail.value)}
                className={cn("ion-bg-white! ion-b-r-[7px]!")}
                clearInput={true}
                disabled={!isEditing || patientQuery.isLoading}
              />
              <IonInput
                mode="md"
                fill="outline"
                label="Blood Type"
                labelPlacement="stacked"
                value={formValues.bloodType}
                onIonInput={(e) => handleChange("bloodType", e.detail.value)}
                className={cn("ion-bg-white! ion-b-r-[7px]!")}
                clearInput={true}
                disabled={!isEditing || patientQuery.isLoading}
              />
              <div className="grid grid-cols-2 gap-3">
                <IonInput
                  mode="md"
                  type="number"
                  fill="outline"
                  label="Height"
                  labelPlacement="stacked"
                  value={formValues.height}
                  onIonInput={(e) => handleChange("height", e.detail.value)}
                  className={cn("ion-bg-white! ion-b-r-[7px]!")}
                  disabled={!isEditing || patientQuery.isLoading}
                >
                  <p slot="end">cm</p>
                </IonInput>
                <IonInput
                  mode="md"
                  type="number"
                  fill="outline"
                  label="Weight"
                  labelPlacement="stacked"
                  value={formValues.weight}
                  onIonInput={(e) => handleChange("weight", e.detail.value)}
                  className={cn("ion-bg-white! ion-b-r-[7px]!")}
                  disabled={!isEditing || patientQuery.isLoading}
                >
                  <p slot="end">kg</p>
                </IonInput>
              </div>
            </div>
          </div>
        </div>
      </IonContent>

      <IonModal
        isOpen={isConfirmOpen}
        onDidDismiss={() => setIsConfirmOpen(false)}
        backdropDismiss={!isSaving}
        className="ion-w-fit ion-h-fit ion-b-r-[10px]! ion-box-shadow!"
      >
        <div className="size-full p-4 w-[80vw] max-w-md auto-rows-min grid justify-items-center items-center gap-4">
          <h2 className="my-0! font-semibold! h-fit w-full text-center">
            Confirm update?
          </h2>
          <p className="text-sm text-center">
            You are about to update your account information.
          </p>
          <div className="flex gap-2 w-full">
            <IonButton
              fill="solid"
              color="medium"
              className="flex-1"
              onClick={() => setIsConfirmOpen(false)}
              disabled={isSaving}
            >
              Cancel
            </IonButton>
            <IonButton
              fill="solid"
              color="primary"
              className="flex-1"
              onClick={handleConfirmSave}
              disabled={isSaving}
            >
              {isSaving ? <IonSpinner name="circular" /> : "Confirm"}
            </IonButton>
          </div>
        </div>
      </IonModal>
    </IonPage>
  );
}
