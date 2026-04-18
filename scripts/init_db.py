#!/usr/bin/env python3
"""Initialize the VMC Complaint System database schema."""

import os
import sys
from pathlib import Path

# Add the project root to path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

def init_database():
    """Initialize the database with the schema."""
    try:
        import psycopg2
        from psycopg2 import sql
    except ImportError:
        print("❌ psycopg2 not installed. Installing...")
        os.system("uv pip install --system psycopg2-binary")
        import psycopg2
        from psycopg2 import sql

    # Get database credentials from environment
    db_url = os.getenv("POSTGRES_URL")
    if not db_url:
        print("❌ POSTGRES_URL environment variable not set")
        sys.exit(1)

    print(f"🔄 Connecting to database...")
    
    try:
        conn = psycopg2.connect(db_url)
        cursor = conn.cursor()
        print("✅ Connected to database")

        # Read the SQL schema file
        schema_file = project_root / "scripts" / "01-init-schema.sql"
        with open(schema_file, "r") as f:
            schema_sql = f.read()

        print(f"📝 Executing schema (found {len(schema_sql)} characters)...")
        
        # Execute the entire schema at once
        cursor.execute(schema_sql)
        conn.commit()
        
        print("✅ Schema created successfully!")

        cursor.close()
        conn.close()

    except psycopg2.Error as e:
        print(f"❌ Database error: {e}")
        sys.exit(1)
    except FileNotFoundError:
        print(f"❌ Schema file not found: {schema_file}")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    init_database()
