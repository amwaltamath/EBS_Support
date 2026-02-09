import express from "express";
import { readVendors, writeVendors, readTeamMembers, readUsers, getNextId } from "../db/init.js";

const router = express.Router();

// Helper to get vendor with contact info
function enrichVendor(vendor) {
  const teamMembers = readTeamMembers();
  const users = readUsers();

  const getContactInfo = (contactId) => {
    if (!contactId) return {};
    const tm = teamMembers.find((t) => t.id === contactId);
    const user = users.find((u) => u.id === tm?.user_id);
    return {
      primary_contact_name: user?.name,
      primary_contact_email: user?.email,
    };
  };

  return {
    ...vendor,
    ...getContactInfo(vendor.primary_contact_id),
    primary_contact_name: teamMembers.find((t) => t.id === vendor.primary_contact_id)
      ? users.find((u) => u.id === teamMembers.find((t) => t.id === vendor.primary_contact_id)?.user_id)?.name
      : null,
    secondary_contact_name: teamMembers.find((t) => t.id === vendor.secondary_contact_id)
      ? users.find((u) => u.id === teamMembers.find((t) => t.id === vendor.secondary_contact_id)?.user_id)?.name
      : null,
  };
}

// Get all vendors
router.get("/", (req, res) => {
  const vendors = readVendors();
  const enriched = vendors.map(enrichVendor);
  res.json(enriched);
});

// Get vendor by ID with documents
router.get("/:id", (req, res) => {
  const vendors = readVendors();
  const vendor = vendors.find((v) => v.id === parseInt(req.params.id));

  if (!vendor) {
    return res.status(404).json({ error: "Vendor not found" });
  }

  res.json({
    ...enrichVendor(vendor),
    documents: [],
  });
});

// Create vendor
router.post("/", (req, res) => {
  const {
    name,
    product,
    account_rep,
    account_rep_phone,
    account_rep_email,
    support_level,
    notes,
    primary_contact_id,
    secondary_contact_id,
  } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Vendor name required" });
  }

  const vendors = readVendors();
  if (vendors.some((v) => v.name === name)) {
    return res.status(409).json({ error: "Vendor already exists" });
  }

  const newVendor = {
    id: getNextId("vendors"),
    name,
    product: product || null,
    account_rep: account_rep || null,
    account_rep_phone: account_rep_phone || null,
    account_rep_email: account_rep_email || null,
    support_level: support_level || "standard",
    notes: notes || null,
    primary_contact_id: primary_contact_id || null,
    secondary_contact_id: secondary_contact_id || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  vendors.push(newVendor);
  writeVendors(vendors);

  res.status(201).json({ id: newVendor.id, message: "Vendor created" });
});

// Update vendor
router.put("/:id", (req, res) => {
  const {
    name,
    product,
    account_rep,
    account_rep_phone,
    account_rep_email,
    support_level,
    notes,
    primary_contact_id,
    secondary_contact_id,
  } = req.body;

  const vendors = readVendors();
  const vendor = vendors.find((v) => v.id === parseInt(req.params.id));

  if (!vendor) {
    return res.status(404).json({ error: "Vendor not found" });
  }

  vendor.name = name || vendor.name;
  vendor.product = product !== undefined ? product : vendor.product;
  vendor.account_rep = account_rep || vendor.account_rep;
  vendor.account_rep_phone = account_rep_phone || vendor.account_rep_phone;
  vendor.account_rep_email = account_rep_email || vendor.account_rep_email;
  vendor.support_level = support_level || vendor.support_level;
  vendor.notes = notes || vendor.notes;
  vendor.primary_contact_id = primary_contact_id || vendor.primary_contact_id;
  vendor.secondary_contact_id = secondary_contact_id || vendor.secondary_contact_id;
  vendor.updated_at = new Date().toISOString();

  writeVendors(vendors);
  res.json({ message: "Vendor updated" });
});

// Delete vendor
router.delete("/:id", (req, res) => {
  const vendors = readVendors();
  const index = vendors.findIndex((v) => v.id === parseInt(req.params.id));

  if (index === -1) {
    return res.status(404).json({ error: "Vendor not found" });
  }

  vendors.splice(index, 1);
  writeVendors(vendors);

  res.json({ message: "Vendor deleted" });
});

export default router;
