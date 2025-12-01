const BASE = {
  ROOT: "/",
  LANDING: "/landing",
  TABS: "/tabs",
  BOOK_TREATMENT: `/book-treatment`,

  PAYMENT_PORTAL: `/payment-portal`,

  TREATMENT: `/treatment`,
  APPOINTMENT: `/appointment`,
  TREATMENT_CYCLE: `/treatment-cycle`,

  UPDATE_ACCOUNT: `/update-account`,
  RELATIONSHIP: `/relationship`,
  TRANSACTION_HISTORY: `/transaction-history`,
} as const;

/////////////////////////////////////////////////////////

export const ROUTES = {
  ...BASE,

  L_HOME: `${BASE.LANDING}/home`,
  L_AUTH: `${BASE.LANDING}/auth`,

  T_HOME: `${BASE.TABS}/home`,
  T_SERVICE: `${BASE.TABS}/service`,
  T_HISTORY: `${BASE.TABS}/history`,
  T_SAMPLES: `${BASE.TABS}/samples`,
  T_ACCOUNT: `${BASE.TABS}/account`,
} as const;
