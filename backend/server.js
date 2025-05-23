const express = require('express');
const cors = require('cors');
const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5001;

// Cache configuration
let secretCache = null;
let lastFetchTime = null;
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; 

// Middleware
app.use(cors());
app.use(express.json());

// Initialize AWS Secrets Manager client
const secretsClient = new SecretsManagerClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

// Function to get secret from AWS Secrets Manager with caching
async function getSecret(secretName) {
  const now = Date.now();
  
  // Return cached secret if it exists and is not expired
  if (secretCache && lastFetchTime && (now - lastFetchTime < CACHE_DURATION)) {
    console.log('Returning cached secret');
    return secretCache;
  }

  try {
    console.log('Fetching fresh secret from AWS');
    const response = await secretsClient.send(
      new GetSecretValueCommand({
        SecretId: secretName,
        VersionStage: "AWSCURRENT"
      })
    );
    
    // Update cache
    secretCache = JSON.parse(response.SecretString);
    lastFetchTime = now;
    
    return secretCache;
  } catch (error) {
    console.error('Error fetching secret:', error);
    throw error;
  }
}

// API endpoint to get API keys
app.get('/api/keys', async (req, res) => {
  try {
    const secret = await getSecret('chat-api-keys');
    res.json({ data: secret });
  } catch (error) {
    console.error('Error fetching API keys:', error);
    res.status(500).json({ 
      error: 'Failed to fetch API keys',
      details: error.message 
    });
  }
});

// Test endpoint to verify AWS connection
app.get('/api/test-aws', async (req, res) => {
  try {
    const secret = await getSecret('chat-api-keys');
    res.json({ 
      message: 'Successfully connected to AWS Secrets Manager',
      secretKeys: Object.keys(secret)
    });
  } catch (error) {
    console.error('AWS connection test failed:', error);
    res.status(500).json({ 
      error: 'Failed to connect to AWS Secrets Manager',
      details: error.message 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    details: err.message 
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 