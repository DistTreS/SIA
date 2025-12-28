import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

const users = [];

function seedAdmin() {
  if (users.length > 0) return;
  const passwordHash = bcrypt.hashSync("admin123", 10);
  users.push({
    id: randomUUID(),
    username: "admin",
    role: "admin",
    passwordHash,
  });
}

seedAdmin();

export function findUserByUsername(username) {
  return users.find((user) => user.username === username);
}

export function getUserById(id) {
  return users.find((user) => user.id === id);
}

export function updateUserPassword(id, passwordHash) {
  const user = getUserById(id);
  if (!user) return null;
  user.passwordHash = passwordHash;
  return user;
}

export function listUsers() {
  return [...users];
}

export function createUser({ username, role, passwordHash }) {
  const user = { id: randomUUID(), username, role, passwordHash };
  users.push(user);
  return user;
}
