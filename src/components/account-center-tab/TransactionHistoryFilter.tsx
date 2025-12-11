import {
  IonButton,
  IonDatetime,
  IonDatetimeButton,
  IonModal,
  IonNote,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import { format } from "@formkit/tempo";
import type { TransactionHistoryFilters } from "@src/hooks/transaction-hook";
import {
  relatedEntityType,
  TransactionStatuses,
  TransactionTypes,
} from "@src/schemas/transaction";
import { toTitleCase } from "@src/utils/case";

interface TransactionHistoryFilterProps {
  filters: TransactionHistoryFilters;
  onChange: (update: Partial<TransactionHistoryFilters>) => void;
}

export default function TransactionHistoryFilter({
  filters,
  onChange,
}: TransactionHistoryFilterProps) {
  return (
    <>
      <div className="w-full px-2 pt-2 pb-0.5 grid grid-cols-2 auto-rows-min gap-1 h-fit text-xs">
        <IonSelect
          interface="popover"
          label="Status"
          placeholder="All"
          value={filters.status ?? undefined}
          onIonChange={(e) =>
            onChange({
              status: e.detail.value || null,
            })
          }
          className="border border-blue-400 rounded-2xl px-2 min-h-0! h-6!"
        >
          <IonSelectOption value="">All</IonSelectOption>
          {TransactionStatuses.map((status, idx) => (
            <IonSelectOption key={idx} value={status}>
              {toTitleCase(status)}
            </IonSelectOption>
          ))}
        </IonSelect>

        <IonSelect
          interface="popover"
          label="Related"
          placeholder="All"
          value={filters.relatedEntityType ?? undefined}
          onIonChange={(e) =>
            onChange({
              relatedEntityType: e.detail.value || null,
            })
          }
          className="border border-blue-400 rounded-2xl px-2 min-h-0! h-6!"
        >
          <IonSelectOption value="">All</IonSelectOption>
          {relatedEntityType.map((related, idx) => (
            <IonSelectOption key={idx} value={related}>
              {toTitleCase(related)}
            </IonSelectOption>
          ))}
        </IonSelect>

        <div className="flex justify-between items-baseline gap-2 border border-blue-400 rounded-2xl px-2">
          <p>From</p>

          <IonDatetimeButton
            datetime="from-date"
            className="transparent-dt-button"
          />
        </div>

        <div className="flex justify-between items-baseline gap-2 border border-blue-400 rounded-2xl px-2">
          <p>To</p>

          <IonDatetimeButton
            datetime="to-date"
            className="transparent-dt-button"
          />
        </div>
      </div>

      {/*///////////////////////////// modal */}

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
          value={filters.fromDate ?? undefined}
          onIonChange={(e) =>
            onChange({
              fromDate: (e.detail.value as string | null) || null,
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
          value={filters.toDate ?? undefined}
          onIonChange={(e) =>
            onChange({
              toDate: (e.detail.value as string | null) || null,
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
