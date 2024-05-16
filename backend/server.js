const express = require('express');
const connectDB = require('./config/database'); // Assuming database.js is in config
const expensesRoutes = require('./routes/expenses');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000; 

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ extended: false })); // Allows us to parse JSON body

// Define Routes
app.use('/api/expenses', expensesRoutes);
 
// Error handling middleware (add this after all other routes)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start Server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
