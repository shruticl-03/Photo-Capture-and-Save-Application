const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Use CORS middleware to handle cross-origin requests
app.use(cors());

// Middleware to parse JSON
app.use(bodyParser.json({ limit: '10mb' }));

// Helper function to get the current date as a folder name
function getCurrentDateFolder() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Route to save the image
app.post('/save', (req, res) => {
    const imageData = req.body.image;
    const base64Data = imageData.replace(/^data:image\/png;base64,/, '');

    // Create the main "photos" folder and date subfolder
    const photosFolder = path.join(__dirname, 'photos');
    const dateFolder = path.join(photosFolder, getCurrentDateFolder());

    // Ensure the "photos" and date folders exist
    if (!fs.existsSync(photosFolder)) {
        fs.mkdirSync(photosFolder, { recursive: true });
    }
    if (!fs.existsSync(dateFolder)) {
        fs.mkdirSync(dateFolder, { recursive: true });
    }

    // Define the file path to save the image
    const fileName = `photo_${Date.now()}.png`; // Unique filename
    const filePath = path.join(dateFolder, fileName);

    // Write the image to the file
    fs.writeFile(filePath, base64Data, 'base64', (err) => {
        if (err) {
            console.error('Error saving photo:', err);
            return res.status(500).send('Failed to save photo.');
        }
        console.log(`Photo saved at: ${filePath}`);
        res.send('Photo saved successfully!');
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
