import { createApiResponseSchema } from "@src/schemas/api-response";
import * as v from "valibot";

export const ServiceRequestStatuses = [
  "Pending",
  "Rejected",
  "Completed",
  "InProcess",
] as const;
const ServiceRequestStatusSchema = v.picklist(ServiceRequestStatuses);

export const ServiceRequestDetailResponseSchema = v.object({
  id: v.string(),
  serviceRequestId: v.string(),
  serviceId: v.string(),
  serviceName: v.string(),
  serviceCode: v.nullable(v.string()),
  serviceUnit: v.nullable(v.string()),
  quantity: v.number(),
  unitPrice: v.number(),
  discount: v.nullable(v.number()),
  totalPrice: v.number(),
  notes: v.nullable(v.string()),
});

export const ServiceRequestResponseSchema = v.object({
  id: v.string(),
  appointmentId: v.nullable(v.string()),
  requestDate: v.string(),
  status: ServiceRequestStatusSchema,
  statusName: v.string(),
  totalAmount: v.nullable(v.number()),
  notes: v.nullable(v.string()),
  approvedDate: v.nullable(v.string()),
  approvedBy: v.nullable(v.string()),
  createdAt: v.string(),
  updatedAt: v.nullable(v.string()),
  serviceDetails: v.array(ServiceRequestDetailResponseSchema),
});

///////////////////////////////////////////////////////////////////////

export const ServiceRequestApiResponseSchema = createApiResponseSchema(
  v.array(ServiceRequestResponseSchema)
);

///////////////////////////////////////////////////////////////////////

export type ServiceRequestStatus = v.InferOutput<
  typeof ServiceRequestStatusSchema
>;

export type ServiceRequestDetailResponse = v.InferOutput<
  typeof ServiceRequestDetailResponseSchema
>;

export type ServiceRequestResponse = v.InferOutput<
  typeof ServiceRequestResponseSchema
>;

export type ServiceRequestApiResponse = v.InferOutput<
  typeof ServiceRequestApiResponseSchema
>;

