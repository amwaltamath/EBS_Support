import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import formidable from "formidable";
import { readDocuments, writeDocuments, readVendors, readUsers, getNextId } from "../db/init.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UPLOADS_DIR = path.join(__dirname, "..", "uploads");

const router = express.Router();

// Get documents for vendor
router.get("/vendor/:vendorId", (req, res) => {
  const documents = readDocuments();
  const vendorDocs = documents
    .filter((d) => d.vendor_id === parseInt(req.params.vendorId))
    .map((d) => {
      const users = readUsers();
      const uploader = users.find((u) => u.id === d.uploaded_by_id);
      return {
        ...d,
        uploaded_by: uploader?.name || "Unknown",
      };
    })
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  res.json(vendorDocs);
});

// Upload document
router.post("/upload", (req, res) => {
  const form = formidable({
    uploadDir: UPLOADS_DIR,
    keepExtensions: true,
    maxFileSize: 50 * 1024 * 1024,
    multiples: false,
  });

  // Ensure uploads dir exists
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({ error: "Upload failed" });
    }

    const vendorId = fields.vendorId?.[0];
    const title = fields.title?.[0];
    const uploadedBy = req.user?.userId;
    const file = files.file?.[0];

    if (!vendorId || !title || !file) {
      if (file?.filepath) {
        fs.unlinkSync(file.filepath);
      }
      return res.status(400).json({ error: "Vendor ID, title, and file required" });
    }

    // Verify vendor exists
    const vendors = readVendors();
    if (!vendors.some((v) => v.id === parseInt(vendorId))) {
      fs.unlinkSync(file.filepath);
      return res.status(404).json({ error: "Vendor not found" });
    }

    const documents = readDocuments();
    const newDoc = {
      id: getNextId("documents"),
      vendor_id: parseInt(vendorId),
      title,
      file_name: file.originalFilename,
      file_path: file.filepath,
      file_type: file.mimetype,
      file_size: file.size,
      uploaded_by_id: uploadedBy || null,
      created_at: new Date().toISOString(),
    };

    documents.push(newDoc);
    writeDocuments(documents);

    res.status(201).json({ id: newDoc.id, message: "Document uploaded" });
  });
});

// Download document
router.get("/:id/download", (req, res) => {
  const documents = readDocuments();
  const doc = documents.find((d) => d.id === parseInt(req.params.id));

  if (!doc) {
    return res.status(404).json({ error: "Document not found" });
  }

  if (!fs.existsSync(doc.file_path)) {
    return res.status(404).json({ error: "File not found on disk" });
  }

  res.download(doc.file_path, doc.file_name);
});

// Delete document
router.delete("/:id", (req, res) => {
  const documents = readDocuments();
  const index = documents.findIndex((d) => d.id === parseInt(req.params.id));

  if (index === -1) {
    return res.status(404).json({ error: "Document not found" });
  }

  const doc = documents[index];

  // Delete file from disk
  if (fs.existsSync(doc.file_path)) {
    fs.unlinkSync(doc.file_path);
  }

  documents.splice(index, 1);
  writeDocuments(documents);

  res.json({ message: "Document deleted" });
});

export default router;
