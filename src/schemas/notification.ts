import { createApiResponseSchema } from "@src/schemas/api-response";
import * as v from "valibot";

export const NotificationTypes = [
  "Appointment",
  "Medication",
  "Test",
  "Payment",
  "Treatment",
  "Relationship",
  "Reminder",
  "CryoStorageContract",
] as const;
const NotificationTypeSchema = v.picklist(NotificationTypes);

export const NotificationStatuses = [
  "Scheduled",
  "Sent",
  "Delivered",
  "Read",
  "Failed",
] as const;
const NotificationStatusSchema = v.picklist(NotificationStatuses);

export const NotificationResponseSchema = v.object({
  id: v.string(),
  title: v.string(),
  content: v.string(),
  type: NotificationTypeSchema,
  status: NotificationStatusSchema,
  patientId: v.nullable(v.string()),
  patientName: v.nullable(v.string()),
  userId: v.nullable(v.string()),
  userName: v.nullable(v.string()),
  scheduledTime: v.nullable(v.string()),
  sentTime: v.nullable(v.string()),
  readTime: v.nullable(v.string()),
  channel: v.nullable(v.string()),
  relatedEntityType: v.nullable(v.string()),
  relatedEntityId: v.nullable(v.string()),
  isImportant: v.boolean(),
  notes: v.nullable(v.string()),
  createdAt: v.string(),
  updatedAt: v.nullable(v.string()),
});

///////////////////////////////////////////////////////////////////////

export const NotificationHistoryApiResponseSchema = createApiResponseSchema(
  v.array(NotificationResponseSchema)
);

///////////////////////////////////////////////////////////////////////

export type NotificationResponse = v.InferOutput<
  typeof NotificationResponseSchema
>;
export type NotificationHistoryApiResponse = v.InferOutput<
  typeof NotificationHistoryApiResponseSchema
>;

export type NotificationType = v.InferOutput<typeof NotificationTypeSchema>;
export type NotificationStatus = v.InferOutput<typeof NotificationStatusSchema>;
