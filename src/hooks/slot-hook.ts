import type { AllSlotApiResponse } from "@src/schemas/slot";
import { useQuery } from "@tanstack/react-query";
import type { HTTPError } from "ky";
import { slotsQueryFn } from "@src/services/api-services/slot-service";

export function useSlotsQuery() {
  return useQuery<AllSlotApiResponse, HTTPError>({
    queryKey: ["api/slots"],
    queryFn: slotsQueryFn,
  });
}



