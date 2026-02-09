import { useEffect, useState } from "react";
import { vendors, documents } from "../lib/api";

interface Vendor {
  id: number;
  name: string;
}

const UploadDocs = () => {
  const [vendorList, setVendorList] = useState<Vendor[]>([]);
  const [selectedVendorId, setSelectedVendorId] = useState("");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const data = await vendors.getAll();
        setVendorList(data);
        setError("");
      } catch (err: any) {
        setError(err.message || "Failed to load vendors");
      } finally {
        setIsLoading(false);
      }
    };

    fetchVendors();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedVendorId || !title || !file) {
      setError("Please select a vendor, enter a title, and choose a file");
      return;
    }

    setIsUploading(true);
    try {
      await documents.upload(selectedVendorId, title, file);
      setSuccess("Document uploaded successfully!");
      setTitle("");
      setFile(null);
      setSelectedVendorId("");
    } catch (err: any) {
      setError(err.message || "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return (
      <section className="stack">
        <div>
          <h1>Upload documentation</h1>
          <p className="muted">Loading vendors...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="stack">
      <div>
        <h1>Upload documentation</h1>
        <p className="muted">
          Store vendor PDFs, onboarding guides, and support runbooks.
        </p>
      </div>
      <div className="card">
        <form className="stack" onSubmit={handleSubmit}>
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
          {success && (
            <div
              style={{
                padding: "12px",
                borderRadius: "12px",
                background: "#dcfce7",
                color: "#166534"
              }}
            >
              {success}
            </div>
          )}
          <label className="field">
            Vendor
            <select
              value={selectedVendorId}
              onChange={(e) => setSelectedVendorId(e.target.value)}
              required
            >
              <option value="">Choose a vendor</option>
              {vendorList.map((vendor) => (
                <option key={vendor.id} value={vendor.id}>
                  {vendor.name}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            Document title
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Support SOP, Onboarding Guide, etc."
            />
          </label>
          <label className="field">
            File upload
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              accept=".pdf,.doc,.docx,.txt,.xlsx,.xls"
            />
          </label>
          <button
            className="primary-button"
            type="submit"
            disabled={isUploading}
            style={{ opacity: isUploading ? 0.6 : 1 }}
          >
            {isUploading ? "Uploading..." : "Upload document"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default UploadDocs;
