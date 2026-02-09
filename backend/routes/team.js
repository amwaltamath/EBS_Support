import express from "express";
import { readTeamMembers, writeTeamMembers, readUsers } from "../db/init.js";

const router = express.Router();

// Get all team members
router.get("/", (req, res) => {
  const teamMembers = readTeamMembers();
  const users = readUsers();

  const result = teamMembers.map((tm) => {
    const user = users.find((u) => u.id === tm.user_id);
    return {
      id: tm.id,
      user_id: tm.user_id,
      name: user?.name || "Unknown",
      email: user?.email || "",
      title: tm.title,
      department: tm.department,
      phone: tm.phone,
      created_at: tm.created_at,
    };
  });

  res.json(result);
});

// Get team member by ID
router.get("/:id", (req, res) => {
  const teamMembers = readTeamMembers();
  const users = readUsers();
  const member = teamMembers.find((tm) => tm.id === parseInt(req.params.id));

  if (!member) {
    return res.status(404).json({ error: "Team member not found" });
  }

  const user = users.find((u) => u.id === member.user_id);
  res.json({
    id: member.id,
    user_id: member.user_id,
    name: user?.name || "Unknown",
    email: user?.email || "",
    title: member.title,
    department: member.department,
    phone: member.phone,
    created_at: member.created_at,
  });
});

// Update team member
router.put("/:id", (req, res) => {
  const { title, department, phone } = req.body;
  const teamMembers = readTeamMembers();

  const member = teamMembers.find((tm) => tm.id === parseInt(req.params.id));
  if (!member) {
    return res.status(404).json({ error: "Team member not found" });
  }

  member.title = title || null;
  member.department = department || null;
  member.phone = phone || null;

  writeTeamMembers(teamMembers);
  res.json({ message: "Team member updated" });
});

// Delete team member
router.delete("/:id", (req, res) => {
  const teamMembers = readTeamMembers();
  const index = teamMembers.findIndex((tm) => tm.id === parseInt(req.params.id));

  if (index === -1) {
    return res.status(404).json({ error: "Team member not found" });
  }

  teamMembers.splice(index, 1);
  writeTeamMembers(teamMembers);

  res.json({ message: "Team member deleted" });
});

export default router;
