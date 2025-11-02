const BASE = {
  ROOT: "/",
  TABS: "/tabs",
} as const;

export const ROUTES = {
  ...BASE,
  TABS_HOME: `${BASE.TABS}/home`,
  TABS_LOGIN: `${BASE.TABS}/login`,
} as const;
