import jwt from "jsonwebtoken";
import { getUserById } from "../repositories/userRepository.js";

const jwtSecret = process.env.JWT_SECRET || "sia-jwt-secret";

export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (token) {
    try {
      const payload = jwt.verify(token, jwtSecret);
      const user = getUserById(payload.sub);
      if (!user) {
        return res.status(401).json({ message: "Invalid token user" });
      }
      req.user = user;
      return next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }
  }

  if (req.session?.userId) {
    const user = getUserById(req.session.userId);
    if (!user) {
      return res.status(401).json({ message: "Invalid session" });
    }
    req.user = user;
    return next();
  }

  return res.status(401).json({ message: "Authentication required" });
}

export function issueToken(user) {
  return jwt.sign({ sub: user.id, role: user.role }, jwtSecret, {
    expiresIn: "8h",
  });
}
