import { useState, useEffect } from "react";
import { team } from "../lib/api";

interface EditTeamMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMemberUpdated: () => void;
  memberId: number;
}

const EditTeamMemberModal = ({ isOpen, onClose, onMemberUpdated, memberId }: EditTeamMemberModalProps) => {
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMember, setIsLoadingMember] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen && memberId) {
      const fetchMember = async () => {
        try {
          const data = await team.getById(memberId);
          setTitle(data.title || "");
          setDepartment(data.department || "");
          setPhone(data.phone || "");
          setError("");
        } catch (err: any) {
          setError(err.message || "Failed to load member");
        } finally {
          setIsLoadingMember(false);
        }
      };
      fetchMember();
    }
  }, [isOpen, memberId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await team.update(memberId, {
        title: title || null,
        department: department || null,
        phone: phone || null,
      });

      onMemberUpdated();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to update member");
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
          maxWidth: "500px",
          width: "90%",
          maxHeight: "80vh",
          overflowY: "auto",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2>Edit team member</h2>
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

        {isLoadingMember ? (
          <p className="muted">Loading member...</p>
        ) : (
          <form className="stack" onSubmit={handleSubmit}>
            <label className="field">
              Title
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Support Specialist, Manager, etc."
              />
            </label>

            <label className="field">
              Department
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="Sales, Support, IT, etc."
              />
            </label>

            <label className="field">
              Phone
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(555) 123-4567"
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
                {isLoading ? "Saving..." : "Save changes"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditTeamMemberModal;
