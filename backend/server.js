const express = require('express');
const { connectToDb, sql } = require('./db');
const app = express();
const cors = require('cors');

app.use(cors()); 
// Middleware to parse JSON bodies
app.use(express.json());

// Connect to the database
connectToDb();

fetch('http://localhost:3000/users')
  .then(response => response.json())
  .then(data => {
    console.log(data); // Log the data in the console to check if it's coming through
    // Update the UI with the fetched data
  })
  .catch(error => {
    console.error('Error fetching users:', error);
  });


// Endpoint to get all users
app.get('/users', async (req, res) => {
  console.log('Users route was hit');  // Check if route is being hit
  try {
    const result = await sql.query`SELECT * FROM dbo.users`;
    console.log("Users fetched:", result.recordset);  // Log the users data
    res.status(200).json(result.recordset);  // Return the users data in JSON format
  } catch (err) {
    console.error('Error fetching users:', err.message);
    res.status(500).send('Server error');
  }
});
// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});


// Endpoint to add a new user
app.post('/users', async (req, res) => {
  const { name, email, accessLevel, status } = req.body;
  try {
    await sql.query`INSERT INTO dbo.users (name, email, accessLevel, status) VALUES (${name}, ${email}, ${accessLevel}, ${status})`;
    res.status(201).send('User added');
  } catch (err) {
    console.error('Error adding user:', err);
    res.status(500).send('Server error');
  }
});

// Endpoint to update a user
app.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, accessLevel, status } = req.body;
  try {
    await sql.query`UPDATE dbo.users SET name = ${name}, email = ${email}, accessLevel = ${accessLevel}, status = ${status} WHERE id = ${id}`;
    res.send('User updated');
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).send('Server error');
  }
});


// Endpoint to delete a user
// Endpoint to delete a user
app.delete('/users/:UserID', async (req, res) => {
  const { UserID } = req.params;
  console.log(`Deleting UserID: ${UserID}`);

  try {
    // Correct use of await with SQL query
    await sql.query`DELETE FROM dbo.users WHERE UserID = ${UserID}`;
    res.status(200).send('User deleted successfully');
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).send('Server Error');
  }
});






