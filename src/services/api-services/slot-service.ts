import {
  AllSlotApiResponseSchema,
  type AllSlotApiResponse,
} from "@src/schemas/slot";
import { httpClient } from "@src/services/api-services/http-service";
import { useQuery } from "@tanstack/react-query";
import * as v from "valibot";
import type { HTTPError } from "ky";

export function useSlotsQuery() {
  return useQuery<AllSlotApiResponse, HTTPError>({
    queryKey: ["getAllSlots"],
    queryFn: async () => {
      const res = await httpClient.get("api/slots").json();

      const parsed = v.parse(AllSlotApiResponseSchema, res);
      parsed.data.sort((a, b) => a.startTime.localeCompare(b.startTime));

      return parsed;
    },
  });
}
