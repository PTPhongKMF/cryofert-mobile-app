import { createApiResponseSchema } from "@src/schemas/api-response";
import * as v from "valibot";

const RelationshipTypeSchema = v.picklist(["Married", "Unmarried"]);
export type relationshipType = v.InferOutput<typeof RelationshipTypeSchema>;

const PatientInfoSchema = v.object({
  id: v.string(),
  patientCode: v.string(),
  nationalId: v.string(),
  fullName: v.nullable(v.string()),
  email: v.nullable(v.string()),
  phone: v.nullable(v.string()),
  isActive: v.boolean(),
});

export const RelationshipResponseSchema = v.object({
  id: v.string(),
  patient1Id: v.string(),
  patient2Id: v.string(),
  relationshipType: RelationshipTypeSchema,
  relationshipTypeName: v.string(),
  establishedDate: v.nullable(v.string()),
  notes: v.nullable(v.string()),
  isActive: v.boolean(),
  createdAt: v.string(),
  updatedAt: v.nullable(v.string()),
  patient1Info: v.nullable(PatientInfoSchema),
  patient2Info: v.nullable(PatientInfoSchema),
});

///////////////////////////////////////////////////////////////////////

export const RelationshipApiResponseSchema = createApiResponseSchema(
  v.array(RelationshipResponseSchema)
);

///////////////////////////////////////////////////////////////////////

export const RequestRelationshipFormSchema = v.object({
  patient2Id: v.pipe(v.string(), v.nonEmpty("Require")),
  relationshipType: RelationshipTypeSchema,
  establishedDate: v.pipe(
    v.string(),
    v.check((value) => {
      const ms = Date.parse(value);
      if (Number.isNaN(ms)) return false;

      const endOfToday = new Date();
      endOfToday.setHours(23, 59, 59, 999);

      return ms <= endOfToday.getTime();
    }, "Established date cannot be in the future")
  ),
  isActive: v.boolean(),
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
