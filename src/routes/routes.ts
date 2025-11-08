const BASE = {
  ROOT: "/",
  LANDING: "/landing",
  TABS: "/tabs",
} as const;

/////////////////////////////////////////////////////////

export const ROUTES = {
  ...BASE,
  L_HOME: `${BASE.LANDING}/home`,
  L_AUTH: `${BASE.LANDING}/auth`,

  AUTH_LOGIN: `${BASE.LANDING}/auth/login`,
  AUTH_REGISTER: `${BASE.LANDING}/auth/register`,

  T_HOME: `${BASE.TABS}/home`,
  T_SERVICE: `${BASE.TABS}/service`,
  T_HISTORY: `${BASE.TABS}/history`,
  T_PROFILE: `${BASE.TABS}/profile`,
} as const;
