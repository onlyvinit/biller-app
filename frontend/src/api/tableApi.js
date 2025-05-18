import axios from 'axios';

// Fetch all tables
export const getTables = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/tables');
    return response.data;
  } catch (error) {
    console.error('Error fetching tables:', error);
    throw error;
  }
};

// Add a new table
export const addTableApi = async (tableName) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      'http://localhost:5000/api/tables',
      { name: tableName },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error('Error adding table:', error);
    throw error;
  }
};

// Delete a table
export const deleteTableApi = async (tableId) => {
  try {
    const token = localStorage.getItem('token');
    await axios.delete(`http://localhost:5000/api/tables/${tableId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error('Error deleting table:', error);
    throw error;
  }
};
