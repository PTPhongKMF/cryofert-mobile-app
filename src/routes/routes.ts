const BASE = {
  ROOT: "/",
  LANDING: "/landing",
  TABS: "/tabs",
  BOOK_TREATMENT: `/book-treatment`,
  UPDATE_ACCOUNT: `/update-account`,

  PAYMENT_PORTAL: `/payment-portal`,
  TRANSACTION_HISTORY: `/transaction-history`,

  TREATMENT_DETAIL: `/treatment`,
} as const;

/////////////////////////////////////////////////////////

export const ROUTES = {
  ...BASE,

  L_HOME: `${BASE.LANDING}/home`,
  L_AUTH: `${BASE.LANDING}/auth`,

  T_HOME: `${BASE.TABS}/home`,
  T_SERVICE: `${BASE.TABS}/service`,
  T_HISTORY: `${BASE.TABS}/history`,
  T_ACCOUNT: `${BASE.TABS}/account`,
} as const;
