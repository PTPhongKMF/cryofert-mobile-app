export interface FormatCurrencyOptions extends Intl.NumberFormatOptions {
  locale?: string;
  currency?: string;
}

export function formatCurrency(
  amount: number,
  { locale = "en-US", currency = "USD", ...options }: FormatCurrencyOptions = {},
) {
  if (amount === null || amount === undefined || Number.isNaN(amount)) {
    return "";
  }

  const formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    ...options,
  });

  return formatter.format(amount);
}

