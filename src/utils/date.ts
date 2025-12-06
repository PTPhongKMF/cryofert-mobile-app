import { format } from "@formkit/tempo";

export function getDateOnly(d: string) {
  return d.split("T")[0];
}

export function safeFormat(date: string | Date, token: string) {
  try {
    return format(date, token);
  } catch {
    return format(new Date(), token);
  }
}