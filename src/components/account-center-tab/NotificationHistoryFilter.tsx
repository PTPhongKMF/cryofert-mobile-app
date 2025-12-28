import { IonSelect, IonSelectOption } from "@ionic/react";
import type { NotificationHistoryFilters } from "@src/hooks/notification-hook";
import {
  NotificationStatuses,
  NotificationTypes,
} from "@src/schemas/notification";
import { toTitleCase } from "@src/utils/case";

interface NotificationHistoryFilterProps {
  filters: NotificationHistoryFilters;
  onChange: (update: Partial<NotificationHistoryFilters>) => void;
}

export default function NotificationHistoryFilter({
  filters,
  onChange,
}: NotificationHistoryFilterProps) {
  return (
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
        {NotificationStatuses.map((status, idx) => (
          <IonSelectOption key={idx} value={status}>
            {toTitleCase(status)}
          </IonSelectOption>
        ))}
      </IonSelect>

      <IonSelect
        interface="popover"
        label="Type"
        placeholder="All"
        value={filters.type ?? undefined}
        onIonChange={(e) =>
          onChange({
            type: e.detail.value || null,
          })
        }
        className="border border-blue-400 rounded-2xl px-2 min-h-0! h-6!"
      >
        <IonSelectOption value="">All</IonSelectOption>
        {NotificationTypes.map((type, idx) => (
          <IonSelectOption key={idx} value={type}>
            {toTitleCase(type)}
          </IonSelectOption>
        ))}
      </IonSelect>
    </div>
  );
}


