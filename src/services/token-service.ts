import { SecureStorage } from "@aparajita/capacitor-secure-storage";

const TokenKeys = {
  ACCESS_TOKEN: "access-token",
  REFRESH_TOKEN: "refresh-token",
} as const;

type TokenKey = (typeof TokenKeys)[keyof typeof TokenKeys];

export async function getSecuredToken(key: TokenKey) {
  const token = await SecureStorage.get(key);

  return token?.toString();
}

export async function setSecuredToken(key: TokenKey, value: string) {
  await SecureStorage.set(key, value);
}
