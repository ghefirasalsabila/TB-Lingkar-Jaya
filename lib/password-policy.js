export const PASSWORD_POLICY_MESSAGE =
  "Password minimal 8 karakter dan harus mengandung huruf, angka, serta simbol.";

export function isStrongPassword(value) {
  const password = String(value || "");

  return (
    password.length >= 8 &&
    Boolean(password.match(/[A-Za-z]/)) &&
    Boolean(password.match(/\d/)) &&
    Boolean(password.match(/[^A-Za-z0-9]/))
  );
}
