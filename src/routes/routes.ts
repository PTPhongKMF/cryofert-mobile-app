const BASE = {
  ROOT: "/",
  MAIN_TABS: "/main-tabs",
} as const;

/////////////////////////////////////////////////////////

export const ROUTES = {
  ...BASE,
  TABS_HOME: `${BASE.MAIN_TABS}/home`,
  TABS_LOGIN: `${BASE.MAIN_TABS}/login`,
} as const;
