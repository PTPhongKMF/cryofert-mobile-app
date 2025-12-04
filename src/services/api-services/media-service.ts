import { httpClient } from "@src/services/api-services/http-service";
import * as v from "valibot";
import {
  MediaTemplateApiResponseSchema,
  type MediaResponse,
  type MediaTemplateType,
} from "@src/schemas/media";

export async function mediaTemplateQueryFn(params: {
  templateType: MediaTemplateType;
}): Promise<MediaResponse> {
  const res = await httpClient
    .get("api/media/template", {
      searchParams: {
        templateType: params.templateType,
      },
    })
    .json();

  const parsed = v.parse(MediaTemplateApiResponseSchema, res);

  return parsed.data;
}

