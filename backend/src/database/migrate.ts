import { readFileSync } from 'fs';
import { join } from 'path';
import { query, testConnection } from '../config/database';

const runMigration = async () => {
  try {
    console.log('🔄 Starting database migration...');

    // Test connection first
    const connected = await testConnection();
    if (!connected) {
      console.error('❌ Database connection failed. Please check your DATABASE_URL.');
      process.exit(1);
    }

    // Read and execute schema
    const schemaPath = join(__dirname, '../../database/schema.sql');
    const schema = readFileSync(schemaPath, 'utf-8');

    // Split by semicolons and execute each statement
    const statements = schema
      .split(';')
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith('--'));

    for (const statement of statements) {
      if (statement) {
        try {
          await query(statement);
        } catch (error: any) {
          // Ignore "already exists" errors
          if (error.code !== '42P07' && error.code !== '42710') {
            console.error('Migration error:', error.message);
            throw error;
          }
        }
      }
    }

    console.log('✅ Database migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

runMigration();
