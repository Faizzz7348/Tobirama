import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';

// Simple .env parser
function loadEnv() {
  try {
    const envContent = readFileSync('.env', 'utf-8');
    const envVars = {};
    
    envContent.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key) {
          envVars[key] = valueParts.join('=').replace(/^['"]|['"]$/g, '');
        }
      }
    });
    
    return envVars;
  } catch (error) {
    console.error('❌ Failed to load .env file:', error.message);
    return {};
  }
}

const envVars = loadEnv();
const DATABASE_URL = envVars.VITE_DATABASE_URL || process.env.VITE_DATABASE_URL || process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL not found in .env or environment variables');
  console.error('Make sure .env file exists and has VITE_DATABASE_URL');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function runMigration() {
  try {
    console.log('🚀 Running migration 004: Add qrCodeImages array...\n');

    // Read and execute migration SQL
    const migrationSQL = readFileSync('./migrations/004_add_qrcode_images_array.sql', 'utf-8');
    
    // Split by semicolon and execute each statement
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    for (const statement of statements) {
      if (statement) {
        console.log('📝 Executing:', statement.substring(0, 100) + '...');
        await sql(statement);
        console.log('✅ Done\n');
      }
    }

    // Verify the migration
    console.log('🔍 Verifying migration...');
    const result = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'Location' 
      AND column_name = 'qrCodeImages'
    `;
    
    if (result.length > 0) {
      console.log('✅ Column "qrCodeImages" exists with type:', result[0].data_type);
    } else {
      throw new Error('Column "qrCodeImages" was not created');
    }

    // Check if data was migrated
    const migratedCount = await sql`
      SELECT COUNT(*) as count 
      FROM "Location" 
      WHERE "qrCodeImages" IS NOT NULL 
      AND "qrCodeImages" != '[]'::jsonb
    `;
    
    console.log(`📊 ${migratedCount[0].count} location(s) have QR code data\n`);

    console.log('🎉 Migration 004 completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

runMigration();
