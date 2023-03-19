const express = require('express');
const app = express();
const mongoose = require('mongoose');
const authRoute = require('./routes/auth');
const postRoute=require('./routes/post');

// Connect to MongoDB using a Promise-based approach
mongoose
  .connect('mongodb://0.0.0.0:27017/', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB', err));

// Import routes from separate files
app.use(express.json());
app.use('/api/user', authRoute);
app.use('/api/posts',postRoute);

// Start the server
app.listen(3000, () => console.log('Server up and running'));
