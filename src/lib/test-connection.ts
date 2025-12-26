import { checkConnection, getDatabase } from './mongodb';
import { createIndexes } from './models';

export async function testMongoDBConnection() {
  console.log('🔍 Testing MongoDB connection...');
  
  try {
    // Test basic connection
    const connectionStatus = await checkConnection();
    
    if (connectionStatus.connected) {
      console.log(`✅ MongoDB connection successful!`);
      console.log(`📊 Connected to database: ${connectionStatus.dbName}`);
      
      // Test database operations
      const db = await getDatabase();
      
      // Test collection access
      const collections = await db.listCollections().toArray();
      console.log(`📋 Found ${collections.length} collections:`);
      collections.forEach(collection => {
        console.log(`   - ${collection.name}`);
      });
      
      // Test index creation
      await createIndexes(db);
      console.log('✅ Database setup completed successfully!');
      
      return {
        success: true,
        message: 'MongoDB connection and setup successful',
        dbName: connectionStatus.dbName,
        collections: collections.length
      };
      
    } else {
      console.error('❌ MongoDB connection failed:', connectionStatus.error);
      return {
        success: false,
        message: 'MongoDB connection failed',
        error: connectionStatus.error
      };
    }
    
  } catch (error) {
    console.error('❌ Error testing MongoDB connection:', error);
    return {
      success: false,
      message: 'Error testing MongoDB connection',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testMongoDBConnection()
    .then((result) => {
      console.log('\n🎯 Test Result:', result);
      process.exit(result.success ? 0 : 1);
    })
    .catch((error) => {
      console.error('💥 Test failed:', error);
      process.exit(1);
    });
}
