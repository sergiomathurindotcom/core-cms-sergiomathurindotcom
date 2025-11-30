// Load environment variables - check local .env first, then fallback to root .env
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

const localEnvPath = path.resolve(__dirname, '.env');
const rootEnvPath = path.resolve(__dirname, '../.env');

// Check local .env first, then fallback to root .env, then assume system env vars
if (fs.existsSync(localEnvPath)) {
  dotenv.config({ path: localEnvPath });
  console.log(`Loaded environment from: ${localEnvPath}`);
} else if (fs.existsSync(rootEnvPath)) {
  dotenv.config({ path: rootEnvPath });
  console.log(`Loaded environment from: ${rootEnvPath}`);
} else {
  // No .env file found - assume env vars are already loaded into system
  console.log('No .env file found - using system environment variables');
}
