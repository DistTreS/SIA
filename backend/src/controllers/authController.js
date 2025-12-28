import { authenticateUser, resetPassword } from "../services/authService.js";
import { issueToken } from "../middleware/authMiddleware.js";
import { listUsers } from "../repositories/userRepository.js";

export function login(req, res) {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }
  const user = authenticateUser(username, password);
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  req.session.userId = user.id;
  const token = issueToken(user);
  return res.json({
    token,
    user: { id: user.id, username: user.username, role: user.role },
  });
}

export function logout(req, res) {
  req.session.destroy(() => {
    res.json({ message: "Logged out" });
  });
}

export function resetPasswordHandler(req, res) {
  const { newPassword } = req.body;
  if (!newPassword) {
    return res.status(400).json({ message: "New password required" });
  }
  const updated = resetPassword(req.user.id, newPassword);
  if (!updated) {
    return res.status(404).json({ message: "User not found" });
  }
  return res.json({ message: "Password updated" });
}

export function listUsersHandler(_req, res) {
  const users = listUsers().map((user) => ({
    id: user.id,
    username: user.username,
    role: user.role,
  }));
  res.json({ users });
}
