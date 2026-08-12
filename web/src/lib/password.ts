import crypto from "crypto";

// Ported 1:1 from utils/passwordUtils.js in the old Express app so the
// existing admin password keeps working without a reset.

export function genPassword(password: string) {
  const salt = crypto.randomBytes(32).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");

  return { salt, hash };
}

export function validPassword(password: string, hash: string, salt: string) {
  const hashVerify = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");
  return hash === hashVerify;
}
