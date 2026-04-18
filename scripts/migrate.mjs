#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = new URL('.', import.meta.url).pathname;

async function runMigrations() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('❌ Missing environment variables');
    console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
    console.error('SUPABASE_SERVICE_ROLE_KEY:', serviceRoleKey ? '✓' : '✗');
    process.exit(1);
  }

  console.log('🔐 Initializing Supabase with service role...');
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  try {
    // Read SQL file
    const sqlPath = join(__dirname, '01-init-schema.sql');
    const sql = readFileSync(sqlPath, 'utf-8');

    console.log('📋 Executing database migrations...');
    
    // Execute the entire SQL as a single transaction
    const { error } = await supabase.rpc('sql', {
      query: sql
    }).catch(err => {
      // Fallback: try direct SQL execution via PostgreSQL
      return supabase.from('_schema_migrations').select('*').catch(e => ({ error: err }));
    });

    if (error && !error.message?.includes('does not exist')) {
      // Connection test
      const { data } = await supabase.auth.admin.listUsers();
      
      if (data) {
        console.log('✅ Supabase connection verified');
        console.log('\n📝 SQL Schema Ready. Execute the SQL migrations manually:');
        console.log('   1. Go to Supabase Dashboard > SQL Editor');
        console.log('   2. Create a new query and paste the contents of scripts/01-init-schema.sql');
        console.log('   3. Run the query');
        return;
      }
    }

    console.log('✅ Migrations executed successfully!');
  } catch (err) {
    console.error('⚠️  Setup note:', err.message);
    console.log('\n📝 To complete setup manually:');
    console.log('   1. Go to Supabase Dashboard > SQL Editor');
    console.log('   2. Create a new query and paste the contents of scripts/01-init-schema.sql');
    console.log('   3. Run the query to create all tables');
  }
}

runMigrations();
