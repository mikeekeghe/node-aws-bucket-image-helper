const express = require('express');
const AWS = require('aws-sdk');
const bodyParser = require('body-parser');
const axios = require('axios');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

const ACCESS_KEY_ID =process.env.ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY;
const AWS_REGION = process.env.AWS_REGION;
const BUCKET_NAME = process.env.BUCKET_NAME;

console.log(ACCESS_KEY_ID);
console.log(SECRET_ACCESS_KEY);
console.log(AWS_REGION);
console.log(BUCKET_NAME);

// Configure AWS
AWS.config.update({
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
    region: AWS_REGION
});

const s3 = new AWS.S3();
const app = express();
app.use(bodyParser.json());

// Generate a secure URL from your server
app.get('/getSecureUrl', (req, res) => {
    const params = {
        Bucket: BUCKET_NAME,
        Key: 'exajhugbygufmple.jpg', // Replace with a unique filename
        Expires: 60 * 5 // URL expiration time in seconds (5 minutes in this case)
    };

    const url = s3.getSignedUrl('putObject', params);
    res.json({ secureUrl: url });
});

// Handle direct image upload to S3
app.post('/uploadToS3', (req, res) => {
    const imageUrl = req.body.imageUrl; // URL received from the previous step

    // Upload image to S3
    axios.put(imageUrl, fs.readFileSync('path/to/local/image.jpg'))
      .then(response => {
        res.json({ message: 'Image uploaded to S3' });
      })
      .catch(error => {
        res.status(500).json({ error: 'Failed to upload image to S3' });
      });
});

// Store image metadata on your server
app.post('/storeMetadata', (req, res) => {
    const imageData = req.body; // Assuming the request body contains image metadata

    // Here, you can store the image metadata in your preferred way (e.g., in a database)
    // Example code:
    // YourDatabase.saveImageMetadata(imageData);

    res.json({ message: 'Image metadata stored' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


/*
Please note that this is a basic example,
and in a production environment, you should
consider adding error handling, input validation,
and security measures to protect your application and data.
 */
