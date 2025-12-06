import type { MediaListApiResponse, MediaType } from "@src/schemas/media";
import type { HTTPError } from "ky";
import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  mediaQueryFn,
  mediaTemplateQueryFn,
  type MediaQueryParams,
} from "@src/services/api-services/media-service";
import ky from "ky";

export function useMediaTemplateQuery(
  templateType: MediaType,
  enabled: boolean = true
) {
  return useQuery<string, HTTPError>({
    queryKey: ["api/media/template", templateType, enabled],
    queryFn: async () => {
      const media = await mediaTemplateQueryFn({ templateType });

      const filePath = media.data.filePath;

      if (!filePath) {
        throw new Error("Template source not available");
      }

      return ky.get(filePath).text();
    },
    enabled: enabled && !!templateType,
  });
}

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

interface ViewMediaResult {
  objectUrl: string;
  value: string;
  filePath: string;
}

export function useViewMediaQuery(
  req?: MediaQueryParams,
  enabled: boolean = true
) {
  const previousUrlRef = useRef<string | null>(null);

  const query = useQuery<ViewMediaResult, HTTPError>({
    queryKey: ["api/media/view", req],
    queryFn: async () => {
      const media = await mediaQueryFn(req);
      const filePath = media.data?.[0]?.filePath;

      if (!filePath) {
        throw new Error("Media file path not available");
      }

      const value = await ky.get(filePath).text();
      const objectUrl = URL.createObjectURL(
        new Blob([value], { type: "text/html" })
      );

      return { objectUrl, value, filePath };
    },
    enabled,
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
