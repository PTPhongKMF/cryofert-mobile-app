import { createApiResponseSchema } from "@src/schemas/api-response";
import * as v from "valibot";

const SlotSchema = v.object({
  id: v.string(),
  startTime: v.string(),
  endTime: v.string(),
  notes: v.string(),
});

//////////////////////////////////////////////////////////

export const AllSlotApiResponseSchema = createApiResponseSchema(
  v.array(SlotSchema)
);

/////////////////////////////////////////////////////////

export type Slot = v.InferOutput<typeof SlotSchema>;
export type AllSlotApiResponse = v.InferOutput<typeof AllSlotApiResponseSchema>;
