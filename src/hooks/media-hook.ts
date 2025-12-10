import type {
  MediaHtml,
  MediaHtmlApiResponse,
  MediaListApiResponse,
  MediaType,
} from "@src/schemas/media";
import type { HTTPError } from "ky";
import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  htmlPaperQueryFn,
  mediaQueryFn,
  type MediaQueryParams,
} from "@src/services/api-services/media-service";
import ky from "ky";

export function useMediaQuery(
  req?: MediaQueryParams,
  enabled: boolean = true
) {
  return useQuery<MediaListApiResponse, HTTPError>({
    queryKey: ["api/media", req],
    queryFn: () => mediaQueryFn(req),
    enabled,
  });
}

export function useHtmlPaperQuery(params: {
  relatedEntityType: MediaType;
  relatedEntityId: string;
  enabled?: boolean;
}) {
  const { relatedEntityId, relatedEntityType, enabled = true } = params;

  return useQuery<MediaHtmlApiResponse, HTTPError>({
    queryKey: [
      "api/media/html",
      relatedEntityType,
      relatedEntityId,
      enabled,
    ],
    queryFn: () =>
      htmlPaperQueryFn({
        relatedEntityId,
        relatedEntityType,
      }),
    enabled: enabled && !!relatedEntityId && !!relatedEntityType,
  });
}

interface ViewMediaResult {
  objectUrl: string;
  value: string;
  filePath: string;
}

// Keep it for later use
// export function useViewMediaQuery(
//   req?: MediaQueryParams,
//   enabled: boolean = true
// ) {
//   const previousUrlRef = useRef<string | null>(null);

//   const query = useQuery<ViewMediaResult, HTTPError>({
//     queryKey: ["api/media/view", req],
//     queryFn: async () => {
//       const media = await mediaQueryFn(req);
//       const filePath = media.data?.[0]?.filePath;

//       if (!filePath) {
//         throw new Error("Media file path not available");
//       }

//       const value = await ky.get(filePath).text();
//       const objectUrl = URL.createObjectURL(
//         new Blob([value], { type: "text/html" })
//       );

//       return { objectUrl, value, filePath };
//     },
//     enabled,
//   });

//   useEffect(() => {
//     const currentUrl = query.data?.objectUrl ?? null;
//     const previousUrl = previousUrlRef.current;

//     if (previousUrl && previousUrl !== currentUrl) {
//       URL.revokeObjectURL(previousUrl);
//     }

//     previousUrlRef.current = currentUrl;

//     return () => {
//       if (previousUrlRef.current) {
//         URL.revokeObjectURL(previousUrlRef.current);
//         previousUrlRef.current = null;
//       }
//     };
//   }, [query.data]);

//   return query;
// }
