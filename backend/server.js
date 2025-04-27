const express = require('express');
const { connectToDb, sql } = require('./db');  // assuming db.js connects to Azure
const app = express();
const cors = require('cors');

app.use(cors()); 
app.use(express.json());

// Connect to the database
connectToDb();

// -----------------------------
// Fetch All Users
app.get('/users', async (req, res) => {
  try {
    const result = await sql.query`SELECT * FROM dbo.users`;
    res.status(200).json(result.recordset);
  } catch (err) {
    console.error('Error fetching users:', err.message);
    res.status(500).send('Server error');
  }
});

// -----------------------------
// Add New User
app.post('/users', async (req, res) => {
  const { DisplayName, Email, Status, AdminUser, FunctionalUser, BlockAccess, HierarchyMaintenance } = req.body;
  try {
    console.log(`
      INSERT INTO dbo.users (DisplayName, Email, Status, AdminUser, FunctionalUser, BlockAccess, HierarchyMaintenance) 
      VALUES (${DisplayName}, ${Email}, ${Status}, ${AdminUser}, ${FunctionalUser}, ${BlockAccess}, ${HierarchyMaintenance})`);
    await sql.query`
      INSERT INTO dbo.users (DisplayName, Email, Status, AdminUser, FunctionalUser, BlockAccess, HierarchyMaintenance) 
      VALUES (${DisplayName}, ${Email}, ${Status}, ${AdminUser}, ${FunctionalUser}, ${BlockAccess}, ${HierarchyMaintenance})
    `;
    res.status(201).send('User added');
  } catch (err) {
    console.error('Error adding user:', err.message);
    res.status(500).send('Server error');
  }
});

// -----------------------------
// Update User
app.put('/users/:UserID', async (req, res) => {
  const { UserID } = req.params;
  const { DisplayName, Email, Status, AdminUser, FunctionalUser, BlockAccess, HierarchyMaintenance } = req.body;
  try {
    await sql.query`
      UPDATE dbo.users 
      SET DisplayName = ${DisplayName},
          Email = ${Email},
          Status = ${Status},
          AdminUser = ${AdminUser},
          FunctionalUser = ${FunctionalUser},
          BlockAccess = ${BlockAccess},
          HierarchyMaintenance = ${HierarchyMaintenance}
      WHERE UserID = ${UserID}
    `;
    res.send('User updated');
  } catch (err) {
    console.error('Error updating user:', err.message);
    res.status(500).send('Server error');
  }
});

// -----------------------------
// Delete User
app.delete('/users/:UserID', async (req, res) => {
  const { UserID } = req.params;
  try {
    await sql.query`DELETE FROM dbo.users WHERE UserID = ${UserID}`;
    res.status(200).send('User deleted successfully');
  } catch (err) {
    console.error('Error deleting user:', err.message);
    res.status(500).send('Server Error');
  }
});

// -----------------------------
// Start server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
