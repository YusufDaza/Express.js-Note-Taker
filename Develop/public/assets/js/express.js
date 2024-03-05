const express = require('express');
const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Middleware to serve static files
app.use(express.static('assets'));

// Define routes and other server logic here

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
