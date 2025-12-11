import { titleCase } from "text-case";

export function toTitleCase(value: string, keepAbbreviation = true) {
  if (keepAbbreviation && value === value.toUpperCase()) {
    return value;
  }

  return titleCase(value);
}

