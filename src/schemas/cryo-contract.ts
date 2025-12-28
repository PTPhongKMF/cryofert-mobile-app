import { createApiResponseSchema } from "@src/schemas/api-response";
import { LabSampleTypeSchema } from "@src/schemas/lab-sample";
import * as v from "valibot";

export const CryoContractStatuses = [
  "Active",
  "Expired",
  "Terminated",
  "Renewed",
  "Draft",
  "Pending",
] as const;
export const CryoContractStatusSchema = v.picklist(CryoContractStatuses);

export const CryoContractResponseSchema = v.object({
  id: v.string(),
  contractNumber: v.string(),
  startDate: v.string(),
  endDate: v.string(),
  status: CryoContractStatusSchema,
  totalAmount: v.number(),
  paidAmount: v.number(),
  signedDate: v.nullable(v.string()),
  signedBy: v.nullable(v.string()),
  notes: v.nullable(v.string()),
  patientId: v.string(),
  patientName: v.nullable(v.string()),
  cryoPackageId: v.string(),
  cryoPackageName: v.string(),
  createdAt: v.string(),
  updatedAt: v.nullable(v.string()),
});

export const CryoContractDetailResponseSchema = v.object({
  ...CryoContractResponseSchema.entries,

  samples: v.array(
    v.object({
      id: v.string(),
      labSampleId: v.string(),
      sampleCode: v.string(),
      sampleType: LabSampleTypeSchema,
      storageDate: v.nullable(v.string()),
      storageLocation: v.nullable(v.string()),
      isActive: v.boolean(),
    })
  ),
});

///////////////////////////////////////////////////////////////////////

export const CryoContractApiResponseSchema = createApiResponseSchema(
  CryoContractResponseSchema
);
export const CryoContractListApiResponseSchema = createApiResponseSchema(
  v.array(CryoContractResponseSchema)
);

export const CryoContractDetailApiResponseSchema = createApiResponseSchema(
  CryoContractDetailResponseSchema
);

///////////////////////////////////////////////////////////////////////
// Start contract form (existing)

export const StartContractFormSchema = v.pipe(
  v.object({
    formSampleType: LabSampleTypeSchema,
    cryoPackageId: v.pipe(v.string(), v.nonEmpty("Required")),
    cryoPackageMaxSamples: v.number(),
    samples: v.pipe(
      v.array(
        v.object({
          labSampleId: v.pipe(v.string(), v.nonEmpty("Required")),
          sampleType: LabSampleTypeSchema,
        })
      ),
      v.nonEmpty("Require at least one")
    ),
  }),
  v.forward(
    v.partialCheck(
      [["formSampleType"], ["samples"]],
      (input) =>
        Array.isArray(input.samples) &&
        input.samples.every(
          (sample) => sample.sampleType === input.formSampleType
        ),
      "All samples must match the form sample type"
    ),
    ["samples"]
  ),
  v.forward(
    v.partialCheck(
      [["cryoPackageMaxSamples"], ["samples"]],
      (input) =>
        typeof input.cryoPackageMaxSamples === "number" &&
        Array.isArray(input.samples) &&
        input.samples.length <= input.cryoPackageMaxSamples,
      "Selected samples exceed the package limit"
    ),
    ["samples"]
  )
);

///////////////////////////////////////////////////////////////////////

export type CryoContractResponse = v.InferOutput<
  typeof CryoContractResponseSchema
>;
export type CryoContractListApiResponse = v.InferOutput<
  typeof CryoContractListApiResponseSchema
>;
export type CryoContractStatus = v.InferOutput<typeof CryoContractStatusSchema>;
export type CryoContractApiResponse = v.InferOutput<
  typeof CryoContractApiResponseSchema
>;
export type CryoContractDetailApiResponse = v.InferOutput<
  typeof CryoContractDetailApiResponseSchema
>;
export type CryoContractDetailResponse = v.InferOutput<
  typeof CryoContractDetailResponseSchema
>;

export type StartContractForm = v.InferOutput<typeof StartContractFormSchema>;
