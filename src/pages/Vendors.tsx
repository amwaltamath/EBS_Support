import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { vendors, team } from "../lib/api";
import AddVendorModal from "../components/AddVendorModal";

interface Vendor {
  id: number;
  name: string;
  product?: string;
  account_rep: string;
  support_level: string;
  primary_contact_name?: string;
  secondary_contact_name?: string;
}

interface TeamMember {
  id: number;
  name: string;
}

const Vendors = () => {
  const navigate = useNavigate();
  const [vendorList, setVendorList] = useState<Vendor[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredVendors = vendorList.filter((vendor) => {
    const query = searchQuery.toLowerCase();
    return (
      vendor.name.toLowerCase().includes(query) ||
      (vendor.product?.toLowerCase().includes(query) ?? false) ||
      (vendor.account_rep?.toLowerCase().includes(query) ?? false) ||
      (vendor.support_level?.toLowerCase().includes(query) ?? false) ||
      (vendor.primary_contact_name?.toLowerCase().includes(query) ?? false) ||
      (vendor.secondary_contact_name?.toLowerCase().includes(query) ?? false)
    );
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vendorsData, teamData] = await Promise.all([
          vendors.getAll(),
          team.getAll(),
        ]);
        setVendorList(vendorsData);
        setTeamMembers(teamData);
        setError("");
      } catch (err: any) {
        setError(err.message || "Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleVendorAdded = async () => {
    try {
      const data = await vendors.getAll();
      setVendorList(data);
    } catch (err: any) {
      setError(err.message || "Failed to refresh vendors");
    }
  };

  if (isLoading) {
    return (
      <section className="stack">
        <div>
          <h1>Vendors</h1>
          <p className="muted">Loading...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="stack">
      <div className="section-header">
        <div>
          <h1>Vendors</h1>
          <p className="muted">
            {filteredVendors.length} of {vendorList.length} vendor{vendorList.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          className="primary-button"
          type="button"
          onClick={() => setIsModalOpen(true)}
        >
          Add vendor
        </button>
      </div>
      <input
        type="text"
        placeholder="Search vendors by name, product, account rep, or contact..."
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
      {filteredVendors.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "48px 20px" }}>
          <p className="muted">
            {searchQuery ? "No vendors match your search." : "No vendors yet. Click \"Add vendor\" to get started."}
          </p>
        </div>
      ) : (
        <div className="grid">
          {filteredVendors.map((vendor) => (
            <article
              key={vendor.id}
              className="card"
              onClick={() => navigate(`/vendors/${vendor.id}`)}
              style={{ cursor: "pointer" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 10px 25px rgba(0, 0, 0, 0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.06)";
              }}
            >
              <h2>{vendor.name}</h2>
              {vendor.product && (
                <p className="muted" style={{ marginBottom: "8px" }}><strong>Product:</strong> {vendor.product}</p>
              )}
              {vendor.account_rep && (
                <p className="muted">Account rep: {vendor.account_rep}</p>
              )}
              <div className="pill-row">
                <span className="pill">{vendor.support_level}</span>
                {vendor.primary_contact_name && (
                  <span className="pill">Primary: {vendor.primary_contact_name}</span>
                )}
                {vendor.secondary_contact_name && (
                  <span className="pill">Secondary: {vendor.secondary_contact_name}</span>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      <AddVendorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onVendorAdded={handleVendorAdded}
        teamMembers={teamMembers}
      />
    </section>
  );
};

export default Vendors;
