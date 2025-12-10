import { httpClient } from "@src/services/api-services/http-service";

export async function requestSignAgreementMutationFn(id: string) {
  await httpClient.post(`api/agreement/${id}/request-signature`);
}

export async function verifySignAgreementMutationFn(params: {
  id: string;
  otpCode: string;
}) {
  const form = new FormData();
  form.append("otpCode", params.otpCode);

  await httpClient.post(`api/agreement/${params.id}/verify-signature`, {
    body: form,
  });
}

