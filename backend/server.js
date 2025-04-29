const express = require('express');
const { connectToDb, sql } = require('./db');  // assuming db.js connects to Azure
const app = express();
const cors = require('cors');

app.use(cors()); 
app.use(express.json());


connectToDb();


app.get('/users', async (req, res) => {
  try {
    const result = await sql.query`SELECT * FROM dbo.users`;
    res.status(200).json(result.recordset);
  } catch (err) {
    console.error('Error fetching users:', err.message);
    res.status(500).send('Server error');
  }
});


app.post('/users', async (req, res) => {
  const { DisplayName, Email, Status, AdminUser, FunctionalUser, BlockAccess, MFA_Mobile } = req.body;
  try {
    console.log(`
      INSERT INTO dbo.users (DisplayName, Email, Status, AdminUser, FunctionalUser, BlockAccess, MFA_Mobile) 
      VALUES (${DisplayName}, ${Email}, ${Status}, ${AdminUser}, ${FunctionalUser}, ${BlockAccess}, ${MFA_Mobile})`);
    await sql.query`
      INSERT INTO dbo.users (DisplayName, Email, Status, AdminUser, FunctionalUser, BlockAccess, MFA_Mobile) 
      VALUES (${DisplayName}, ${Email}, ${Status}, ${AdminUser}, ${FunctionalUser}, ${BlockAccess}, ${MFA_Mobile})
    `;
    res.status(201).send('User added');
  } catch (err) {
    console.error('Error adding user:', err.message);
    res.status(500).send('Server error');
  }
});


app.put('/users/:UserID', async (req, res) => {
  const { UserID } = req.params;
  const { DisplayName, Email, Status, AdminUser, FunctionalUser, BlockAccess, MFA_Mobile } = req.body;
  console.log(`
      UPDATE dbo.users 
      SET DisplayName = ${DisplayName},
          Email = ${Email},
          Status = ${Status},
          AdminUser = ${AdminUser},
          FunctionalUser = ${FunctionalUser},
          BlockAccess = ${BlockAccess},
          MFA_Mobile = ${MFA_Mobile}
      WHERE UserID = ${UserID}
    `);
  try {
    await sql.query`
      UPDATE dbo.users 
      SET DisplayName = ${DisplayName},
          Email = ${Email},
          Status = ${Status},
          AdminUser = ${AdminUser},
          FunctionalUser = ${FunctionalUser},
          BlockAccess = ${BlockAccess},
          MFA_Mobile = ${MFA_Mobile}
      WHERE UserID = ${UserID}
    `;
    res.send('User updated');
  } catch (err) {
    console.error('Error updating user:', err.message);
    res.status(500).send('Server error');
  }
});


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


const port = 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
