export const USER_ROLES = {
  OWNER: "OWNER",
  EMPLOYEE: "EMPLOYEE",
};

export const ROLE_LABELS = {
  [USER_ROLES.OWNER]: "Pemilik",
  [USER_ROLES.EMPLOYEE]: "Karyawan",
};

export function isOwnerRole(role) {
  return role === USER_ROLES.OWNER;
}
