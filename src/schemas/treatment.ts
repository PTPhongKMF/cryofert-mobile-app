import { createApiResponseSchema } from "@src/schemas/api-response";
import * as v from "valibot";

const TreatmentResponseSchema = v.object({
  id: v.string(),
  patientId: v.string(),
  doctorId: v.string(),
  treatmentName: v.string(),
  treatmentType: v.string(),
  startDate: v.string(),
  endDate: v.string(),
  status: v.string(),
  diagnosis: v.nullable(v.string()),
  goals: v.nullable(v.string()),
  notes: v.nullable(v.string()),
  estimatedCost: v.nullable(v.number()),
  actualCost: v.nullable(v.number()),
  createdAt: v.string(),
  updatedAt: v.nullable(v.string()),
});

////////////////////////////////////////////////////////

export const TreatmentApiResponseSchema = createApiResponseSchema(
  v.array(TreatmentResponseSchema)
);

////////////////////////////////////////////////////////

export type TreatmentApiResponse = v.InferOutput<
  typeof TreatmentApiResponseSchema
>;

////////////////////////////////////////////////////////

const IvfSchema = v.object({
  id: v.string(),
  treatmentId: v.string(),
  protocol: v.nullable(v.string()),
  stimulationStartDate: v.nullable(v.string()),
  oocyteRetrievalDate: v.nullable(v.string()),
  fertilizationDate: v.nullable(v.string()),
  transferDate: v.nullable(v.string()),
  oocytesRetrieved: v.nullable(v.number()),
  oocytesMature: v.nullable(v.number()),
  oocytesFertilized: v.nullable(v.number()),
  embryosCultured: v.nullable(v.number()),
  embryosTransferred: v.nullable(v.number()),
  embryosCryopreserved: v.nullable(v.number()),
  embryosFrozen: v.nullable(v.number()),
  notes: v.nullable(v.string()),
  outcome: v.nullable(v.string()),
  usedICSI: v.nullable(v.boolean()),
  complications: v.nullable(v.string()),
  status: v.string(),
  createdAt: v.string(),
  updatedAt: v.nullable(v.string()),
});

const IuiSchema = v.object({
  id: v.string(),
  treatmentId: v.string(),
  protocol: v.nullable(v.string()),
  medications: v.nullable(v.string()),
  monitoring: v.nullable(v.string()),
  ovulationTriggerDate: v.nullable(v.string()),
  inseminationDate: v.nullable(v.string()),
  motileSpermCount: v.nullable(v.number()),
  numberOfAttempts: v.nullable(v.number()),
  outcome: v.nullable(v.string()),
  notes: v.nullable(v.string()),
  status: v.string(),
  createdAt: v.string(),
  updatedAt: v.nullable(v.string()),
});

const BaseTreatmentDetailFields = {
  id: v.string(),
  patientId: v.string(),
  doctorId: v.string(),
  treatmentName: v.string(),
  startDate: v.string(),
  endDate: v.string(),
  status: v.string(),
  diagnosis: v.nullable(v.string()),
  goals: v.nullable(v.string()),
  notes: v.nullable(v.string()),
  estimatedCost: v.nullable(v.number()),
  actualCost: v.nullable(v.number()),
  createdAt: v.string(),
  updatedAt: v.nullable(v.string()),
};

export const TreatmentDetailSchema = v.variant("treatmentType", [
  v.object({
    ...BaseTreatmentDetailFields,
    treatmentType: v.literal("IVF"),
    ivf: IvfSchema,
  }),
  v.object({
    ...BaseTreatmentDetailFields,
    treatmentType: v.literal("IUI"),
    iui: IuiSchema,
  }),
  v.object({
    ...BaseTreatmentDetailFields,
    treatmentType: v.string(),
  }),
]);

export const TreatmentDetailApiResponseSchema =
  createApiResponseSchema(TreatmentDetailSchema);

////////////////////////////////////////////////////////

export type TreatmentDetail = v.InferOutput<typeof TreatmentDetailSchema>;
export type TreatmentDetailApiResponse = v.InferOutput<
  typeof TreatmentDetailApiResponseSchema
>;