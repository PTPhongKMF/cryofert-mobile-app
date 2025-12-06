import { createApiResponseSchema } from "@src/schemas/api-response";
import * as v from "valibot";

export const MediaTypes = [
  "MedicalRecord",
  "TreatmentCycle",
  "Account",
  "Agreement",
  "CryoStorageContract",
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
  title: v.string(),
  description: v.string(),
  category: v.string(),
  tags: v.string(),
  uploadDate: v.string(),
  uploadedBy: v.string(),
  uploadedByUserId: v.string(),
  isPublic: v.boolean(),
  thumbnailPath: v.nullable(v.string()),
  storageLocation: v.nullable(v.string()),
  notes: v.string(),
});

export const MediaTemplateApiResponseSchema = createApiResponseSchema(
  MediaResponseSchema
);

export const MediaListApiResponseSchema = createApiResponseSchema(
  v.array(MediaResponseSchema)
);

export type MediaType = v.InferOutput<typeof MediaTypeSchema>;
export type MediaResponse = v.InferOutput<typeof MediaResponseSchema>;
export type MediaTemplateApiResponse = v.InferOutput<
  typeof MediaTemplateApiResponseSchema
>;
export type MediaListApiResponse = v.InferOutput<
  typeof MediaListApiResponseSchema
>;

