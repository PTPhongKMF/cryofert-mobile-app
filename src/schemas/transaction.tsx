import { createApiResponseSchema } from "@src/schemas/api-response";
import * as v from "valibot";

export const TransactionTypes = ["Payment", "Refund", "Adjustment"] as const;
const transactionType = v.picklist(TransactionTypes);

export const TransactionStatuses = [
  "Pending",
  "Completed",
  "Failed",
  "Cancelled",
] as const;
const transactionStatus = v.picklist(TransactionStatuses);

export const relatedEntityType = [
  "ServiceRequest",
  "Appointment",
  "CryoStorageContract",
] as const;
const relatedEntityTypeSchema = v.picklist(relatedEntityType);

export const CreateTransactionRequestSchema = v.object({
  relatedEntityType: v.union([
    v.literal("ServiceRequest"),
    v.literal("Appointment"),
    v.literal("CryoStorageContract"),
  ]),
  relatedEntityId: v.pipe(v.string(), v.nonEmpty()),
});

export const TransactionResponseSchema = v.object({
  id: v.string(),
  transactionCode: v.string(),
  paymentUrl: v.string(),
  transactionType: transactionType,
  amount: v.number(),
  currency: v.string(),
  transactionDate: v.string(),
  status: transactionStatus,
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

export const TransactionApiResponseSchema = createApiResponseSchema(
  TransactionResponseSchema
);

///////////////////////////////////////////////////////////////////////

export type TransactionResponse = v.InferOutput<
  typeof TransactionResponseSchema
>;
export type CreateTransactionRequest = v.InferOutput<
  typeof CreateTransactionRequestSchema
>;
export type TransactionHistoryApiResponse = v.InferOutput<
  typeof TransactionHistoryApiResponseSchema
>;
export type TransactionApiResponse = v.InferOutput<
  typeof TransactionApiResponseSchema
>;

export type TransactionType = v.InferOutput<typeof transactionType>;
export type TransactionStatus = v.InferOutput<typeof transactionStatus>;
export type relatedEntityType = v.InferOutput<typeof relatedEntityTypeSchema>;
