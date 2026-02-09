import { useState } from "react";
import { vendors } from "../lib/api";

interface AddVendorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVendorAdded: () => void;
  teamMembers: any[];
}

const AddVendorModal = ({ isOpen, onClose, onVendorAdded, teamMembers }: AddVendorModalProps) => {
  const [name, setName] = useState("");
  const [product, setProduct] = useState("");
  const [accountRep, setAccountRep] = useState("");
  const [accountRepPhone, setAccountRepPhone] = useState("");
  const [accountRepEmail, setAccountRepEmail] = useState("");
  const [supportLevel, setSupportLevel] = useState("standard");
  const [primaryContactId, setPrimaryContactId] = useState("");
  const [secondaryContactId, setSecondaryContactId] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await vendors.create({
        name,
        product: product || null,
        account_rep: accountRep || null,
        account_rep_phone: accountRepPhone || null,
        account_rep_email: accountRepEmail || null,
        support_level: supportLevel,
        primary_contact_id: primaryContactId ? parseInt(primaryContactId) : null,
        secondary_contact_id: secondaryContactId ? parseInt(secondaryContactId) : null,
        notes: notes || null,
      });

      setName("");      setProduct("");      setAccountRep("");
      setAccountRepPhone("");
      setAccountRepEmail("");
      setSupportLevel("standard");
      setPrimaryContactId("");
      setSecondaryContactId("");
      setNotes("");
      onVendorAdded();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to create vendor");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        className="card"
        style={{
          maxWidth: "600px",
          width: "90%",
          maxHeight: "80vh",
          overflowY: "auto",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2>Add vendor</h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "24px",
              cursor: "pointer",
              color: "#64748b",
            }}
          >
            ✕
          </button>
        </div>

        {error && (
          <div
            style={{
              padding: "12px",
              borderRadius: "12px",
              background: "#fee2e2",
              color: "#991b1b",
              marginBottom: "20px",
            }}
          >
            {error}
          </div>
        )}

        <form className="stack" onSubmit={handleSubmit}>
          <label className="field">
            Vendor name *
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Acme Corp"
              required
            />
          </label>
          <label className="field">
            Product / Application
            <input
              type="text"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              placeholder="SAFE, Access Manager, etc."
            />
          </label>
          <label className="field">
            Account rep
            <input
              type="text"
              value={accountRep}
              onChange={(e) => setAccountRep(e.target.value)}
              placeholder="John Smith"
            />
          </label>

          <label className="field">
            Account rep phone
            <input
              type="tel"
              value={accountRepPhone}
              onChange={(e) => setAccountRepPhone(e.target.value)}
              placeholder="(555) 123-4567"
            />
          </label>

          <label className="field">
            Account rep email
            <input
              type="email"
              value={accountRepEmail}
              onChange={(e) => setAccountRepEmail(e.target.value)}
              placeholder="john@acme.com"
            />
          </label>

          <label className="field">
            Support level
            <select value={supportLevel} onChange={(e) => setSupportLevel(e.target.value)}>
              <option value="standard">Standard</option>
              <option value="business">Business</option>
              <option value="premium">Premium</option>
              <option value="platinum">Platinum</option>
            </select>
          </label>

          <label className="field">
            Primary support contact
            <select value={primaryContactId} onChange={(e) => setPrimaryContactId(e.target.value)}>
              <option value="">Select team member</option>
              {teamMembers.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            Secondary support contact
            <select value={secondaryContactId} onChange={(e) => setSecondaryContactId(e.target.value)}>
              <option value="">Select team member</option>
              {teamMembers.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            Notes
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional notes..."
              rows={3}
              style={{
                padding: "12px 16px",
                borderRadius: "12px",
                border: "2px solid #e2e8f0",
                background: "#f8fafc",
                fontFamily: "inherit",
                fontSize: "15px",
                resize: "vertical",
              }}
            />
          </label>

          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "flex-end",
              marginTop: "20px",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "12px 24px",
                borderRadius: "12px",
                border: "2px solid #e2e8f0",
                background: "white",
                color: "#0f172a",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              className="primary-button"
              type="submit"
              disabled={isLoading}
              style={{ opacity: isLoading ? 0.6 : 1 }}
            >
              {isLoading ? "Creating..." : "Create vendor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVendorModal;
