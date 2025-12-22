import { createApiResponseSchema } from "@src/schemas/api-response";
import * as v from "valibot";

export const MediaTypes = [
  "MedicalRecord",
  "TreatmentCycle",
  "Account",
  "Agreement",
  "CryoStorageContract",
  "CryoImport",
  "CryoExport",
  "ServiceRequest",
  "ServiceRequestDetails",
] as const;

export const MediaTypeSchema = v.picklist(MediaTypes);

export const MediaResponseSchema = v.object({
  id: v.string(),
  fileName: v.string(),
  originalFileName: v.string(),
  filePath: v.string(),
  fileType: v.string(),
  fileSize: v.number(),
  fileExtension: v.string(),
  relatedEntityId: v.nullable(v.string()),
  relatedEntityType: v.string(),
  title: v.nullable(v.string()),
  description: v.nullable(v.string()),
  category: v.nullable(v.string()),
  tags: v.nullable(v.string()),
  uploadDate: v.string(),
  uploadedBy: v.nullable(v.string()),
  uploadedByUserId: v.nullable(v.string()),
  isPublic: v.boolean(),
  thumbnailPath: v.nullable(v.string()),
  storageLocation: v.nullable(v.string()),
  notes: v.nullable(v.string()),
});

///////////////////////////////////////////////////////////////////////

export const MediaListApiResponseSchema = createApiResponseSchema(
  v.array(MediaResponseSchema)
);

///////////////////////////////////////////////////////////////////////

export type MediaType = v.InferOutput<typeof MediaTypeSchema>;
export type MediaResponse = v.InferOutput<typeof MediaResponseSchema>;

export type MediaListApiResponse = v.InferOutput<
  typeof MediaListApiResponseSchema
>;
