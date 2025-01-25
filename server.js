const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const multer = require('multer'); // Import multer for file uploads

const app = express();
const PORT = 3000;

// Set up storage configuration for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Store uploaded images in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Use a unique name for the file
  },
});

const upload = multer({ storage: storage });

// Serve static files (like CSS, JS, and images) from the 'public' and 'uploads' folders
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));  // Ensure serving the uploads folder

// Middleware to parse incoming request bodies
app.use(bodyParser.json());

// Serve the index.html file when accessing the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Path to the comments JSON file
const commentsFile = path.join(__dirname, 'comments.json');

// Get all comments
app.get('/comments', (req, res) => {
  fs.readFile(commentsFile, 'utf-8', (err, data) => {
    if (err) {
      console.error('Error reading comments file:', err);
      return res.status(500).json({ message: 'Error reading comments file' });
    }
    res.json(JSON.parse(data));
  });
});

// Post a new comment with an optional image
app.post('/comments', upload.single('image'), (req, res) => {
  const { name, message } = req.body;

  if (!name || !message) {
    return res.status(400).json({ message: 'Name and message are required' });
  }

  // If there's an image, use its filename, otherwise set to null
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  // Read the existing comments
  fs.readFile(commentsFile, 'utf-8', (err, data) => {
    if (err) {
      console.error('Error reading comments file:', err);
      return res.status(500).json({ message: 'Error reading comments file' });
    }

    try {
      const comments = JSON.parse(data);
      comments.push({ name, message, imageUrl });

      // Save the updated comments back to the file
      fs.writeFile(commentsFile, JSON.stringify(comments, null, 2), (err) => {
        if (err) {
          console.error('Error saving comments:', err);
          return res.status(500).json({ message: 'Error saving comment' });
        }
        console.log('Comment added successfully');
        res.status(200).json({ message: 'Comment added successfully' });
      });
    } catch (err) {
      console.error('Error parsing comments:', err);
      return res.status(500).json({ message: 'Error parsing comments file' });
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
