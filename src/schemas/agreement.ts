import * as v from "valibot";

const AgreementStatus = v.picklist([
  "Pending",
  "Active",
  "Completed",
  "Canceled",
]);


export const AgreementResponseSchema = v.object({
  id: v.string(),
  agreementCode: v.string(),
  treatmentId: v.string(),
  treatmentName: v.string(),
  patientId: v.string(),
  patientName: v.string(),
  startDate: v.string(),
  endDate: v.string(),
  totalAmount: v.number(),
  status: AgreementStatus,
  statusName: v.string(),
  signedByPatient: v.boolean(),
  signedByDoctor: v.boolean(),
  fileUrl: v.nullable(v.string()),
  signedDate: v.nullable(v.string()),
  signatureMethod: v.nullable(v.string()),
  signatureIPAddress: v.nullable(v.string()),
  otpSentDate: v.nullable(v.string()),
  createdAt: v.string(),
  updatedAt: v.nullable(v.string()),
});

export type AgreementStatusType = v.InferInput<typeof AgreementStatus>;
export type AgreementResponse = v.InferOutput<typeof AgreementResponseSchema>;
