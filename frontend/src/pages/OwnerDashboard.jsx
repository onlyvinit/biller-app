import React, { useEffect, useState, useRef } from "react";
import { getOwnerDetails } from "../api/ownerApi";
import { getBillers, updateBiller, deleteBiller } from "../api/billerApi";
import CategoryManagement from "../components/CategoryManagement";
import "../assets/owner-dashboard.css";
import { Link } from "react-router-dom";
import SalesGraph from "../components/SalesGraph";
import TablesManager from "../components/TablesManager";

function OwnerDashboard() {
  const [owner, setOwner] = useState(null);
  const [billers, setBillers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingBiller, setEditingBiller] = useState(null);
  const [updatedData, setUpdatedData] = useState({ name: "", email: "" });
  const [showTableManager, setShowTableManager] = useState(false);

  const graphRef = useRef();

  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  useEffect(() => {
    document.body.classList.toggle("dark-mode", isDarkMode);
    localStorage.setItem("darkMode", isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const ownerData = await getOwnerDetails();
        if (ownerData) setOwner(ownerData);

        const billersData = await getBillers();
        setBillers(billersData);
      } catch (err) {
        setError("Failed to fetch data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, []);

  const handleEditClick = (biller) => {
    setEditingBiller(biller._id);
    setUpdatedData({ name: biller.name, email: biller.email });
  };

  const handleInputChange = (e) => {
    setUpdatedData({ ...updatedData, [e.target.name]: e.target.value });
  };

  const handleSave = async (billerId) => {
    try {
      await updateBiller(billerId, updatedData);
      setBillers(
        billers.map((biller) =>
          biller._id === billerId ? { ...biller, ...updatedData } : biller
        )
      );
      setEditingBiller(null);
    } catch (err) {
      console.error("Error updating biller:", err);
    }
  };

  const handleDelete = async (billerId) => {
    try {
      await deleteBiller(billerId);
      setBillers(billers.filter((biller) => biller._id !== billerId));
    } catch (err) {
      console.error("Error deleting biller:", err);
    }
  };

  return (
    <>
      <div className={`owner-dashboard ${isDarkMode ? "dark-mode" : ""}`}>
        <div className="left-section">
          <div className="owner-info">
            <h2>Owner Details</h2>
            {loading ? (
              <p>Loading owner details...</p>
            ) : owner ? (
              <>
                <p><strong>Name:</strong> {owner.name}</p>
                <p><strong>Email:</strong> {owner.email}</p>
                <p><strong>Role:</strong> {owner.role}</p>
              </>
            ) : (
              <p>{error || "Owner details not found."}</p>
            )}
          </div>

          <div className="sales-graph">
            <h2>Sales Graph</h2>
            <SalesGraph />
          </div>
        </div>

        <div className="right-section">
          <div className="biller-management">
            <h2>Biller Management </h2>
            {loading ? (
              <p>Loading billers...</p>
            ) : error ? (
              <p>{error}</p>
            ) : billers.length > 0 ? (
              <table className="biller-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {billers.map((biller) => (
                    <tr key={biller._id}>
                      <td>
                        {editingBiller === biller._id ? (
                          <input
                            type="text"
                            name="name"
                            value={updatedData.name}
                            onChange={handleInputChange}
                          />
                        ) : (
                          biller.name
                        )}
                      </td>
                      <td>
                        {editingBiller === biller._id ? (
                          <input
                            type="email"
                            name="email"
                            value={updatedData.email}
                            onChange={handleInputChange}
                          />
                        ) : (
                          biller.email
                        )}
                      </td>
                      <td>
                        {editingBiller === biller._id ? (
                          <div className="button-group">
                            <button className="save-btn" onClick={() => handleSave(biller._id)}>Save</button>
                            <button className="cancel-btn" onClick={() => setEditingBiller(null)}>Cancel</button>
                          </div>
                        ) : (
                          <>
                            <button className="edit-btn" onClick={() => handleEditClick(biller)}>Edit</button>
                            <button className="delete-btn" onClick={() => handleDelete(biller._id)}>Delete</button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No billers found.</p>
            )}
          </div>

          <div className="category-food-management">
            <Link to="/food-management" className="food-management-link">
              Go to Food Management
            </Link>
            <CategoryManagement />
          </div>
        </div>
      </div>

      <button className="table-management" onClick={() => setShowTableManager(true)}>
        <i class="fa-solid fa-table"></i>
      </button>

      {showTableManager && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setShowTableManager(false)}>✖</button>
            <TablesManager />
          </div>
        </div>
      )}
    </>
  );
}

export default OwnerDashboard;
