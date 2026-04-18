#!/usr/bin/env node

import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const { Client } = pg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function runMigration() {
  const postgresUrl = process.env.POSTGRES_URL;

  if (!postgresUrl) {
    console.error('❌ POSTGRES_URL environment variable not set');
    process.exit(1);
  }

  const client = new Client({
    connectionString: postgresUrl,
  });

  try {
    console.log('🔗 Connecting to PostgreSQL...');
    await client.connect();
    console.log('✅ Connected!');

    // Read SQL migration file
    const sqlPath = path.join(__dirname, '01-init-schema.sql');
    const sql = fs.readFileSync(sqlPath, 'utf-8');

    console.log('📋 Running database schema migration...');
    
    // Execute the entire SQL script
    await client.query(sql);
    
    console.log('✅ Database schema created successfully!');

    // Verify tables were created
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    console.log(`\n📊 Created ${result.rows.length} tables:`);
    result.rows.forEach(row => console.log(`   • ${row.table_name}`));

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    if (error.detail) console.error('Details:', error.detail);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigration();
