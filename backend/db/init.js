import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, "data");
const FILES = {
  users: path.join(DATA_DIR, "users.json"),
  teamMembers: path.join(DATA_DIR, "team_members.json"),
  vendors: path.join(DATA_DIR, "vendors.json"),
  documents: path.join(DATA_DIR, "documents.json"),
};

// Ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Read JSON file or return empty array
function readFile(filepath) {
  if (fs.existsSync(filepath)) {
    return JSON.parse(fs.readFileSync(filepath, "utf-8"));
  }
  return [];
}

// Write JSON file
function writeFile(filepath, data) {
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
}

export function initializeDb() {
  ensureDataDir();

  // Create files if they don't exist
  Object.values(FILES).forEach((file) => {
    if (!fs.existsSync(file)) {
      writeFile(file, []);
    }
  });

  // Seed default admin user if none exists
  const users = readFile(FILES.users);
  const adminExists = users.some((u) => u.role === "admin");

  if (!adminExists) {
    const adminPassword = bcrypt.hashSync("admin123", 10);
    const admin = {
      id: 1,
      email: "admin@ebs-support.local",
      password_hash: adminPassword,
      name: "Admin User",
      role: "admin",
      created_at: new Date().toISOString(),
    };
    users.push(admin);
    writeFile(FILES.users, users);

    // Create associated team member
    const teamMembers = readFile(FILES.teamMembers);
    const teamMember = {
      id: 1,
      user_id: 1,
      title: "System Administrator",
      department: "IT",
      phone: null,
      created_at: new Date().toISOString(),
    };
    teamMembers.push(teamMember);
    writeFile(FILES.teamMembers, teamMembers);
  }

  console.log("✓ Database initialized at", DATA_DIR);
}

// Database interface that mimics better-sqlite3
export class SimpleDB {
  prepare(sql) {
    return new Statement(sql);
  }

  exec(sql) {
    // No-op for schema execution
  }
}

class Statement {
  constructor(sql) {
    this.sql = sql;
  }

  run(...params) {
    // Execute SQL command (insert/update/delete)
    // Implementation handled in routes
    return { lastInsertRowid: Date.now() };
  }

  get(...params) {
    // Return single row
    return null;
  }

  all(...params) {
    // Return all matching rows
    return [];
  }
}

export function getDb() {
  return new SimpleDB();
}

// Helper functions for data access
export function readUsers() {
  return readFile(FILES.users);
}

export function writeUsers(data) {
  writeFile(FILES.users, data);
}

export function readTeamMembers() {
  return readFile(FILES.teamMembers);
}

export function writeTeamMembers(data) {
  writeFile(FILES.teamMembers, data);
}

export function readVendors() {
  return readFile(FILES.vendors);
}

export function writeVendors(data) {
  writeFile(FILES.vendors, data);
}

export function readDocuments() {
  return readFile(FILES.documents);
}

export function writeDocuments(data) {
  writeFile(FILES.documents, data);
}

export function getNextId(collection) {
  const data = collection === "users" ? readUsers() : 
               collection === "team_members" ? readTeamMembers() :
               collection === "vendors" ? readVendors() :
               readDocuments();
  return data.length > 0 ? Math.max(...data.map((item) => item.id)) + 1 : 1;
}
