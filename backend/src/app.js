import express from "express";
import session from "express-session";
import authRoutes from "./routes/authRoutes.js";
import masterDataRoutes from "./routes/masterDataRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import scheduleRoutes from "./routes/scheduleRoutes.js";
import generateRoutes from "./routes/generateRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import { errorHandler, notFoundHandler } from "./middleware/errorMiddleware.js";

const app = express();

app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "sia-session-secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/auth", authRoutes);
app.use("/master", masterDataRoutes);
app.use("/attendance", attendanceRoutes);
app.use("/schedule", scheduleRoutes);
app.use("/generate", generateRoutes);
app.use("/reports", reportRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
