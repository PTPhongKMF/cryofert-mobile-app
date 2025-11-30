import { createApiResponseSchema } from "@src/schemas/api-response";
import * as v from "valibot";

const PatientInfoSchema = v.object({
  id: v.string(),
  patientCode: v.string(),
  nationalId: v.string(),
  fullName: v.string(),
  email: v.string(),
  phone: v.string(),
  isActive: v.boolean(),
});

export const RelationshipResponseSchema = v.object({
  id: v.string(),
  patient1Id: v.string(),
  patient2Id: v.string(),
  relationshipType: v.string(),
  relationshipTypeName: v.string(),
  establishedDate: v.nullable(v.string()),
  notes: v.string(),
  isActive: v.boolean(),
  createdAt: v.string(),
  updatedAt: v.nullable(v.string()),
  patient1Info: PatientInfoSchema,
  patient2Info: PatientInfoSchema,
});

///////////////////////////////////////////////////////////////////////

export const RelationshipApiResponseSchema = createApiResponseSchema(
  v.array(RelationshipResponseSchema)
);

///////////////////////////////////////////////////////////////////////

export const RequestRelationshipFormSchema = v.object({
  partnerId: v.pipe(v.string(), v.nonEmpty("Required")),
  relationshipType: v.picklist(["Wife", "Husband"], "Please select a relationship type"),
  notes: v.optional(v.string()),
});

export type RequestRelationshipForm = v.InferOutput<
  typeof RequestRelationshipFormSchema
>;

export type RelationshipResponse = v.InferOutput<
  typeof RelationshipResponseSchema
>;
export type RelationshipApiResponse = v.InferOutput<
  typeof RelationshipApiResponseSchema
>;