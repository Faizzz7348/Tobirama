import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Simple .env parser
function loadEnv() {
  try {
    const envContent = fs.readFileSync('.env', 'utf-8');
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

// Get directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database configuration
const sql = neon(DATABASE_URL);

async function runMigration() {
  try {
    console.log('🚀 Starting Migration 005: Add Frozen Row Support...\n');

    console.log('📝 Adding frozen row columns...');
    
    // Step 1: Add columns
    await sql`
      ALTER TABLE "Location" 
      ADD COLUMN IF NOT EXISTS "isFrozen" BOOLEAN DEFAULT FALSE
    `;
    
    await sql`
      ALTER TABLE "Location" 
      ADD COLUMN IF NOT EXISTS "freezeOrder" INTEGER DEFAULT NULL
    `;
    
    await sql`
      ALTER TABLE "Location" 
      ADD COLUMN IF NOT EXISTS "allowEdit" BOOLEAN DEFAULT TRUE
    `;
    
    console.log('✅ Columns added successfully');

    // Step 2: Update QL Kitchen as frozen row
    console.log('📝 Setting QL Kitchen as frozen row...');
    const updateResult = await sql`
      UPDATE "Location"
      SET 
        "isFrozen" = TRUE,
        "freezeOrder" = 1,
        "allowEdit" = TRUE
      WHERE (code = 'QLK' OR location = 'QL Kitchen')
    `;
    console.log(`✅ Updated ${updateResult.length} row(s)`);

    // Step 3: Create indexes
    console.log('📝 Creating indexes...');
    await sql`
      CREATE INDEX IF NOT EXISTS idx_location_frozen 
      ON "Location"("isFrozen") WHERE "isFrozen" = TRUE
    `;
    
    await sql`
      CREATE INDEX IF NOT EXISTS idx_location_freeze_order 
      ON "Location"("freezeOrder") WHERE "freezeOrder" IS NOT NULL
    `;
    console.log('✅ Indexes created');

    console.log('✅ Migration 005 completed successfully!\n');

    // Verify the changes
    console.log('📊 Verification Results:\n');
    
    const columnsResult = await sql`
      SELECT 
        column_name,
        data_type,
        column_default,
        is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'Location'
        AND column_name IN ('isFrozen', 'freezeOrder', 'allowEdit')
      ORDER BY ordinal_position
    `;

    console.log('New Columns Added:');
    console.table(columnsResult);

    const frozenRowsResult = await sql`
      SELECT 
        id,
        code,
        location,
        "isFrozen",
        "freezeOrder",
        "allowEdit"
      FROM "Location"
      WHERE "isFrozen" = TRUE
      ORDER BY "freezeOrder"
    `;

    console.log('\nFrozen Rows:');
    if (frozenRowsResult.length > 0) {
      console.table(frozenRowsResult);
    } else {
      console.log('⚠️  No frozen rows found. You may need to update a location manually.');
    }

    console.log('\n🎉 Migration 005 completed successfully!');
    console.log('📝 Changes applied:');
    console.log('   ✅ Added isFrozen column (BOOLEAN)');
    console.log('   ✅ Added freezeOrder column (INTEGER)');
    console.log('   ✅ Added allowEdit column (BOOLEAN)');
    console.log('   ✅ Set QL Kitchen as frozen row (if exists)');
    console.log('   ✅ Created indexes for performance');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    console.error('Error details:', error.message);
    throw error;
  }
}

// Run migration
runMigration().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
