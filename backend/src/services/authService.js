import bcrypt from "bcryptjs";
import {
  findUserByUsername,
  updateUserPassword,
} from "../repositories/userRepository.js";

export function authenticateUser(username, password) {
  const user = findUserByUsername(username);
  if (!user) return null;
  const valid = bcrypt.compareSync(password, user.passwordHash);
  if (!valid) return null;
  return user;
}

export function resetPassword(userId, newPassword) {
  const passwordHash = bcrypt.hashSync(newPassword, 10);
  return updateUserPassword(userId, passwordHash);
}
