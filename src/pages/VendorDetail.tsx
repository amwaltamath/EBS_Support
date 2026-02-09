import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { vendors, team, documents } from "../lib/api";
import EditVendorModal from "../components/EditVendorModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";

interface Vendor {
  id: number;
  name: string;
  product?: string;
  account_rep?: string;
  account_rep_phone?: string;
  account_rep_email?: string;
  support_level: string;
  primary_contact_name?: string;
  secondary_contact_name?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

interface Document {
  id: number;
  vendor_id: number;
  title: string;
  file_name: string;
  file_type: string;
  file_size: number;
  created_at: string;
}

const VendorDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [vendorDocuments, setVendorDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const [vendorData, teamData, docsData] = await Promise.all([
          vendors.getById(parseInt(id!)),
          team.getAll(),
          documents.getByVendor(parseInt(id!)).catch(() => []),
        ]);
        setVendor(vendorData);
        setTeamMembers(teamData);
        setVendorDocuments(docsData);
        setError("");
      } catch (err: any) {
        setError(err.message || "Failed to load vendor");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchVendor();
    }
  }, [id]);

  const handleVendorUpdated = async () => {
    try {
      const data = await vendors.getById(parseInt(id!));
      setVendor(data);
      setIsEditModalOpen(false);
    } catch (err: any) {
      setError(err.message || "Failed to refresh vendor");
    }
  };

  const handleDeleteDocument = async (docId: number) => {
    if (!confirm("Are you sure you want to delete this document?")) return;
    try {
      await documents.delete(docId);
      setVendorDocuments(vendorDocuments.filter((d) => d.id !== docId));
    } catch (err: any) {
      setError(err.message || "Failed to delete document");
    }
  };

  const handleDownloadDocument = (docId: number) => {
    window.open(`http://localhost:3001/api/documents/${docId}/download`, "_blank");
  };

  if (isLoading) {
    return (
      <section className="stack">
        <div>
          <h1>Loading...</h1>
          <p className="muted">Fetching vendor details</p>
        </div>
      </section>
    );
  }

  if (!vendor) {
    return (
      <section className="stack">
        <button
          onClick={() => navigate("/vendors")}
          style={{
            padding: "8px 16px",
            border: "2px solid #e2e8f0",
            background: "white",
            borderRadius: "8px",
            cursor: "pointer",
            marginBottom: "20px",
          }}
        >
          ← Back to vendors
        </button>
        {error && (
          <div
            style={{
              padding: "12px",
              borderRadius: "12px",
              background: "#fee2e2",
              color: "#991b1b",
            }}
          >
            {error}
          </div>
        )}
      </section>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <section className="stack">
      <div style={{ display: "flex", gap: "12px", marginBottom: "20px", alignItems: "center" }}>
        <button
          onClick={() => navigate("/vendors")}
          style={{
            padding: "8px 16px",
            border: "2px solid #e2e8f0",
            background: "white",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          ← Back to vendors
        </button>
        <div style={{ flex: 1 }} />
        <button
          onClick={() => setIsEditModalOpen(true)}
          style={{
            padding: "8px 16px",
            border: "2px solid #667eea",
            background: "#667eea",
            color: "white",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Edit
        </button>
        <button
          onClick={() => setIsDeleteModalOpen(true)}
          style={{
            padding: "8px 16px",
            border: "2px solid #dc2626",
            background: "#dc2626",
            color: "white",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Delete
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

      <div className="card">
        <h1 style={{ marginTop: 0, marginBottom: "8px" }}>{vendor.name}</h1>

        {vendor.product && (
          <p style={{ fontSize: "18px", color: "#667eea", marginBottom: "20px", fontWeight: 500 }}>
            Product: {vendor.product}
          </p>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            marginBottom: "24px",
          }}
        >
          <div>
            <h3 style={{ fontSize: "14px", color: "#64748b", marginBottom: "8px", fontWeight: 600 }}>
              SUPPORT LEVEL
            </h3>
            <p style={{ fontSize: "18px", fontWeight: 500 }}>
              <span
                className="pill"
                style={{
                  display: "inline-block",
                  textTransform: "capitalize",
                }}
              >
                {vendor.support_level}
              </span>
            </p>
          </div>

          {vendor.account_rep && (
            <div>
              <h3 style={{ fontSize: "14px", color: "#64748b", marginBottom: "8px", fontWeight: 600 }}>
                ACCOUNT REP
              </h3>
              <p style={{ fontSize: "16px", fontWeight: 500, marginBottom: "4px" }}>
                {vendor.account_rep}
              </p>
              {vendor.account_rep_phone && (
                <p style={{ fontSize: "14px", color: "#64748b" }}>
                  {vendor.account_rep_phone}
                </p>
              )}
              {vendor.account_rep_email && (
                <p style={{ fontSize: "14px", color: "#64748b" }}>
                  {vendor.account_rep_email}
                </p>
              )}
            </div>
          )}
        </div>

        <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "20px", marginBottom: "20px" }}>
          <h3 style={{ fontSize: "14px", color: "#64748b", marginBottom: "12px", fontWeight: 600 }}>
            SUPPORT CONTACTS
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <p style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "4px", fontWeight: 600 }}>
                PRIMARY CONTACT
              </p>
              <p style={{ fontSize: "16px", fontWeight: 500 }}>
                {vendor.primary_contact_name || "Not assigned"}
              </p>
            </div>
            <div>
              <p style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "4px", fontWeight: 600 }}>
                SECONDARY CONTACT
              </p>
              <p style={{ fontSize: "16px", fontWeight: 500 }}>
                {vendor.secondary_contact_name || "Not assigned"}
              </p>
            </div>
          </div>
        </div>

        {vendor.notes && (
          <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "20px", marginBottom: "20px" }}>
            <h3 style={{ fontSize: "14px", color: "#64748b", marginBottom: "8px", fontWeight: 600 }}>
              NOTES
            </h3>
            <p style={{ whiteSpace: "pre-wrap", lineHeight: "1.6", color: "#475569" }}>
              {vendor.notes}
            </p>
          </div>
        )}

        <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "20px", marginBottom: "20px" }}>
          <h3 style={{ fontSize: "14px", color: "#64748b", marginBottom: "12px", fontWeight: 600 }}>
            DOCUMENTS
          </h3>
          {vendorDocuments.length === 0 ? (
            <p style={{ color: "#64748b" }}>No documents uploaded yet.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "14px",
                }}
              >
                <thead>
                  <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                    <th style={{ padding: "8px 0", textAlign: "left", fontWeight: 600 }}>
                      Title
                    </th>
                    <th style={{ padding: "8px 0", textAlign: "left", fontWeight: 600 }}>
                      File
                    </th>
                    <th style={{ padding: "8px 0", textAlign: "left", fontWeight: 600 }}>
                      Size
                    </th>
                    <th style={{ padding: "8px 0", textAlign: "left", fontWeight: 600 }}>
                      Uploaded
                    </th>
                    <th style={{ padding: "8px 0", textAlign: "left", fontWeight: 600 }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {vendorDocuments.map((doc) => (
                    <tr key={doc.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                      <td style={{ padding: "8px 0", color: "#0f172a" }}>{doc.title}</td>
                      <td style={{ padding: "8px 0", color: "#64748b" }}>{doc.file_name}</td>
                      <td style={{ padding: "8px 0", color: "#64748b" }}>
                        {(doc.file_size / 1024 / 1024).toFixed(2)} MB
                      </td>
                      <td style={{ padding: "8px 0", color: "#64748b" }}>
                        {new Date(doc.created_at).toLocaleDateString()}
                      </td>
                      <td style={{ padding: "8px 0" }}>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button
                            onClick={() => handleDownloadDocument(doc.id)}
                            style={{
                              padding: "4px 10px",
                              border: "1px solid #667eea",
                              background: "#667eea",
                              color: "white",
                              borderRadius: "4px",
                              cursor: "pointer",
                              fontSize: "12px",
                              fontWeight: 600,
                            }}
                          >
                            Download
                          </button>
                          <button
                            onClick={() => handleDeleteDocument(doc.id)}
                            style={{
                              padding: "4px 10px",
                              border: "1px solid #dc2626",
                              background: "#dc2626",
                              color: "white",
                              borderRadius: "4px",
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
        </div>

        <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "20px" }}>
          <h3 style={{ fontSize: "14px", color: "#64748b", marginBottom: "8px", fontWeight: 600 }}>
            CREATED
          </h3>
          <p style={{ color: "#64748b" }}>{formatDate(vendor.created_at)}</p>
          {vendor.updated_at && vendor.updated_at !== vendor.created_at && (
            <>
              <h3 style={{ fontSize: "14px", color: "#64748b", marginTop: "12px", marginBottom: "8px", fontWeight: 600 }}>
                LAST UPDATED
              </h3>
              <p style={{ color: "#64748b" }}>{formatDate(vendor.updated_at)}</p>
            </>
          )}
        </div>
      </div>

      <EditVendorModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onVendorUpdated={handleVendorUpdated}
        vendorId={parseInt(id!)}
        teamMembers={teamMembers}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete vendor?"
        message={`Are you sure you want to delete "${vendor?.name}"? This action cannot be undone.`}
        isLoading={isDeleting}
      />
    </section>
  );
};

export default VendorDetail;
