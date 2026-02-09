import { useEffect, useState } from "react";
import { team } from "../lib/api";
import AddMemberModal from "../components/AddMemberModal";
import EditTeamMemberModal from "../components/EditTeamMemberModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";

interface TeamMember {
  id: number;
  user_id: number;
  name: string;
  email: string;
  title: string;
  department: string;
  phone: string;
}

const Team = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingMemberId, setEditingMemberId] = useState<number | null>(null);
  const [deletingMemberId, setDeletingMemberId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredMembers = members.filter((member) => {
    const query = searchQuery.toLowerCase();
    return (
      member.name.toLowerCase().includes(query) ||
      (member.email?.toLowerCase().includes(query) ?? false) ||
      (member.title?.toLowerCase().includes(query) ?? false) ||
      (member.department?.toLowerCase().includes(query) ?? false) ||
      (member.phone?.toLowerCase().includes(query) ?? false)
    );
  });

  const fetchMembers = async () => {
    try {
      const data = await team.getAll();
      setMembers(data);
      setError("");
    } catch (err: any) {
      setError(err.message || "Failed to load team members");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleMemberAdded = () => {
    fetchMembers();
  };

  const handleMemberUpdated = () => {
    fetchMembers();
    setEditingMemberId(null);
  };

  const handleDeleteMember = async () => {
    if (!deletingMemberId) return;
    setIsDeleting(true);
    try {
      await team.delete(deletingMemberId);
      fetchMembers();
      setDeletingMemberId(null);
    } catch (err: any) {
      setError(err.message || "Failed to delete member");
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <section className="stack">
        <div>
          <h1>Team members</h1>
          <p className="muted">Loading...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="stack">
      <div className="section-header">
        <div>
          <h1>Team members</h1>
          <p className="muted">
            {filteredMembers.length} of {members.length} team member{members.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          className="primary-button"
          type="button"
          onClick={() => setIsModalOpen(true)}
        >
          Add member
        </button>
      </div>
      <input
        type="text"
        placeholder="Search team members by name, email, title, department, or phone..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{
          width: "100%",
          padding: "12px 16px",
          border: "2px solid #e2e8f0",
          borderRadius: "12px",
          fontSize: "16px",
          outline: "none",
          transition: "border-color 0.2s",
        }}
        onFocus={(e) => (e.currentTarget.style.borderColor = "#667eea")}
        onBlur={(e) => (e.currentTarget.style.borderColor = "#e2e8f0")}
      />
      {error && (
        <div
          style={{
            padding: "12px",
            borderRadius: "12px",
            background: "#fee2e2",
            color: "#991b1b"
          }}
        >
          {error}
        </div>
      )}
      {filteredMembers.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "48px 20px" }}>
          <p className="muted">
            {searchQuery ? "No team members match your search." : "No team members yet."}
          </p>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              background: "white",
              borderRadius: "12px",
              overflow: "hidden"
            }}
          >
            <thead>
              <tr style={{ borderBottom: "2px solid #e2e8f0" }}>
                <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600 }}>
                  Name
                </th>
                <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600 }}>
                  Email
                </th>
                <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600 }}>
                  Title
                </th>
                <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600 }}>
                  Department
                </th>
                <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600 }}>
                  Phone
                </th>
                <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600 }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member) => (
                <tr
                  key={member.id}
                  style={{ borderBottom: "1px solid #e2e8f0" }}
                >
                  <td style={{ padding: "12px 16px", fontWeight: 500 }}>{member.name}</td>
                  <td style={{ padding: "12px 16px", color: "#64748b" }}>{member.email}</td>
                  <td style={{ padding: "12px 16px", color: "#64748b" }}>
                    {member.title || "-"}
                  </td>
                  <td style={{ padding: "12px 16px", color: "#64748b" }}>
                    {member.department || "-"}
                  </td>
                  <td style={{ padding: "12px 16px", color: "#64748b" }}>
                    {member.phone || "-"}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => setEditingMemberId(member.id)}
                        style={{
                          padding: "6px 12px",
                          border: "1px solid #667eea",
                          background: "#667eea",
                          color: "white",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontSize: "12px",
                          fontWeight: 600,
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeletingMemberId(member.id)}
                        style={{
                          padding: "6px 12px",
                          border: "1px solid #dc2626",
                          background: "#dc2626",
                          color: "white",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontSize: "12px",
                          fontWeight: 600,
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AddMemberModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onMemberAdded={handleMemberAdded}
      />

      {editingMemberId && (
        <EditTeamMemberModal
          isOpen={true}
          onClose={() => setEditingMemberId(null)}
          onMemberUpdated={handleMemberUpdated}
          memberId={editingMemberId}
        />
      )}

      <DeleteConfirmModal
        isOpen={deletingMemberId !== null}
        onClose={() => setDeletingMemberId(null)}
        onConfirm={handleDeleteMember}
        title="Delete team member?"
        message={`Are you sure you want to delete "${members.find((m) => m.id === deletingMemberId)?.name}"? This action cannot be undone.`}
        isLoading={isDeleting}
      />
    </section>
  );
};

export default Team;
