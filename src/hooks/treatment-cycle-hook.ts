import type {
  TreatmentCycleListApiResponse,
  TreatmentCycleDetailApiResponse,
} from "@src/schemas/treatment-cycle";
import {
  treatmentCycleListQueryFn,
  treatmentCycleDetailQueryFn,
} from "@src/services/api-services/treatment-cycle-service";
import { useLocalUserStore } from "@src/stores/user";
import { useQuery } from "@tanstack/react-query";
import type { HTTPError } from "ky";

export function useTreatmentCycleList(treatmentId: string, enabled: boolean) {
  const localUser = useLocalUserStore((s) => s.localUser);
  const patientId = localUser?.id || "";

  return useQuery<TreatmentCycleListApiResponse, HTTPError>({
    queryKey: ["TreatmentCycleList", treatmentId, patientId],
    queryFn: () =>
      treatmentCycleListQueryFn({
        treatmentId,
        patientId,
      }),
    enabled: enabled,
  });
}

export function useTreatmentCycleDetailQuery(cycleId: string) {
  return useQuery<TreatmentCycleDetailApiResponse, HTTPError>({
    queryKey: ["TreatmentCycleDetail", cycleId],
    queryFn: () => treatmentCycleDetailQueryFn({ cycleId }),
    enabled: !!cycleId,
  });
}
