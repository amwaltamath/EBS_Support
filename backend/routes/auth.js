import express from "express";
import bcrypt from "bcrypt";
import { generateToken } from "../middleware/auth.js";
import {
  readUsers,
  writeUsers,
  readTeamMembers,
  writeTeamMembers,
  getNextId,
} from "../db/init.js";

const router = express.Router();

// Login
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  const users = readUsers();
  const user = users.find((u) => u.email === email);

  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const token = generateToken(user.id, user.role);
  res.json({
    token,
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  });
});

// Register (admin only for MVP)
router.post("/register", (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: "Email, password, and name required" });
  }

  const users = readUsers();
  if (users.some((u) => u.email === email)) {
    return res.status(409).json({ error: "Email already in use" });
  }

  const passwordHash = bcrypt.hashSync(password, 10);
  const userId = getNextId("users");

  const newUser = {
    id: userId,
    email,
    password_hash: passwordHash,
    name,
    role: "viewer",
    created_at: new Date().toISOString(),
  };

  users.push(newUser);
  writeUsers(users);

  // Create associated team member
  const teamMembers = readTeamMembers();
  const teamMemberId = getNextId("team_members");
  teamMembers.push({
    id: teamMemberId,
    user_id: userId,
    title: null,
    department: null,
    phone: null,
    created_at: new Date().toISOString(),
  });
  writeTeamMembers(teamMembers);

  res.status(201).json({ message: "User created successfully" });
});

// Get current user
router.get("/me", (req, res) => {
  const users = readUsers();
  const user = users.find((u) => u.id === req.user.userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json({ id: user.id, email: user.email, name: user.name, role: user.role });
});

export default router;
