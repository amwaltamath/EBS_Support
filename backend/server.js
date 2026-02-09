import express from "express";
import cors from "cors";
import { initializeDb } from "./db/init.js";
import { authenticateToken } from "./middleware/auth.js";

// Routes
import authRoutes from "./routes/auth.js";
import teamRoutes from "./routes/team.js";
import vendorRoutes from "./routes/vendors.js";
import documentRoutes from "./routes/documents.js";

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
initializeDb();

// Public routes
app.use("/api/auth", authRoutes);

// Protected routes
app.use("/api/team", authenticateToken, teamRoutes);
app.use("/api/vendors", authenticateToken, vendorRoutes);
app.use("/api/documents", authenticateToken, documentRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "EBS Support API running" });
});

app.listen(PORT, () => {
  console.log(`✓ Backend server running at http://localhost:${PORT}`);
  console.log(`✓ Admin login: admin@ebs-support.local / admin123`);
});
