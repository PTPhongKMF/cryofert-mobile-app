import {
  IonDatetime,
  IonDatetimeButton,
  IonModal,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import {
  CryoContractStatuses,
  type CryoContractStatus,
} from "@src/schemas/cryo-contract";
import {
  type CryoContractFilterOptions,
  useCryoContractFilterStore,
} from "@src/stores/cryo-contract";
import { toTitleCase } from "@src/utils/case";
import { useShallow } from "zustand/react/shallow";

export default function ContractHistoryFilter() {
  const { filterOptions, setFilterOptions } = useCryoContractFilterStore(
    useShallow((state) => ({
      filterOptions: state.filterOptions,
      setFilterOptions: state.setFilterOptions,
    }))
  );

  return (
    <>
      <div className="w-full px-2 pt-2 grid grid-cols-3 items-center gap-3 h-fit text-xs">
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
              {toTitleCase(status)}
            </IonSelectOption>
          ))}
        </IonSelect>

        <div className="flex justify-between items-baseline gap-1 border border-blue-400 rounded-2xl ps-2">
          <p>From</p>

          <IonDatetimeButton
            datetime="from-date"
            className="transparent-dt-button"
          />
        </div>

        <div className="flex justify-between items-baseline gap-1 border border-blue-400 rounded-2xl ps-2">
          <p>To</p>

          <IonDatetimeButton
            datetime="to-date"
            className="transparent-dt-button"
          />
        </div>
      </div>

      <IonModal
        keepContentsMounted
        initialBreakpoint={1}
        breakpoints={[0, 0.5, 1]}
        className="ion-w-[100%]!"
      >
        <IonDatetime
          id="from-date"
          presentation="date"
          showAdjacentDays
          value={filterOptions.fromDate}
          onIonChange={(e) =>
            setFilterOptions({
              fromDate: (e.detail.value as string | null) || undefined,
            })
          }
          formatOptions={{
            date: {
              year: "numeric",
              month: "numeric",
              day: "numeric",
            },
          }}
          className="bg-transparent! ion-wheel-fade-bg-rgb-white mx-auto w-full my-8"
        />
      </IonModal>

      <IonModal
        keepContentsMounted
        initialBreakpoint={1}
        breakpoints={[0, 0.5, 1]}
        className="ion-w-[100%]!"
      >
        <IonDatetime
          id="to-date"
          presentation="date"
          showAdjacentDays
          value={filterOptions.toDate}
          onIonChange={(e) =>
            setFilterOptions({
              toDate: (e.detail.value as string | null) || undefined,
            })
          }
          formatOptions={{
            date: {
              year: "numeric",
              month: "numeric",
              day: "numeric",
            },
          }}
          className="bg-transparent! ion-wheel-fade-bg-rgb-white mx-auto w-full my-8"
        />
      </IonModal>
    </>
  );
}

