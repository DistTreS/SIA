import jwt from "jsonwebtoken";
import { ambilPenggunaById } from "../modul/otentikasi/repository.js";

const jwtSecret = process.env.JWT_SECRET || "sia-jwt-secret";

export async function otentikasi(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (token) {
      let payload;
      try {
        payload = jwt.verify(token, jwtSecret);
      } catch (error) {
        return res.status(401).json({ message: "Token tidak valid" });
      }
      const user = await ambilPenggunaById(payload.sub);
      if (!user) {
        return res.status(401).json({ message: "Token tidak valid" });
      }
      req.user = user;
      return next();
    }

    if (req.session?.userId) {
      const user = await ambilPenggunaById(req.session.userId);
      if (!user) {
        return res.status(401).json({ message: "Sesi tidak valid" });
      }
      req.user = user;
      return next();
    }

    return res.status(401).json({ message: "Autentikasi diperlukan" });
  } catch (error) {
    return next(error);
  }
}

export function terbitkanToken(user) {
  return jwt.sign({ sub: user.id, peran: user.peran }, jwtSecret, {
    expiresIn: "8h",
  });
}
