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

console.log('🔌 Connecting to database...');
const sql = neon(DATABASE_URL);

async function setupAndMigrate() {
  try {
    console.log('\n🚀 Starting complete database setup and migration...\n');
    console.log('=' .repeat(60));

    // ========================================
    // STEP 1: Create Base Tables
    // ========================================
    console.log('\n📋 STEP 1: Creating base tables...');
    console.log('-' .repeat(60));

    // Create Route table
    console.log('  Creating Route table...');
    await sql`
      CREATE TABLE IF NOT EXISTS "Route" (
        id BIGSERIAL PRIMARY KEY,
        route TEXT NOT NULL,
        shift TEXT NOT NULL,
        warehouse TEXT NOT NULL,
        description TEXT,
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW()
      )
    `;
    console.log('  ✅ Route table created');

    // Create Location table
    console.log('  Creating Location table...');
    await sql`
      CREATE TABLE IF NOT EXISTS "Location" (
        id SERIAL PRIMARY KEY,
        "routeId" BIGINT NOT NULL REFERENCES "Route"(id) ON DELETE CASCADE,
        location TEXT NOT NULL,
        code TEXT,
        no INTEGER,
        delivery TEXT,
        "powerMode" TEXT,
        latitude DOUBLE PRECISION,
        longitude DOUBLE PRECISION,
        address TEXT,
        description TEXT,
        images TEXT[] DEFAULT '{}',
        "websiteLink" TEXT,
        "qrCodeImageUrl" TEXT,
        "qrCodeDestinationUrl" TEXT,
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW()
      )
    `;
    console.log('  ✅ Location table created');

    // Create base indexes
    console.log('  Creating base indexes...');
    await sql`CREATE INDEX IF NOT EXISTS idx_location_routeId ON "Location"("routeId")`;
    await sql`CREATE INDEX IF NOT EXISTS idx_route_name ON "Route"(route)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_location_name ON "Location"(location)`;
    console.log('  ✅ Base indexes created');

    console.log('\n✅ STEP 1 COMPLETED: Base tables created');

    // ========================================
    // STEP 2: Migration 003 - Change routeId to BIGINT
    // ========================================
    console.log('\n📋 STEP 2: Running migration 003 (routeId to BIGINT)...');
    console.log('-' .repeat(60));

    // Check if already migrated
    const checkRoutIdType = await sql`
      SELECT data_type 
      FROM information_schema.columns 
      WHERE table_name = 'Location' 
      AND column_name = 'routeId'
    `;

    if (checkRoutIdType[0]?.data_type === 'integer') {
      console.log('  Converting routeId from INTEGER to BIGINT...');
      
      // Drop foreign key constraint first
      await sql`
        ALTER TABLE "Location" 
        DROP CONSTRAINT IF EXISTS "Location_routeId_fkey"
      `;
      
      // Change column type
      await sql`
        ALTER TABLE "Location" 
        ALTER COLUMN "routeId" TYPE BIGINT
      `;
      
      // Re-add foreign key constraint
      await sql`
        ALTER TABLE "Location" 
        ADD CONSTRAINT "Location_routeId_fkey" 
        FOREIGN KEY ("routeId") REFERENCES "Route"(id) ON DELETE CASCADE
      `;
      
      console.log('  ✅ routeId converted to BIGINT');
    } else {
      console.log('  ⏭️  routeId already BIGINT, skipping');
    }

    console.log('\n✅ STEP 2 COMPLETED: routeId is now BIGINT');

    // ========================================
    // STEP 3: Migration 004 - Add qrCodeImages array
    // ========================================
    console.log('\n📋 STEP 3: Running migration 004 (qrCodeImages array)...');
    console.log('-' .repeat(60));

    // Check if column exists
    const checkQrCodeImages = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'Location' 
      AND column_name = 'qrCodeImages'
    `;

    if (checkQrCodeImages.length === 0) {
      console.log('  Adding qrCodeImages column...');
      
      // Add new column
      await sql`
        ALTER TABLE "Location" 
        ADD COLUMN "qrCodeImages" JSONB DEFAULT '[]'
      `;
      console.log('  ✅ qrCodeImages column added');

      // Migrate existing data
      console.log('  Migrating existing QR code data...');
      const migrateResult = await sql`
        UPDATE "Location"
        SET "qrCodeImages" = jsonb_build_array(
            jsonb_build_object(
                'imageUrl', "qrCodeImageUrl",
                'destinationUrl', "qrCodeDestinationUrl",
                'title', 'QR Code',
                'id', floor(extract(epoch from NOW()) * 1000)
            )
        )
        WHERE "qrCodeImageUrl" IS NOT NULL 
          AND "qrCodeImageUrl" != ''
          AND ("qrCodeImages" IS NULL OR "qrCodeImages" = '[]'::jsonb)
        RETURNING id
      `;
      console.log(`  ✅ Migrated ${migrateResult.length} QR code(s)`);

      // Create index
      console.log('  Creating index for qrCodeImages...');
      await sql`
        CREATE INDEX IF NOT EXISTS idx_location_qrcode_images 
        ON "Location" USING GIN ("qrCodeImages")
      `;
      console.log('  ✅ Index created');
    } else {
      console.log('  ⏭️  qrCodeImages column already exists, skipping');
    }

    console.log('\n✅ STEP 3 COMPLETED: qrCodeImages support added');

    // ========================================
    // FINAL VERIFICATION
    // ========================================
    console.log('\n🔍 FINAL VERIFICATION...');
    console.log('=' .repeat(60));

    // Check Route table
    const routeCheck = await sql`
      SELECT COUNT(*) as count FROM "Route"
    `;
    console.log(`✅ Route table: ${routeCheck[0].count} row(s)`);

    // Check Location table
    const locationCheck = await sql`
      SELECT COUNT(*) as count FROM "Location"
    `;
    console.log(`✅ Location table: ${locationCheck[0].count} row(s)`);

    // Check qrCodeImages data
    const qrCodeCheck = await sql`
      SELECT COUNT(*) as count 
      FROM "Location" 
      WHERE "qrCodeImages" IS NOT NULL 
      AND "qrCodeImages" != '[]'::jsonb
    `;
    console.log(`✅ Locations with QR codes: ${qrCodeCheck[0].count} row(s)`);

    // Check schema
    const schemaCheck = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'Location' 
      AND column_name IN ('routeId', 'qrCodeImages')
      ORDER BY column_name
    `;
    console.log('\n📋 Schema verification:');
    schemaCheck.forEach(col => {
      console.log(`   - ${col.column_name}: ${col.data_type}`);
    });

    console.log('\n' + '=' .repeat(60));
    console.log('🎉 DATABASE SETUP AND MIGRATION COMPLETED SUCCESSFULLY!');
    console.log('=' .repeat(60));
    console.log('\n✅ Your database is ready to use!');
    console.log('✅ All tables created');
    console.log('✅ All migrations applied');
    console.log('✅ QR code multiple support enabled\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ SETUP FAILED:', error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  }
}

setupAndMigrate();
