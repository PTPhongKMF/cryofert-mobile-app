import type {
  MediaListApiResponse,
  MediaType,
} from "@src/schemas/media";
import type { HTTPError } from "ky";
import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  mediaQueryFn,
  pdfPaperQueryFn,
  type MediaQueryParams,
} from "@src/services/api-services/media-service";

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

export interface PdfPaperResult {
  objectUrl: string;
  blob: Blob;
}

export function usePdfPaperQuery(params: {
  relatedEntityType: MediaType;
  relatedEntityId: string;
  enabled?: boolean;
}) {
  const { relatedEntityId, relatedEntityType, enabled = true } = params;
  const previousUrlRef = useRef<string | null>(null);

  const query = useQuery<PdfPaperResult, HTTPError>({
    queryKey: [
      "api/media/generate-pdf",
      relatedEntityType,
      relatedEntityId,
    ],
    queryFn: async () => {
      const blob = await pdfPaperQueryFn({
        relatedEntityId,
        relatedEntityType,
      });

      const objectUrl = URL.createObjectURL(
        new Blob([blob], { type: blob.type || "application/pdf" })
      );

      return { objectUrl, blob };
    },
    enabled: enabled && !!relatedEntityId && !!relatedEntityType,
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
  }, [query.data?.objectUrl]);

  return query;
}

// Keep it for later use
// export function useViewPdfMediaQuery(
//   req?: MediaQueryParams,
//   enabled: boolean = true
// ) {
//   const previousUrlRef = useRef<string | null>(null);

//   const query = useQuery<{ objectUrl: string; blob: Blob; filePath: string }, HTTPError>({
//     queryKey: ["api/media/view", req],
//     queryFn: async () => {
//       const media = await mediaQueryFn(req);
//       const filePath = media.data?.[0]?.filePath;

//       if (!filePath) {
//         throw new Error("Media file path not available");
//       }

//       const blob = await ky.get(filePath).blob();
//       const objectUrl = URL.createObjectURL(blob);

//       return { objectUrl, blob, filePath };
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
