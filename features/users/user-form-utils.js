import { ROLE_LABELS, USER_ROLES } from "../../constants/roles";
import { isStrongPassword, PASSWORD_POLICY_MESSAGE } from "../../lib/password-policy";

export const USER_ROLE_OPTIONS = [
  { value: USER_ROLES.OWNER, label: ROLE_LABELS[USER_ROLES.OWNER] },
  { value: USER_ROLES.EMPLOYEE, label: ROLE_LABELS[USER_ROLES.EMPLOYEE] },
];

export const emptyUserForm = {
  name: "",
  email: "",
  password: "",
  role: USER_ROLES.EMPLOYEE,
  isActive: true,
};

export const DEFAULT_OWNER_EMAIL = "ghefiras19@gmail.com";
export const USERS_DEFAULT_PAGE = 1;
export const USERS_DEFAULT_LIMIT = 10;

const EMAIL_PATTERN = /.+@.+\..+/;

export function getUserFormInvalidState(form, submitAttempted) {
  return {
    invalidName: submitAttempted && form.name.trim().length < 2,
    invalidEmail: submitAttempted && (!form.email.trim() || !Boolean(form.email.trim().match(EMAIL_PATTERN))),
    invalidPassword: submitAttempted && !isStrongPassword(form.password),
  };
}

export function validateUserForm(form, isEditMode) {
  const issues = [];

  if (form.name.trim().length < 2) issues.push("Nama minimal 2 karakter.");
  if (!form.email.trim()) issues.push("Email wajib diisi.");
  if (!Boolean(form.email.trim().match(EMAIL_PATTERN))) issues.push("Format email tidak valid.");
  if (!USER_ROLE_OPTIONS.some((option) => option.value === String(form.role || ""))) issues.push("Peran tidak valid.");
  if (!isEditMode && !isStrongPassword(form.password)) issues.push(PASSWORD_POLICY_MESSAGE);

  return issues;
}
