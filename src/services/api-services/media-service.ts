import { httpClient } from "@src/services/api-services/http-service";
import * as v from "valibot";
import {
  MediaListApiResponseSchema,
  MediaTemplateApiResponseSchema,
  type MediaListApiResponse,
  type MediaTemplateApiResponse,
  type MediaType,
} from "@src/schemas/media";

export async function mediaTemplateQueryFn(params: {
  templateType: MediaType;
}): Promise<MediaTemplateApiResponse> {
  const res = await httpClient
    .get("api/media/template", {
      searchParams: {
        templateType: params.templateType,
      },
    })
    .json();

  return v.parse(MediaTemplateApiResponseSchema, res);
}

export type MediaQueryParams = {
  relatedEntityId?: string;
  relatedEntityType?: MediaType;
};

export async function mediaQueryFn(
  params?: MediaQueryParams
): Promise<MediaListApiResponse> {
  const res = await httpClient
    .get("api/media", {
      searchParams: {
        relatedEntityId: params?.relatedEntityId,
        relatedEntityType: params?.relatedEntityType,
        sort: "uploadDate",
        order: "desc",
      },
    })
    .json();

  return v.parse(MediaListApiResponseSchema, res);
}
