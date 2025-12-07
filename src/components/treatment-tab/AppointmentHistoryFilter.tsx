import { IonSelect, IonSelectOption } from "@ionic/react";
import { titleCase } from "text-case";
import { AppointmentStatus, AppointmentTypes } from "@src/schemas/appointment";
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
    <div className="w-full px-2 pt-2 grid grid-cols-3 items-center gap-4 h-fit text-xs">
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
        className="border border-blue-400 rounded-2xl px-2 min-h-0! h-6!"
      >
        <IonSelectOption value="">All</IonSelectOption>
        {AppointmentTypes.map((type, i) => (
          <IonSelectOption key={i} value={type}>
            {type === type.toUpperCase() ? type : titleCase(type)}
          </IonSelectOption>
        ))}
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
        className="border border-blue-400 rounded-2xl px-2 min-h-0! h-6!"
      >
        <IonSelectOption value="">All</IonSelectOption>
        {AppointmentStatus.map((status, i) => (
          <IonSelectOption key={i} value={status}>
            {status === status.toUpperCase() ? status : titleCase(status)}
          </IonSelectOption>
        ))}
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
        className="border border-blue-400 rounded-2xl px-2 min-h-0! h-6!"
      >
        <IonSelectOption value="Lastest">Latest</IonSelectOption>
        <IonSelectOption value="Upcomming">Upcoming</IonSelectOption>
      </IonSelect>
    </div>
  );
}
