import type { RelationshipApiResponse } from "@src/schemas/relationship";
import { RelationshipApiResponseSchema } from "@src/schemas/relationship";
import { httpClient } from "@src/services/api-services/http-service";
import * as v from "valibot";

export async function relationshipQueryFn(
  patientId: string
): Promise<RelationshipApiResponse> {
  const res = await httpClient
    .get(`api/relationship/patient/${patientId}`)
    .json();

  return v.parse(RelationshipApiResponseSchema, res);
}

export async function requestRelationshipMutationFn(req: {
  patientId: string;
  partnerId: string;
  relationshipType: string;
  notes: string;
}): Promise<void> {
  await httpClient.post("api/relationship", {
    json: {
      patient1Id: req.patientId,
      patient2Id: req.partnerId,
      relationshipType: req.relationshipType,
      notes: req.notes,
    },
  });
}
