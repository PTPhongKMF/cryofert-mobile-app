import { IonSelect, IonSelectOption } from "@ionic/react";
import {
  LabSampleStatuses,
  LabSampleTypes,
  type LabSampleSortType,
} from "@src/schemas/lab-sample";
import {
  type LabSampleFilterOptions,
  useLabSampleFilterStore,
} from "@src/stores/lab-sample";
import { titleCase } from "text-case";
import { useShallow } from "zustand/react/shallow";

export default function LabSampleFilter() {
  const { filterOptions, setFilterOptions } = useLabSampleFilterStore(
    useShallow((state) => ({
      filterOptions: state.filterOptions,
      setFilterOptions: state.setFilterOptions,
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
            type: (e.detail.value as LabSampleFilterOptions["type"]) || null,
          })
        }
        className="border border-blue-400 rounded-2xl px-2 min-h-0! h-6!"
      >
        <IonSelectOption value="">All</IonSelectOption>
        {LabSampleTypes.map((type, i) => (
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
            status:
              (e.detail.value as LabSampleFilterOptions["status"]) || null,
          })
        }
        className="border border-blue-400 rounded-2xl px-2 min-h-0! h-6!"
      >
        <IonSelectOption value="">All</IonSelectOption>
        {LabSampleStatuses.map((status, i) => (
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
            sortType: e.detail.value as LabSampleSortType,
          })
        }
        className="border border-blue-400 rounded-2xl px-2 min-h-0! h-6!"
      >
        <IonSelectOption value="LatestCollection">Latest</IonSelectOption>
        <IonSelectOption value="ExpirySoon">Expiring Soon</IonSelectOption>
      </IonSelect>
    </div>
  );
}
