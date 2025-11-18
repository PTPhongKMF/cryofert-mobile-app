import {
  AllSlotApiResponseSchema,
  type AllSlotApiResponse,
} from "@src/schemas/slot";
import { httpClient } from "@src/services/api-services/http-service";
import * as v from "valibot";

export async function slotsQueryFn(): Promise<AllSlotApiResponse> {
  const res = await httpClient.get("api/slots").json();

  const parsed = v.parse(AllSlotApiResponseSchema, res);
  parsed.data.sort((a, b) => a.startTime.localeCompare(b.startTime));

  return parsed;
}
