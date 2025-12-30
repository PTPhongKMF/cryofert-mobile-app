import { valibotResolver } from "@hookform/resolvers/valibot";
import {
  IonInput,
  IonRadio,
  IonRadioGroup,
  IonModal,
  IonDatetime,
  IonDatetimeButton,
  IonNote,
} from "@ionic/react";
import { cn } from "@utils/cn";
import { Controller, useForm } from "react-hook-form";
import { useLocalUserStore } from "@src/stores/user";
import { useGenericDialogStore } from "@src/stores/dialog";
import {
  RequestRelationshipFormSchema,
  type RequestRelationshipForm,
} from "@src/schemas/relationship";
import { VenusAndMars } from "lucide-react";
import { useRef } from "react";
import { format } from "@formkit/tempo";
import type { UseMutationResult } from "@tanstack/react-query";
import type { HTTPError } from "ky";
import type { RequestRelationship } from "@src/services/api-services/relationship-service";
import { checkmarkCircleOutline, alertCircleOutline } from "ionicons/icons";
import RosePng from "@assets/images/rose.png";

interface RequestRelationshipProps {
  requestMutation: UseMutationResult<
    void,
    HTTPError,
    RequestRelationship,
    unknown
  >;
  onRequestSuccess?: () => void;
}

export default function RequestRelationship({
  requestMutation,
  onRequestSuccess,
}: RequestRelationshipProps) {
  const localUser = useLocalUserStore((s) => s.localUser);
  const openGenericDialog = useGenericDialogStore((s) => s.openGenericDialog);
  const establishedDateModal = useRef<HTMLIonModalElement>(null);

  const requestForm = useForm<RequestRelationshipForm>({
    defaultValues: {
      patient2Id: "",
      relationshipType: "Married",
      establishedDate: new Date().toISOString(),
      isActive: true,
    },
    reValidateMode: "onSubmit",
    resolver: valibotResolver(RequestRelationshipFormSchema),
  });

  function handleRequest(data: RequestRelationshipForm) {
    if (!localUser?.id) {
      console.log("No user ID available");
      return;
    }
    if (requestMutation.isPending) return;
    requestMutation.mutate(
      {
        patient1Id: localUser.id,
        patient2Id: data.patient2Id,
        relationshipType: data.relationshipType,
        establishedDate: data.establishedDate,
        isActive: true,
      },
      {
        onSuccess: () => {
          openGenericDialog({
            svgIcon: checkmarkCircleOutline,
            svgIconColor: "success",
            title: "Request sent",
            content: "Your relationship request has been submitted.",
            backdropDismiss: true,
          });
          onRequestSuccess?.();
        },
        onError: (e) => {
          openGenericDialog({
            svgIcon: alertCircleOutline,
            svgIconColor: "danger",
            title: "Request failed",
            content: e?.message ?? "Unable to send relationship request.",
            backdropDismiss: true,
          });
        },
      }
    );
  }

  return (
    <div className="flex flex-col size-full">
      <div className="flex flex-col justify-start items-center gap-4 size-full pt-10 px-4 pb-4">
        <h2 className="font-semibold! text-blue-600">
          Connect with your other half
        </h2>

        <p className="text-center">
          connect with your partner to use our other services (IVF)
        </p>

        <img src={RosePng} className="size-20" />

        <form
          id="request-relationship-form"
          onSubmit={requestForm.handleSubmit(handleRequest)}
          className="w-full flex flex-col gap-8 mt-10!"
        >
          <Controller
            name="patient2Id"
            control={requestForm.control}
            render={(patient2Id) => (
              <IonInput
                placeholder="Your partner id"
                mode="md"
                fill="outline"
                errorText={patient2Id.fieldState.error?.message}
                clearInput={true}
                value={patient2Id.field.value}
                onIonInput={patient2Id.field.onChange}
                onIonBlur={patient2Id.field.onBlur}
                ref={patient2Id.field.ref}
                className={cn(
                  "ion-bg-white! ion-b-r-[7px]! min-h-px! ion-py-[0.45rem]!",
                  patient2Id.fieldState.error && "ion-invalid ion-touched"
                )}
              />
            )}
          />

          <Controller
            name="relationshipType"
            control={requestForm.control}
            render={(relationshipType) => (
              <IonRadioGroup
                errorText={relationshipType.fieldState.error?.message}
                value={relationshipType.field.value}
                onIonChange={relationshipType.field.onChange}
                ref={relationshipType.field.ref}
                className={cn(
                  "w-full px-2 py-1",
                  relationshipType.fieldState.error && "ion-invalid ion-touched"
                )}
              >
                <div className="flex flex-col w-full gap-4">
                  <p className="flex justify-start items-center gap-2 text-gray-700">
                    <VenusAndMars className="size-5" />
                    Relationship Type
                  </p>

                  <div className="flex justify-center items-center gap-10 px-4">
                    <IonRadio value="Married" className="text-sm">
                      Married
                    </IonRadio>
                    <IonRadio value="Unmarried" className="text-sm">
                      Unmarried
                    </IonRadio>
                  </div>
                </div>
              </IonRadioGroup>
            )}
          />

          <Controller
            name="establishedDate"
            control={requestForm.control}
            render={(establishedDate) => (
              <div
                onClick={() => establishedDateModal.current?.present()}
                className="w-full h-fit flex flex-col justify-center items-start gap-2"
              >
                <div className="flex justify-between items-center w-full bg-neutral-50 py-2 rounded-md px-2">
                  <label className="">Established date</label>

                  <IonDatetimeButton
                    datetime="established-date"
                    className="self-center"
                  ></IonDatetimeButton>
                </div>

                <IonNote className="ps-1">
                  Select the relationship established date.
                </IonNote>

                <IonModal
                  keepContentsMounted
                  initialBreakpoint={1}
                  breakpoints={[0, 0.5, 1]}
                  ref={establishedDateModal}
                  className="ion-w-[100%]!"
                >
                  <IonDatetime
                    id="established-date"
                    presentation="date"
                    max={format(new Date().toISOString(), "YYYY-MM-DD")}
                    showAdjacentDays
                    value={establishedDate.field.value}
                    onIonChange={establishedDate.field.onChange}
                    onIonBlur={establishedDate.field.onBlur}
                    ref={establishedDate.field.ref}
                    className="bg-transparent! ion-wheel-fade-bg-rgb-white mx-auto w-full my-8"
                  />
                </IonModal>
              </div>
            )}
          />
        </form>
      </div>
    </div>
  );
}
