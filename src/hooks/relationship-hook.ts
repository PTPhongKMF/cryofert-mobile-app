import type { RelationshipApiResponse } from "@src/schemas/relationship";
import type { RequestRelationship } from "@src/services/api-services/relationship-service";
import {
  requestRelationshipMutationFn,
  relationshipQueryFn,
} from "@src/services/api-services/relationship-service";
import { useLocalUserStore } from "@src/stores/user";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { HTTPError } from "ky";

export function useRelationshipQuery() {
  const localUser = useLocalUserStore((s) => s.localUser);

  return useQuery<RelationshipApiResponse, HTTPError>({
    queryKey: ["api/relationship/patient", localUser],
    queryFn: () => relationshipQueryFn(localUser?.id || ""),
    enabled: !!localUser?.id,
  });
}

export function useRequestRelationshipMutation() {
  return useMutation<void, HTTPError, RequestRelationship>({
    mutationFn: requestRelationshipMutationFn,
    onSuccess: () => console.log("Relationship request sent successfully"),
    onError: (e) => console.log("Error sending relationship request:", e),
  });
}
