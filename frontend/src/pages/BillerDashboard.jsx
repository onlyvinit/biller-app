import { useEffect, useState } from "react";
import axios from "axios";
import { addSale } from "../api/salesApi";
import { jwtDecode } from "jwt-decode";
import "../assets/billerDashboard.css";

const BillerDashboard = () => {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [foodItems, setFoodItems] = useState([]);
  const [selectedItemsByTable, setSelectedItemsByTable] = useState({});
  const [loadingFood, setLoadingFood] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/tables", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTables(res.data);
      } catch (error) {
        console.error("Error fetching tables:", error);
      }
    };
    fetchTables();
  }, []);

  useEffect(() => {
    if (selectedTable) {
      const token = localStorage.getItem("token");
      axios
        .get("http://localhost:5000/api/categories", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setCategories(res.data))
        .catch((err) => console.error("Error fetching categories:", err));
    }
  }, [selectedTable]);

  const handleCategoryClick = (categoryId) => {
    const token = localStorage.getItem("token");
    setLoadingFood(true);
    setSelectedCategory(categoryId);
    axios
      .get(`http://localhost:5000/api/food?category=${categoryId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setFoodItems(res.data))
      .catch((err) => console.error("Error fetching food items:", err))
      .finally(() => setLoadingFood(false));
  };

  const getSelectedItems = () => selectedItemsByTable[selectedTable] || [];

  const handleFoodSelection = (foodItem) => {
    setSelectedItemsByTable((prev) => {
      const current = [...(prev[selectedTable] || [])];
      const index = current.findIndex((item) => item._id === foodItem._id);
      if (index >= 0) {
        current[index].quantity += 1;
      } else {
        current.push({ ...foodItem, quantity: 1 });
      }
      return { ...prev, [selectedTable]: current };
    });
  };

  const removeItem = (index) => {
    setSelectedItemsByTable((prev) => {
      const current = [...(prev[selectedTable] || [])];
      current.splice(index, 1);
      return { ...prev, [selectedTable]: current };
    });
  };

  const generateBill = async () => {
    const selectedItems = getSelectedItems();
    if (selectedItems.length === 0) {
      alert("Please select at least one food item.");
      return;
    }

    const total = selectedItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    // Get biller ID from token
    let biller;
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found. Please log in again.");
      }
      const decoded = jwtDecode(token);
      console.log("Decoded token payload:", decoded); // Debug token structure
      // Try common field names
      biller = decoded.userId || decoded.id || decoded._id || decoded.sub || decoded.user_id;
      if (!biller) {
        // Fallback: Use valid ObjectId from db.user for testing
        biller = "663f1234abcd5678ef901234"; // TODO: Replace with actual ObjectId from db.user
        console.warn("Biller ID not found in token, using hardcoded ID:", biller);
        alert("Warning: Using test biller ID. Please update token to include userId.");
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      alert(`Error: ${error.message}`);
      return;
    }

    // Validate sale data
    const saleData = {
      foodItems: selectedItems.map((item) => {
        if (!item._id || !item.quantity || !item.price) {
          throw new Error(`Invalid food item: ${item.name || "unknown"}`);
        }
        return {
          itemId: item._id,
          quantity: item.quantity,
          price: item.price,
        };
      }),
      totalAmount: total,
      biller,
    };

    try {
      const response = await addSale(saleData);
      if (response) {
        alert(
          `Bill generated for Table: ${
            tables.find((t) => t._id === selectedTable)?.name
          }\nTotal: ₹${total}\nSale recorded successfully!`
        );
        // Clear selected items for the table
        setSelectedItemsByTable((prev) => ({
          ...prev,
          [selectedTable]: [],
        }));
      } else {
        alert("Failed to record sale. Please try again.");
      }
    } catch (error) {
      console.error("Error saving sale:", {
        message: error.message,
        response: error.response?.data,
      });
      alert(`Error recording sale: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="biller-dashboard">
      <h2 className="billerHeading">Biller Dashboard</h2>
      <div className="dashboard-container">
        <div className="tables-section">
          <h3>Tables</h3>
          <ul className="tables-list">
            {tables.map((table) => (
              <li
                key={table._id}
                className={selectedTable === table._id ? "active" : ""}
                onClick={() => {
                  setSelectedTable(table._id);
                  setSelectedCategory(null);
                  setFoodItems([]);
                }}
              >
                {table.name}
              </li>
            ))}
          </ul>
        </div>

        {selectedTable && (
          <>
            <div className="details-section">
              <h3>
                Table: {tables.find((t) => t._id === selectedTable)?.name}
              </h3>

              <div className="categories">
                <h4>Categories</h4>
                {categories.map((category) => (
                  <button
                    key={category._id}
                    className={
                      selectedCategory === category._id
                        ? "category-btn selected"
                        : "category-btn"
                    }
                    onClick={() => handleCategoryClick(category._id)}
                  >
                    {category.name}
                  </button>
                ))}
              </div>

              <div className="food-items">
                <h4>Food Items</h4>
                <input
                  type="text"
                  placeholder="Search food items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="food-search-input"
                />
                {loadingFood ? (
                  <p className="spinner">Loading...</p>
                ) : foodItems.length > 0 ? (
                  foodItems
                    .filter((item) =>
                      item.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    )
                    .map((item) => (
                      <div key={item._id} className="food-item">
                        <span>
                          {item.name} - ₹{item.price}
                        </span>
                        <button onClick={() => handleFoodSelection(item)}>
                          Add
                        </button>
                      </div>
                    ))
                ) : (
                  <p>No items to display.</p>
                )}
              </div>
            </div>

            <div className="selected-panel">
              <h3>Selected Items</h3>
              {getSelectedItems().length === 0 ? (
                <p>No items selected.</p>
              ) : (
                <>
                  <ul>
                    {getSelectedItems().map((item, index) => (
                      <li key={index}>
                        {item.name} × {item.quantity} = ₹
                        {item.price * item.quantity}
                        <button onClick={() => removeItem(index)}>❌</button>
                      </li>
                    ))}
                  </ul>
                  <p className="total">
                    Total: ₹
                    {getSelectedItems().reduce(
                      (acc, item) => acc + item.price * item.quantity,
                      0
                    )}
                  </p>
                  <button className="generate-bill" onClick={generateBill}>
                    Generate Bill
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BillerDashboard;