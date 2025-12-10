const BASE = {
  ROOT: "/",
  LANDING: "/landing",
  TABS: "/tabs",

  BOOK_TREATMENT: `/book-treatment`,
  START_CONTRACT_FORM: `/start-contract-form`,
  START_CONTRACT_PAPER: `/start-contract-paper`,

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
  L_AUTH_LOGIN: `${BASE.LANDING}/auth/login`,
  L_AUTH_REGISTER: `${BASE.LANDING}/auth/register`,

  T_HOME: `${BASE.TABS}/home`,
  T_SERVICE: `${BASE.TABS}/service`,
  T_TREATMENT: `${BASE.TABS}/treatment`,
  T_SAMPLES: `${BASE.TABS}/lab-samples`,
  T_ACCOUNT: `${BASE.TABS}/account`,
} as const;
