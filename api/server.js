const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mix')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

const adminRoutes = require('./routes/admin.routes');
const categoryRoutes = require('./routes/category.routes');
const drinkRoutes = require('./routes/drinks.routes');
// Routes
app.use('/admin', adminRoutes);

app.get('/uploads/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.params.filename);

  try {
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        console.error(`Error accessing file: ${filePath}`, err);
        return res.status(404).json({
          error: err.message,
          filePath: filePath,
          message: `The file ${req.params.filename} was not found on the server.`,
        });
      }
      res.sendFile(filePath);
    });
  } catch (err) {
    console.error('Error serving the file:', err);
    return res.status(500).json({
      error: err.message,
      message: 'An error occurred while trying to serve the file.',
    });
  }
});

app.use('/api/categories', categoryRoutes);
app.use('/api/drinks', drinkRoutes);
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 