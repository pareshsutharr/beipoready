export const HARDCODED_ADMIN_EMAIL = "pareshsutharr@gmail.com";
export const HARDCODED_ADMIN_PASSWORD = "Paresh@7359";

export const ADMIN_SESSION_COOKIE = "beipoready_admin";
export const ADMIN_SESSION_VALUE = "beipoready-admin-paresh-7359-session";

export function isHardcodedAdmin(email: string, password: string) {
  return (
    email.trim().toLowerCase() === HARDCODED_ADMIN_EMAIL &&
    password === HARDCODED_ADMIN_PASSWORD
  );
}

export function hasHardcodedAdminSession(value: string | undefined) {
  return value === ADMIN_SESSION_VALUE;
}
