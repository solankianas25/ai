import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function initializeDatabase() {
  try {
    console.log('🔄 Initializing database...');
    
    // Read the SQL schema file
    const schemaPath = path.join(__dirname, '01-init-schema.sql');
    const sqlContent = fs.readFileSync(schemaPath, 'utf-8');
    
    // Use the postgres client from Supabase
    // Note: We need to split queries carefully and execute them individually
    console.log('📝 SQL schema loaded, executing via setup endpoint...');
    
    // Instead, let's make a request to the setup endpoint with proper auth
    const response = await fetch(`${supabaseUrl}/functions/v1/setup-db`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json',
      },
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Database initialized successfully');
      console.log(result);
    } else {
      console.error('❌ Database initialization failed:', result);
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

initializeDatabase();
