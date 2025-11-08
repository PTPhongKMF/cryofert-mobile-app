import { getSecuredToken, setSecuredToken } from "@src/services/token-service";
import * as v from "valibot";
import ky from "ky";
import { GenericApiResponseSchema } from "@src/schemas/api-response";

// const LOCAL = "";
const CLOUD = "https://cryofert.runasp.net/";

// Dummy placeholders for refresh flow; refine later as needed
const REFRESH_ENDPOINT = "/auth/refresh";
type RefreshRequest = { refreshToken: string };
type RefreshResponse = { accessToken: string; refreshToken?: string };

let refreshPromise: Promise<void> | null = null;

export const httpClient = ky.extend({
  prefixUrl: CLOUD,
  hooks: {
    beforeRequest: [
      async (request) => {
        const accessToken = await getSecuredToken("access-token");

        if (accessToken) {
          request.headers.set("Authorization", `Bearer ${accessToken}`);
        }
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        const alreadyRetried =
          request.headers.get("x-retried-after-refresh") === "1";

        if (response.status === 401 && !alreadyRetried) {
          try {
            if (!refreshPromise) {
              refreshPromise = (async () => {
                const refreshToken = await getSecuredToken("refresh-token");
                if (!refreshToken)
                  throw new Error("No refresh token available");

                const refreshResponse = await ky
                  .post(REFRESH_ENDPOINT, {
                    prefixUrl: CLOUD,
                    retry: 0,
                    json: { refreshToken } as RefreshRequest,
                  })
                  .json<RefreshResponse>();

                if (!refreshResponse?.accessToken)
                  throw new Error("Invalid refresh response");

                await setSecuredToken(
                  "access-token",
                  refreshResponse.accessToken
                );
                if (refreshResponse.refreshToken) {
                  await setSecuredToken(
                    "refresh-token",
                    refreshResponse.refreshToken
                  );
                }
              })().finally(() => {
                refreshPromise = null;
              });
            }

            await refreshPromise;

            const clonedHeaders = new Headers(request.headers);
            clonedHeaders.set("x-retried-after-refresh", "1");

            const retryRequest = new Request(request, {
              headers: clonedHeaders,
            });

            return httpClient(retryRequest, options);
          } catch {
            /* ignore */
          }
        }

        return response;
      },
    ],
    beforeError: [
      async (error) => {
        const errorRes = await error.response.clone().json();

        const result = v.safeParse(GenericApiResponseSchema, errorRes);
        if (result.success) {
          error.name = result.output.code.toString();
          error.message = result.output.message;
        }

        return error;
      },
    ],
  },
});
