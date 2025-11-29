import { createApiResponseSchema } from "@src/schemas/api-response";
import * as v from "valibot";

export const SlotResponseSchema = v.object({
  id: v.string(),
  startTime: v.string(),
  endTime: v.string(),
});

//////////////////////////////////////////////////////////

export const AllSlotApiResponseSchema = createApiResponseSchema(
  v.array(SlotResponseSchema)
);

/////////////////////////////////////////////////////////

export type Slot = v.InferOutput<typeof SlotResponseSchema>;
export type AllSlotApiResponse = v.InferOutput<typeof AllSlotApiResponseSchema>;
