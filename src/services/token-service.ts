import { SecureStorage } from "@aparajita/capacitor-secure-storage";

export async function getSecuredToken(key: string) {
  const token = await SecureStorage.get(key);

  return token?.toString();
}

export async function setSecuredToken(key: string, value: string) {
  const token = await SecureStorage.get(key);
}
