const BASE = {
  ROOT: "/",
  TABS: "/tabs",
} as const;

/////////////////////////////////////////////////////////

export const ROUTES = {
  ...BASE,
  HOME: `${BASE.TABS}/home`,
  AUTH: `${BASE.TABS}/auth`,
  AUTH_LOGIN: `${BASE.TABS}/auth/:tab(login)`,
  AUTH_REGISTER: `${BASE.TABS}/auth/:tab(register)`,
} as const;
