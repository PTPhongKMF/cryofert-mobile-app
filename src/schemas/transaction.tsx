import { createApiResponseSchema } from "@src/schemas/api-response";
import * as v from "valibot";

export const TransactionTypes = ["Payment", "Refund", "Adjustment"] as const;
const transactionType = v.picklist(TransactionTypes);

export const PaymentGateway = ["VNPay", "PayOS"] as const;
const paymentGatewaySchema = v.picklist(PaymentGateway);

export const CreateTransPaymentGateway = ["VnPay", "PayOS"] as const;
const createTransPaymentGatewaySchema = v.picklist(CreateTransPaymentGateway);

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
  paymentGateway: createTransPaymentGatewaySchema,
  relatedEntityType: relatedEntityTypeSchema,
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
  paymentMethod: v.nullable(v.string()),
  paymentGateway: v.nullable(paymentGatewaySchema),
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
