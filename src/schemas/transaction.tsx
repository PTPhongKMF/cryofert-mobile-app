import { createApiResponseSchema } from "@src/schemas/api-response";
import * as v from "valibot";

const TransactionResponseSchema = v.object({
  id: v.string(),
  transactionCode: v.string(),
  paymentUrl: v.string(),
  transactionType: v.string(),
  amount: v.number(),
  currency: v.string(),
  transactionDate: v.string(),
  status: v.string(),
  paymentMethod: v.string(),
  paymentGateway: v.string(),
  referenceNumber: v.string(),
  description: v.string(),
  notes: v.nullable(v.string()),
  patientId: v.string(),
  patientName: v.string(),
  processedDate: v.nullable(v.string()),
  processedBy: v.nullable(v.string()),
  relatedEntityType: v.string(),
  relatedEntityId: v.string(),
});

///////////////////////////////////////////////////////////////////////

export const TransactionHistoryApiResponseSchema = createApiResponseSchema(
  v.array(TransactionResponseSchema)
);

///////////////////////////////////////////////////////////////////////

export type TransactionResponse = v.InferOutput<
  typeof TransactionResponseSchema
>;
export type TransactionHistoryApiResponse = v.InferOutput<
  typeof TransactionHistoryApiResponseSchema
>;
