import { httpClient } from "@src/services/api-services/http-service";
import * as v from "valibot";
import {
  MediaListApiResponseSchema,
  type MediaListApiResponse,
  type MediaType,
} from "@src/schemas/media";

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

export async function pdfPaperQueryFn(params: {
  relatedEntityType: MediaType;
  relatedEntityId: string;
}): Promise<Blob> {
  // NOTE: backend expects PascalCase query param keys
  return await httpClient
    .get("api/media/generate-pdf", {
      searchParams: {
        RelatedEntityType: params.relatedEntityType,
        RelatedEntityId: params.relatedEntityId,
      },
    })
    .blob();
}
