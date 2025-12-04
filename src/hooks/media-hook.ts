import type { MediaTemplateType } from "@src/schemas/media";
import type { HTTPError } from "ky";
import { useQuery } from "@tanstack/react-query";
import { mediaTemplateQueryFn } from "@src/services/api-services/media-service";
import ky from "ky";

export function useMediaTemplateQuery(
  templateType: MediaTemplateType,
  enabled: boolean = true
) {
  return useQuery<string, HTTPError>({
    queryKey: ["api/media/template", templateType],
    queryFn: async () => {
      const media = await mediaTemplateQueryFn({ templateType });

      if (!media.filePath) {
        throw new Error("Template source not available");
      }

      return ky.get(media.filePath).text();
    },
    enabled: enabled && !!templateType,
  });
}
