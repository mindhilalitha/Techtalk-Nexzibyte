import sqlite3
import os

for db_path in ['backend/techtalk_local.db', 'techtalk_local.db']:
    if not os.path.exists(db_path):
        continue
    try:
        conn = sqlite3.connect(db_path)
        cur = conn.cursor()
        
        cur.execute("PRAGMA table_info(users)")
        cols = [c[1] for c in cur.fetchall()]
        print(f"{db_path} existing columns count: {len(cols)}")
        
        new_cols = [
            ("timezone", "TEXT DEFAULT '(GMT +05:30) Chennai'"),
            ("headline", "TEXT"),
            ("linkedin_url", "TEXT"),
            ("department", "TEXT"),
            ("experience_years", "TEXT"),
            ("job_search_status", "TEXT"),
            ("job_search_duration", "TEXT"),
            ("visa_status", "TEXT"),
            ("career_challenge", "TEXT"),
            ("mentorship_interest", "TEXT"),
            ("accountability_group_interest", "TEXT"),
            ("share_profile_with_partners", "TEXT"),
            ("referral_source", "TEXT"),
            ("permission_email_public", "INTEGER DEFAULT 0"),
            ("permission_prevent_messages", "INTEGER DEFAULT 0"),
            ("permission_show_directory", "INTEGER DEFAULT 1"),
            ("profile_completed", "INTEGER DEFAULT 0"),
            ("reset_password_token", "TEXT"),
            ("reset_password_otp", "TEXT"),
            ("reset_password_expires_at", "DATETIME")
        ]
        
        for col_name, col_type in new_cols:
            if col_name not in cols:
                print(f"Adding column {col_name} to {db_path}...")
                cur.execute(f"ALTER TABLE users ADD COLUMN {col_name} {col_type}")
        
        conn.commit()
        conn.close()
        print(f"Migration completed for {db_path}!")
    except Exception as e:
        print(f"Error migrating {db_path}: {e}")
