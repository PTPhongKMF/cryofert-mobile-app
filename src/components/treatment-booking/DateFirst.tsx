import {
  IonBadge,
  IonButton,
  IonContent,
  IonDatetime,
  IonDatetimeButton,
  IonHeader,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonItem,
  IonList,
  IonModal,
  IonNote,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonToolbar,
} from "@ionic/react";
import { useDoctorAvailableInfiniteQuery } from "@src/hooks/doctor-hook";
import type { BookAppointmentForm } from "@src/schemas/appointment";
import type { DoctorApiResponse, DoctorResponse } from "@src/schemas/doctor";
import type { Slot } from "@src/schemas/slot";
import { cn } from "@utils/cn";
import { checkboxOutline } from "ionicons/icons";
import { useRef, useState } from "react";
import { Controller, type UseFormReturn } from "react-hook-form";

interface DateFirstProps {
  bookingForm: UseFormReturn<BookAppointmentForm>;
  slotList: Slot[];
}

export default function DateFirst({ bookingForm, slotList }: DateFirstProps) {
  const [doctorName, setDoctorName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const doctorModal = useRef<HTMLIonModalElement>(null);
  const doctorSheet = useRef<HTMLIonButtonElement>(null);
  const appointmentDateModal = useRef<HTMLIonModalElement>(null);

  const doctorQuery = useDoctorAvailableInfiniteQuery(
    searchTerm,
    bookingForm.watch("appointmentDate"),
    bookingForm.watch("slotId")
  );

  const doctors: DoctorResponse[] =
    doctorQuery.data?.pages.flatMap((page: DoctorApiResponse) => page.data) ??
    [];

  async function handleLoadMore(e: CustomEvent<void>) {
    await doctorQuery.fetchNextPage();
    (e.target as HTMLIonInfiniteScrollElement)?.complete();
  }

  return (
    <>
      <Controller
        name="appointmentDate"
        control={bookingForm.control}
        render={(appointmentDate) => (
          <div
            onClick={() => appointmentDateModal.current?.present()}
            className="w-full h-fit flex flex-col justify-center items-start gap-2"
          >
            <div
              className="flex justify-between items-center w-full
                  bg-neutral-50 py-2 rounded-md px-2"
            >
              <label className="">Date</label>

              <IonDatetimeButton
                datetime="appointment-date"
                className="self-center"
              ></IonDatetimeButton>
            </div>

            <IonNote className="ps-1">
              Select a desired date for your appointment.
            </IonNote>

            <IonModal
              keepContentsMounted
              initialBreakpoint={1}
              breakpoints={[0, 0.5, 1]}
              ref={appointmentDateModal}
              className="ion-w-[100%]!"
            >
              <IonDatetime
                id="appointment-date"
                presentation="date"
                min={bookingForm.formState.defaultValues?.appointmentDate}
                showAdjacentDays
                value={appointmentDate.field.value}
                onIonChange={appointmentDate.field.onChange}
                onIonBlur={appointmentDate.field.onBlur}
                ref={appointmentDate.field.ref}
                className="bg-transparent! ion-wheel-fade-bg-rgb-white mx-auto w-full my-8"
              />
            </IonModal>
          </div>
        )}
      />

      <Controller
        name="slotId"
        control={bookingForm.control}
        render={(slotId) => (
          <div className="w-full h-fit flex flex-col justify-center items-start gap-2">
            <IonSelect
              label="Slot (time)"
              placeholder="Select a slot"
              interface="action-sheet"
              errorText={slotId.fieldState.error?.message}
              value={slotId.field.value}
              onIonChange={slotId.field.onChange}
              onIonBlur={slotId.field.onBlur}
              ref={slotId.field.ref}
              className={cn(
                "ion-bg-neutral-50! ion-px-[0.5rem]!",
                slotId.fieldState.error && "ion-invalid ion-touched"
              )}
            >
              {slotList.map((slot) => (
                <IonSelectOption key={slot.id} value={slot.id}>
                  {slot.startTime} - {slot.endTime}
                </IonSelectOption>
              ))}
            </IonSelect>

            <IonNote className="ps-1">Slot.</IonNote>
          </div>
        )}
      />

      <div className="w-full h-fit flex flex-col justify-center items-start gap-2">
        <div className="w-full relative">
          <div
            onClick={() => {
              if (
                bookingForm.watch("appointmentDate") &&
                bookingForm.watch("slotId") &&
                !doctorQuery.isFetching
              ) {
                doctorSheet.current?.click();
              }
            }}
            className={cn(
              "flex justify-between items-center w-full h-12 bg-neutral-50 py-2 rounded-md px-2",
              (!bookingForm.watch("appointmentDate") ||
                !bookingForm.watch("slotId")) &&
                "opacity-50"
            )}
          >
            <label className="">Doctor</label>

            <IonButton
              id="doctor-sheet"
              ref={doctorSheet}
              size="small"
              disabled={
                !bookingForm.watch("appointmentDate") ||
                !bookingForm.watch("slotId") ||
                doctorQuery.isFetching
              }
              className="normal-case ion-box-shadow-[0] ion-bg-[#edeef0]! text-gray-900"
            >
              {doctorQuery.isFetching ? (
                <IonSpinner color="primary" />
              ) : (
                doctorName || "Select"
              )}
            </IonButton>
          </div>

          {(() => {
            const hasDate = !!bookingForm.watch("appointmentDate");
            const hasSlot = !!bookingForm.watch("slotId");
            const isQueryEnabled = hasDate && hasSlot;
            const shouldShowOverlay =
              !hasDate ||
              !hasSlot ||
              (isQueryEnabled && doctorQuery.isFetching);
            const shouldShowSpinner = isQueryEnabled && doctorQuery.isFetching;

            return shouldShowOverlay ? (
              <div
                className={cn(
                  "absolute inset-0 bg-gray-200/60 rounded-md flex items-center justify-center z-10",
                  shouldShowSpinner && "bg-gray-300/70"
                )}
                style={{ pointerEvents: "auto" }}
              >
                {shouldShowSpinner && (
                  <IonSpinner color="primary" className="z-20" />
                )}
              </div>
            ) : null;
          })()}
        </div>

        <IonNote className="ps-1">Select a Doctor.</IonNote>

        <IonModal
          trigger="doctor-sheet"
          ref={doctorModal}
          initialBreakpoint={0.5}
          breakpoints={[0, 0.5, 0.75]}
          expandToScroll={false}
        >
          <IonHeader>
            <IonToolbar className="pt-2!">
              <IonSearchbar
                showClearButton="always"
                debounce={300}
                value={searchTerm}
                onIonInput={(e) => setSearchTerm(e.target.value ?? "")}
                className="ion-box-shadow-[0]! ion-bg-neutral-100! ion-b-r-[6px]! pt-2"
              />
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonList>
              {doctorQuery.isPending && (
                <div className="flex justify-center py-4">
                  <IonSpinner color="primary" />
                </div>
              )}

              {!doctorQuery.isLoading &&
                doctorQuery.isSuccess &&
                doctors.length === 0 && (
                  <IonNote className="flex justify-center py-6 text-sm text-gray-500">
                    No doctors found.
                  </IonNote>
                )}

              {doctors.length > 0 && (
                <>
                  <IonItem
                    button
                    detail={false}
                    onClick={() => {
                      setDoctorName("Let us decide");
                      bookingForm.setValue("doctorIds", "");
                      doctorModal.current?.dismiss();
                    }}
                    className=" ion-bg-blue-100! mb-2!"
                  >
                    <p className="w-full font-semibold text-base h-20 flex justify-center items-center gap-3">
                      <IonIcon icon={checkboxOutline} className="size-6" />
                      Let us decide
                    </p>
                  </IonItem>

                  {doctors.map((doctor) => (
                    <IonItem
                      key={doctor.id}
                      button
                      detail={false}
                      onClick={() => {
                        setDoctorName(doctor.account.firstName);
                        bookingForm.setValue("doctorIds", doctor.id);
                        doctorModal.current?.dismiss();
                      }}
                      className="ion-bg-neutral-50!"
                    >
                      <div className="flex flex-col gap-2 py-2 w-full">
                        <div className="flex items-center justify-between">
                          <p className="text-base font-semibold text-gray-900">
                            {`${doctor.account.lastName} ${doctor.account.firstName}`}
                          </p>
                          <IonBadge color="primary" className="p-1">
                            {doctor.badgeId}
                          </IonBadge>
                        </div>

                        <div className="text-sm text-gray-700">
                          {doctor.specialty}
                          {doctor.yearsOfExperience > 0 && (
                            <span className="text-xs text-gray-500 ml-2">
                              · {doctor.yearsOfExperience} years experience
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-gray-500">
                          {doctor.certificates}
                        </div>

                        <div className="text-xs text-gray-500 flex flex-wrap gap-2">
                          {`${doctor.account.email} | ${doctor.account.phone}`}
                        </div>
                      </div>
                    </IonItem>
                  ))}

                  <IonInfiniteScroll
                    disabled={!doctorQuery.hasNextPage}
                    onIonInfinite={handleLoadMore}
                  >
                    <IonInfiniteScrollContent
                      loadingText="Loading more..."
                      className="mt-8"
                    />
                  </IonInfiniteScroll>
                </>
              )}
            </IonList>
          </IonContent>
        </IonModal>
      </div>
    </>
  );
}
