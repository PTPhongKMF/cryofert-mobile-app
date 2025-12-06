import { IonSelect, IonSelectOption } from "@ionic/react";
import {
  CryoContractStatuses,
  type CryoContractStatus,
} from "@src/schemas/cryo-contract";
import {
  type CryoContractFilterOptions,
  useCryoContractFilterStore,
} from "@src/stores/cryo-contract";
import { titleCase } from "text-case";
import { useShallow } from "zustand/react/shallow";

export default function ContractHistoryFilter() {
  const { filterOptions, setFilterOptions } = useCryoContractFilterStore(
    useShallow((state) => ({
      filterOptions: state.filterOptions,
      setFilterOptions: state.setFilterOptions,
    }))
  );

  return (
    <div className="w-full px-2 pt-2 grid grid-cols-3 items-center gap-4 h-fit text-xs">
      <IonSelect
        interface="popover"
        label="Status"
        placeholder="All"
        value={filterOptions.status}
        onIonChange={(e) =>
          setFilterOptions({
            status:
              (e.detail.value as CryoContractStatus | "") === ""
                ? undefined
                : (e.detail.value as CryoContractStatus),
          })
        }
        className="border border-blue-400 rounded-2xl px-2 min-h-0! h-6!"
      >
        <IonSelectOption value="">All</IonSelectOption>
        {CryoContractStatuses.map((status, i) => (
          <IonSelectOption key={i} value={status}>
            {titleCase(status)}
          </IonSelectOption>
        ))}
      </IonSelect>

      <div className="h-full w-full border border-dashed border-gray-300 rounded-2xl px-2 flex items-center text-gray-400 text-[11px]">
        {/* to do: add second filter */}
      </div>

      <div className="h-full w-full border border-dashed border-gray-300 rounded-2xl px-2 flex items-center text-gray-400 text-[11px]">
        {/* to do: add third filter */}
      </div>
    </div>
  );
}

