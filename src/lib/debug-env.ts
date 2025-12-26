import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

console.log('🔍 Debugging environment variables...');

// Check if .env.local exists
const envLocalPath = path.join(process.cwd(), '.env.local');
console.log(`📄 Checking for .env.local at: ${envLocalPath}`);
console.log(`📄 File exists: ${fs.existsSync(envLocalPath)}`);

if (fs.existsSync(envLocalPath)) {
  console.log('📄 .env.local content:');
  console.log(fs.readFileSync(envLocalPath, 'utf8'));
}

// Try to load .env.local explicitly
console.log('\n🔄 Loading .env.local explicitly...');
const result = dotenv.config({ path: '.env.local' });

console.log(`📊 Dotenv result:`, result);

console.log('\n🔄 Current environment variables:');
console.log(`MONGODB_URI: ${process.env.MONGODB_URI || 'NOT FOUND'}`);
console.log(`MONGODB_DB: ${process.env.MONGODB_DB || 'NOT FOUND'}`);
console.log(`NODE_ENV: ${process.env.NODE_ENV || 'NOT FOUND'}`);

console.log('\n✅ Debug complete');
