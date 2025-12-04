import { useMutation } from "@tanstack/react-query";
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

export function useBuildAgreementTemplateMutation() {
  return useMutation<string, Error, AgreementTemplatePayload>({
    mutationFn: async ({ template, variables }) => {
      const eta = new Eta();
      return await eta.renderStringAsync(template, variables);
    },
    onError: (e) => console.log(e),
  });
}
