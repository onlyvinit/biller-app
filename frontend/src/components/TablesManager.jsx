import React, { useState, useEffect } from "react";
import axios from "axios";
import "../assets/tableManager.css";

const TablesManager = () => {
  const [tables, setTables] = useState([]); // State to hold tables
  const [tableName, setTableName] = useState(""); // State for the new table name
  const [loading, setLoading] = useState(false); // Loading state for adding table
  const [error, setError] = useState(""); // Error handling state

  // Fetch all tables from the backend
  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("Token:", token);  // Log the token
  
      const response = await axios.get("http://localhost:5000/api/tables", {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      console.log("Tables fetched:", response.data);  // Log the response
      setTables(response.data); // Set the tables in state
    } catch (error) {
      console.error("Error fetching tables:", error);
      setError("Failed to fetch tables");
    }
  };
  
  

  // Handle adding a new table
  const addTable = async () => {
    if (!tableName.trim()) {
      alert("Table name is required!");
      return;
    }

    setLoading(true); // Set loading to true while adding the table
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/tables",
        { name: tableName },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTableName(""); // Reset input field
      fetchTables(); // Refresh the list of tables
    } catch (error) {
      console.error("Error adding table:", error);
      setError("Failed to add table");
    } finally {
      setLoading(false); // Set loading to false after the API call completes
    }
  };

  // Handle deleting a table
  const deleteTable = async (tableId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/tables/${tableId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTables(); // Refresh the list of tables after deletion
    } catch (error) {
      console.error("Error deleting table:", error);
      setError("Failed to delete table");
    }
  };

  return (
    <div className="tables-manager">
      <h2>Manage Tables</h2>

      {error && <p className="error">{error}</p>} {/* Display any error */}

      <div className="add-table">
        <input
          type="text"
          placeholder="Enter table name"
          value={tableName}
          onChange={(e) => setTableName(e.target.value)} // Update table name state
        />
        <button onClick={addTable} disabled={loading}>
          {loading ? "Adding..." : "Add Table"}
        </button>
      </div>

      {tables.length > 0 ? (
        <table className="tables-list">
          <thead>
            <tr>
              <th>Table Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tables.map((table) => (
              <tr key={table._id}>
                <td>{table.name}</td>
                <td>
                  <button
                    onClick={() => deleteTable(table._id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No tables available.</p>
      )}
    </div>
  );
};

export default TablesManager;
