#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function setupDatabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Error: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  console.log('📦 Initializing Supabase client...');
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Read the SQL file
    const sqlPath = path.join(__dirname, '01-init-schema.sql');
    const sql = fs.readFileSync(sqlPath, 'utf-8');

    console.log('📋 Running database schema migration...');
    
    // Split SQL into statements and execute
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s && !s.startsWith('--'));

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      try {
        await supabase.rpc('execute_sql', { sql: statement + ';' }).then(({ error }) => {
          if (error) throw error;
        });
        process.stdout.write('.');
      } catch (err) {
        // Many statements may fail if they already exist - that's OK
        if (err.message && (err.message.includes('already exists') || err.message.includes('duplicate'))) {
          process.stdout.write('✓');
        } else {
          console.error(`\nError executing statement: ${statement.substring(0, 50)}...`);
          console.error(err.message);
        }
      }
    }

    console.log('\n✅ Database schema setup complete!');
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

setupDatabase();
