#!/usr/bin/env node

import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __dirname = new URL('.', import.meta.url).pathname;

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

console.log('🔄 Initializing database schema...');
console.log('📍 Supabase URL:', supabaseUrl);

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function runQuery(query) {
  try {
    const { data, error } = await supabase.rpc('sql_execute', {
      sql: query,
    });
    
    if (error) {
      // Some errors are expected for "already exists" cases
      if (error.message?.includes('already exists') || error.message?.includes('already defined')) {
        return { success: true, skipped: true, message: error.message };
      }
      return { success: false, error: error.message };
    }
    
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

async function initDb() {
  try {
    // Read the schema file
    const schemaPath = join(__dirname, '01-init-schema.sql');
    const sqlContent = readFileSync(schemaPath, 'utf-8');
    
    console.log('📝 SQL schema loaded');
    
    // For Supabase, we need to use the REST API to execute SQL
    // First, let's test the connection
    console.log('🧪 Testing Supabase connection...');
    const { data: { users }, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('❌ Connection test failed:', authError.message);
      process.exit(1);
    }
    
    console.log('✅ Connection successful');
    console.log('\n📌 Important: Supabase JS client cannot execute raw SQL directly.');
    console.log('Please use one of these methods:\n');
    console.log('Option 1: Supabase Dashboard SQL Editor');
    console.log('  1. Go to: https://app.supabase.com/project/_/sql/new');
    console.log('  2. Paste the contents of scripts/01-init-schema.sql');
    console.log('  3. Click "RUN"');
    console.log('');
    console.log('Option 2: Using psql (PostgreSQL client)');
    console.log(`  psql "${process.env.POSTGRES_URL}" < scripts/01-init-schema.sql`);
    console.log('');
    console.log('Option 3: Using the API endpoint');
    console.log('  curl -X POST http://localhost:3000/api/admin/setup-db');
    console.log('');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

initDb();
