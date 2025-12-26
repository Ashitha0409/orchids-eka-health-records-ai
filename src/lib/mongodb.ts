import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';

// Load environment variables from .env.local explicitly
dotenv.config({ path: '.env.local' });

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'health_records_db';

// Check if the password placeholder is still in the URI
if (uri.includes('<db_password>')) {
  console.warn('⚠️  Please replace <db_password> in your MONGODB_URI with your actual database password');
}

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!global._mongoClientPromise) {
  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 5000, // 5 seconds
  });
  
  global._mongoClientPromise = client.connect().then(async (connectedClient) => {
    console.log('✅ Connected to MongoDB successfully');
    
    // Test the connection by pinging
    await connectedClient.db('admin').command({ ping: 1 });
    console.log('✅ MongoDB ping successful');
    
    return connectedClient;
  }).catch((error) => {
    console.error('❌ Failed to connect to MongoDB:', error);
    throw error;
  });
}

export async function getMongoClient(): Promise<MongoClient> {
  if (!global._mongoClientPromise) {
    throw new Error('MongoDB client not initialized');
  }
  return global._mongoClientPromise;
}

export async function getDatabase(): Promise<Db> {
  const client = await getMongoClient();
  return client.db(dbName);
}

// Connection status checker
export async function checkConnection(): Promise<{ connected: boolean; error?: string; dbName?: string }> {
  try {
    const db = await getDatabase();
    await db.command({ ping: 1 });
    return {
      connected: true,
      dbName: db.databaseName
    };
  } catch (error) {
    return {
      connected: false,
      error: error instanceof Error ? error.message : 'Unknown connection error'
    };
  }
}

// Graceful shutdown
export async function closeConnection(): Promise<void> {
  try {
    const client = await getMongoClient();
    await client.close();
    console.log('🔌 MongoDB connection closed');
  } catch (error) {
    console.error('❌ Error closing MongoDB connection:', error);
  }
}
