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

export function getGreetingOfDay(): string {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    return "Good morning";
  } else if (hour >= 12 && hour < 17) {
    return "Good afternoon";
  } else if (hour >= 17 && hour < 22) {
    return "Good evening";
  } else if (hour >= 22 || hour < 5) {
    return "Good night";
  }
  
  return "Hello";
}