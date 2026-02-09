import { useEffect, useState } from "react";
import { vendors, documents } from "../lib/api";

interface Document {
  id: number;
  vendor_id: number;
  title: string;
  file_name: string;
  file_type: string;
  file_size: number;
  created_at: string;
  vendor_name?: string;
  vendor_product?: string;
}

const Documents = () => {
  const [allDocuments, setAllDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const vendorsData = await vendors.getAll();

        // Fetch documents for each vendor and combine them
        const allDocs: Document[] = [];
        for (const vendor of vendorsData) {
          try {
            const vendorDocs = await documents.getByVendor(vendor.id);
            const enrichedDocs = vendorDocs.map((doc: any) => ({
              ...doc,
              vendor_name: vendor.name,
              vendor_product: vendor.product || "",
            }));
            allDocs.push(...enrichedDocs);
          } catch (err) {
            // Vendor might have no documents, continue
          }
        }
        setAllDocuments(allDocs);
        setError("");
      } catch (err: any) {
        setError(err.message || "Failed to load documents");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredDocuments = allDocuments.filter((doc) => {
    const query = searchQuery.toLowerCase();
    return (
      (doc.vendor_name?.toLowerCase().includes(query) ?? false) ||
      (doc.vendor_product?.toLowerCase().includes(query) ?? false) ||
      doc.title.toLowerCase().includes(query) ||
      doc.file_name.toLowerCase().includes(query)
    );
  });

  const handleDownload = (doc: Document) => {
    window.open(`http://localhost:3001/api/documents/${doc.id}/download`, "_blank");
  };

  const handleDelete = async (docId: number) => {
    if (!confirm("Are you sure you want to delete this document?")) return;

    try {
      await documents.delete(docId);
      setAllDocuments(allDocuments.filter((d) => d.id !== docId));
    } catch (err: any) {
      setError(err.message || "Failed to delete document");
    }
  };

  if (isLoading) {
    return (
      <section className="stack">
        <div>
          <h1>Documents</h1>
          <p className="muted">Loading...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="stack">
      <div className="section-header">
        <div>
          <h1>Documents</h1>
          <p className="muted">
            {filteredDocuments.length} of {allDocuments.length} document{allDocuments.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <input
        type="text"
        placeholder="Search documents by vendor name, product, title, or filename..."
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
            color: "#991b1b",
          }}
        >
          {error}
        </div>
      )}

      {filteredDocuments.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "48px 20px" }}>
          <p className="muted">
            {searchQuery ? "No documents match your search." : "No documents uploaded yet."}
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
              overflow: "hidden",
            }}
          >
            <thead>
              <tr style={{ borderBottom: "2px solid #e2e8f0" }}>
                <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600 }}>
                  Vendor
                </th>
                <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600 }}>
                  Product
                </th>
                <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600 }}>
                  Document Title
                </th>
                <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600 }}>
                  File
                </th>
                <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600 }}>
                  Size
                </th>
                <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600 }}>
                  Uploaded
                </th>
                <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600 }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredDocuments.map((doc) => (
                <tr key={doc.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                  <td style={{ padding: "12px 16px", fontWeight: 500 }}>{doc.vendor_name}</td>
                  <td style={{ padding: "12px 16px", color: "#64748b", fontSize: "14px" }}>
                    {doc.vendor_product || "-"}
                  </td>
                  <td style={{ padding: "12px 16px", color: "#0f172a" }}>{doc.title}</td>
                  <td style={{ padding: "12px 16px", color: "#64748b", fontSize: "14px" }}>
                    {doc.file_name}
                  </td>
                  <td style={{ padding: "12px 16px", color: "#64748b" }}>
                    {(doc.file_size / 1024 / 1024).toFixed(2)} MB
                  </td>
                  <td style={{ padding: "12px 16px", color: "#64748b", fontSize: "14px" }}>
                    {new Date(doc.created_at).toLocaleDateString()}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => handleDownload(doc)}
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
                        Download
                      </button>
                      <button
                        onClick={() => handleDelete(doc.id)}
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
    </section>
  );
};

export default Documents;
