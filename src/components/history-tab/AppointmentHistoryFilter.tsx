import { IonSelect, IonSelectOption } from "@ionic/react";
import { useAppointmentHistoryFilterStore } from "@src/stores/appointment";
import { useShallow } from "zustand/react/shallow";

export default function AppointmentHistoryFilter() {
  const { filterOptions, setFilterOptions } = useAppointmentHistoryFilterStore(
    useShallow((s) => ({
      filterOptions: s.filterOptions,
      setFilterOptions: s.setFilterOptions,
    }))
  );

  return (
    <div className="w-full px-4 grid grid-cols-3 items-center gap-4">
      <IonSelect
        interface="popover"
        label="Type"
        placeholder="All"
        value={filterOptions.type ?? undefined}
        onIonChange={(e) =>
          setFilterOptions({
            type: e.detail.value || null,
          })
        }
      >
        <IonSelectOption value="">All</IonSelectOption>
        <IonSelectOption value="Consultation">Consultation</IonSelectOption>
        <IonSelectOption value="Ultrasound">Ultrasound</IonSelectOption>
        <IonSelectOption value="BloodTest">Blood test</IonSelectOption>
        <IonSelectOption value="OPU">OPU</IonSelectOption>
        <IonSelectOption value="ET">ET</IonSelectOption>
        <IonSelectOption value="IUI">IUI</IonSelectOption>
        <IonSelectOption value="FollowUp">Follow up</IonSelectOption>
        <IonSelectOption value="Injection">Injection</IonSelectOption>
        <IonSelectOption value="Booking">Booking</IonSelectOption>
      </IonSelect>

      <IonSelect
        interface="popover"
        label="Status"
        placeholder="All"
        value={filterOptions.status ?? undefined}
        onIonChange={(e) =>
          setFilterOptions({
            status: e.detail.value || null,
          })
        }
      >
        <IonSelectOption value="">All</IonSelectOption>
        <IonSelectOption value="Scheduled">Scheduled</IonSelectOption>
        <IonSelectOption value="Confirmed">Confirmed</IonSelectOption>
        <IonSelectOption value="CheckedIn">Checked in</IonSelectOption>
        <IonSelectOption value="InProgress">In progress</IonSelectOption>
        <IonSelectOption value="Completed">Completed</IonSelectOption>
        <IonSelectOption value="Cancelled">Cancelled</IonSelectOption>
        <IonSelectOption value="NoShow">No show</IonSelectOption>
        <IonSelectOption value="Rescheduled">Rescheduled</IonSelectOption>
      </IonSelect>

      <IonSelect
        interface="popover"
        label="Sort"
        value={filterOptions.sortType}
        onIonChange={(e) =>
          setFilterOptions({
            sortType: e.detail.value,
          })
        }
      >
        <IonSelectOption value="Lastest">Latest</IonSelectOption>
        <IonSelectOption value="Upcomming">Upcoming</IonSelectOption>
      </IonSelect>
    </div>
  );
}
