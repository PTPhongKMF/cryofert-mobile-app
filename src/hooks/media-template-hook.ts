import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Eta } from "eta/core";

export interface AgreementTemplateVariables {
  patient: {
    name: string;
    dob: string;
    nationalId: string;
    address: string;
    phone: string;
  };
  spouse?: {
    name: string;
    dob: string;
    nationalId: string;
  };
  serviceType: "IUI" | "IVF";
  date: string;
  signatures: {
    patient: boolean;
    spouse?: boolean;
    facility: boolean;
  };
}

export interface AgreementTemplatePayload {
  template: string;
  variables: AgreementTemplateVariables;
}

export interface AgreementTemplateRenderResult {
  value: string;
  objectUrl: string;
}

export function useBuildAgreementTemplateQuery(
  payload: AgreementTemplatePayload | null
) {
  const previousUrlRef = useRef<string | null>(null);

  const query = useQuery<AgreementTemplateRenderResult, Error>({
    queryKey: ["agreement-template", payload],
    queryFn: async () => {
      if (!payload) throw new Error("No payload");

      const eta = new Eta();
      const value = await eta.renderStringAsync(
        payload.template,
        payload.variables
      );
      const blob = new Blob([value], { type: "text/html" });
      const objectUrl = URL.createObjectURL(blob);
      return { value, objectUrl };
    },
    enabled: Boolean(payload),
    staleTime: Infinity,
    gcTime: 0,
  });

  useEffect(() => {
    const currentUrl = query.data?.objectUrl ?? null;
    const previousUrl = previousUrlRef.current;

    if (previousUrl && previousUrl !== currentUrl) {
      URL.revokeObjectURL(previousUrl);
    }

    previousUrlRef.current = currentUrl;

    return () => {
      if (previousUrlRef.current) {
        URL.revokeObjectURL(previousUrlRef.current);
        previousUrlRef.current = null;
      }
    };
  }, [query.data]);

  return query;
}
