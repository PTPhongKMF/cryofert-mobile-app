import type {
  RelationshipApiResponse,
  relationshipType,
} from "@src/schemas/relationship";
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

export interface RequestRelationship {
  patient1Id: string;
  patient2Id: string;
  relationshipType: relationshipType;
  establishedDate: string;
  isActive: boolean;
}

export async function requestRelationshipMutationFn(
  req: RequestRelationship
): Promise<void> {
  await httpClient.post("api/relationship", {
    json: {
      patient1Id: req.patient1Id,
      patient2Id: req.patient2Id,
      relationshipType: req.relationshipType,
      establishedDate: req.establishedDate,
      isActive: req.isActive,
    },
  });
}

export interface CancelRelationship {
  relationshipId: string;
  cancellationReason: string;
}

export async function cancelRelationshipMutationFn(
  req: CancelRelationship
): Promise<void> {
  await httpClient.post("api/relationship/cancel", {
    json: {
      relationshipId: req.relationshipId,
      cancellationReason: req.cancellationReason,
    },
  });
}