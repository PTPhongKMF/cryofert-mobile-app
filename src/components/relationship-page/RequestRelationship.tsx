import { valibotResolver } from "@hookform/resolvers/valibot";
import {
  IonIcon,
  IonInput,
  IonButton,
  IonRadio,
  IonRadioGroup,
  IonTextarea,
  IonNote,
} from "@ionic/react";
import { useRequestRelationshipMutation } from "@src/hooks/relationship-hook";
import RelationshipSvg from "@assets/images/relationship.svg";
import { cn } from "@utils/cn";
import { Controller, useForm } from "react-hook-form";
import { heartHalfOutline } from "ionicons/icons";
import { useLocalUserStore } from "@src/stores/user";
import {
  RequestRelationshipFormSchema,
  type RequestRelationshipForm,
} from "@src/schemas/relationship";
import { VenusAndMars } from "lucide-react";

export default function RequestRelationship() {
  const localUser = useLocalUserStore((s) => s.localUser);
  const requestMutation = useRequestRelationshipMutation();

  const requestForm = useForm<RequestRelationshipForm>({
    defaultValues: {
      partnerId: "",
      relationshipType: "Wife",
      notes: "",
    },
    reValidateMode: "onSubmit",
    resolver: valibotResolver(RequestRelationshipFormSchema),
  });

  function handleRequest(data: RequestRelationshipForm) {
    if (!localUser?.id) {
      console.log("No user ID available");
      return;
    }
    requestMutation.mutate({
      patientId: localUser.id,
      partnerId: data.partnerId,
      relationshipType: data.relationshipType,
      notes: data.notes || "",
    });
  }

  return (
    <div className="flex flex-col justify-start items-center gap-4 size-full pt-10 px-4">
      <h2 className="font-semibold! text-blue-600">
        Connect with your other half
      </h2>
      <IonIcon icon={RelationshipSvg} className="size-40 text-blue-800" />

      <form
        onSubmit={requestForm.handleSubmit(handleRequest)}
        className="w-full flex flex-col gap-4 mt-4"
      >
        <Controller
          name="partnerId"
          control={requestForm.control}
          render={(partnerId) => (
            <IonInput
              placeholder="Your partner id"
              mode="md"
              fill="outline"
              errorText={partnerId.fieldState.error?.message}
              clearInput={true}
              value={partnerId.field.value}
              onIonInput={partnerId.field.onChange}
              onIonBlur={partnerId.field.onBlur}
              ref={partnerId.field.ref}
              className={cn(
                "ion-bg-white! ion-b-r-[7px]!  min-h-[1px]! ion-py-[0.45rem]!",
                partnerId.fieldState.error && "ion-invalid ion-touched"
              )}
            >
              <IonIcon
                icon={heartHalfOutline}
                slot="start"
                className="text-black me-4"
              />
            </IonInput>
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
                "w-full px-2",
                relationshipType.fieldState.error && "ion-invalid ion-touched"
              )}
            >
              <div className="flex w-full justify-between items-center">
                <p className="flex justify-center items-center gap-2 text-gray-700">
                  <VenusAndMars className="size-5" />
                  Relationship Type
                </p>

                <div className="flex justify-center items-center gap-10 px-4">
                  <IonRadio value="Wife" className="text-sm">
                    Wife
                  </IonRadio>
                  <IonRadio value="Husband" className="text-sm">
                    Husband
                  </IonRadio>
                </div>
              </div>
            </IonRadioGroup>
          )}
        />

        <Controller
          name="notes"
          control={requestForm.control}
          render={(notes) => (
            <div className="w-full h-fit flex flex-col justify-center items-start gap-2">
              <IonTextarea
                mode="ios"
                label="Note"
                labelPlacement="stacked"
                fill="outline"
                autoGrow
                value={notes.field.value}
                onIonInput={notes.field.onChange}
                onIonBlur={notes.field.onBlur}
                ref={notes.field.ref}
                className="ion-bg-neutral-50! ion-b-r-[6px]! ion-px-[0.5rem]!"
              />

              <IonNote className="ps-1">Additional information.</IonNote>
            </div>
          )}
        />

        <IonButton
          type="submit"
          size="small"
          disabled={requestMutation.isPending}
          className="text-base w-full normal-case font-semibold ion-bg-blue-600 mt-4"
        >
          {requestMutation.isPending ? "Requesting..." : "Request"}
        </IonButton>
      </form>
    </div>
  );
}
