#!/usr/bin/env python3
"""
Database Migration Script
This script helps migrate data from SQLite to cloud databases
"""

import os
import sys
import sqlite3
from datetime import datetime
from decimal import Decimal
import json

def get_sqlite_data(db_path):
    """Extract data from SQLite database"""
    if not os.path.exists(db_path):
        print(f"SQLite database not found at {db_path}")
        return None
    
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    data = {}
    
    # Get all tables
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = [row[0] for row in cursor.fetchall()]
    
    for table in tables:
        cursor.execute(f"SELECT * FROM {table}")
        rows = cursor.fetchall()
        data[table] = [dict(row) for row in rows]
        print(f"Extracted {len(rows)} records from {table}")
    
    conn.close()
    return data

def create_migration_sql(data):
    """Create SQL migration script"""
    sql_script = []
    sql_script.append("-- Database Migration Script")
    sql_script.append(f"-- Generated on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    sql_script.append("")
    
    # Insert users data
    if 'users' in data:
        sql_script.append("-- Insert Users")
        for user in data['users']:
            sql_script.append(f"""
INSERT INTO users (id, username, email, password_hash, role, created_at, last_login, is_active, biometric_id, face_data, auth_method)
VALUES ({user['id']}, '{user['username']}', '{user['email']}', '{user['password_hash']}', '{user['role']}', 
        '{user['created_at']}', {f"'{user['last_login']}'" if user['last_login'] else 'NULL'}, 
        {user['is_active']}, {f"'{user['biometric_id']}'" if user['biometric_id'] else 'NULL'}, 
        {f"'{user['face_data']}'" if user['face_data'] else 'NULL'}, 
        {f"'{user['auth_method']}'" if user['auth_method'] else 'NULL'})
ON CONFLICT (id) DO NOTHING;""")
    
    # Insert students data
    if 'students' in data:
        sql_script.append("\n-- Insert Students")
        for student in data['students']:
            sql_script.append(f"""
INSERT INTO students (id, name, roll_number, gender, category, academic_year, branch, fee_type, bill_number, 
                     total_fees, paid_amount, pending_amount, created_at, updated_at, biometric_id)
VALUES ({student['id']}, '{student['name']}', '{student['roll_number']}', 
        {f"'{student['gender']}'" if student['gender'] else 'NULL'}, 
        '{student['category']}', '{student['academic_year']}', '{student['branch']}', 
        {f"'{student['fee_type']}'" if student['fee_type'] else 'NULL'}, 
        {f"'{student['bill_number']}'" if student['bill_number'] else 'NULL'}, 
        {student['total_fees']}, {student['paid_amount']}, {student['pending_amount']}, 
        '{student['created_at']}', '{student['updated_at']}', 
        {f"'{student['biometric_id']}'" if student['biometric_id'] else 'NULL'})
ON CONFLICT (id) DO NOTHING;""")
    
    # Insert transactions data
    if 'transactions' in data:
        sql_script.append("\n-- Insert Transactions")
        for transaction in data['transactions']:
            sql_script.append(f"""
INSERT INTO transactions (id, transaction_id, student_id, amount, fee_type, academic_year, utr_number, 
                         bill_number, status, verification_comment, verified_by, verified_at, date, 
                         mobile_number, created_at)
VALUES ({transaction['id']}, '{transaction['transaction_id']}', {transaction['student_id']}, 
        {transaction['amount']}, '{transaction['fee_type']}', '{transaction['academic_year']}', 
        {f"'{transaction['utr_number']}'" if transaction['utr_number'] else 'NULL'}, 
        {f"'{transaction['bill_number']}'" if transaction['bill_number'] else 'NULL'}, 
        '{transaction['status']}', 
        {f"'{transaction['verification_comment']}'" if transaction['verification_comment'] else 'NULL'}, 
        {transaction['verified_by'] if transaction['verified_by'] else 'NULL'}, 
        {f"'{transaction['verified_at']}'" if transaction['verified_at'] else 'NULL'}, 
        '{transaction['date']}', 
        {f"'{transaction['mobile_number']}'" if transaction['mobile_number'] else 'NULL'}, 
        '{transaction['created_at']}')
ON CONFLICT (id) DO NOTHING;""")
    
    # Insert complaints data
    if 'complaints' in data:
        sql_script.append("\n-- Insert Complaints")
        for complaint in data['complaints']:
            sql_script.append(f"""
INSERT INTO complaints (id, complaint_id, student_id, subject, description, status, response, 
                       responded_by, created_at, updated_at)
VALUES ({complaint['id']}, '{complaint['complaint_id']}', {complaint['student_id']}, 
        '{complaint['subject']}', '{complaint['description']}', '{complaint['status']}', 
        {f"'{complaint['response']}'" if complaint['response'] else 'NULL'}, 
        {complaint['responded_by'] if complaint['responded_by'] else 'NULL'}, 
        '{complaint['created_at']}', '{complaint['updated_at']}')
ON CONFLICT (id) DO NOTHING;""")
    
    return "\n".join(sql_script)

def main():
    """Main migration function"""
    print("Fee Management System - Database Migration Tool")
    print("=" * 50)
    
    # Get SQLite database path
    base_dir = os.path.dirname(os.path.abspath(__file__))
    sqlite_path = os.path.join(base_dir, 'instance', 'fee_management.db')
    
    print(f"Looking for SQLite database at: {sqlite_path}")
    
    # Extract data from SQLite
    data = get_sqlite_data(sqlite_path)
    if not data:
        print("No data found to migrate.")
        return
    
    # Create migration SQL
    migration_sql = create_migration_sql(data)
    
    # Save migration script
    migration_file = os.path.join(base_dir, 'migration_script.sql')
    with open(migration_file, 'w', encoding='utf-8') as f:
        f.write(migration_sql)
    
    print(f"\nMigration script created: {migration_file}")
    print("\nTo use this script:")
    print("1. Set up your cloud database")
    print("2. Run the Flask app to create tables in the cloud database")
    print("3. Execute the migration script on your cloud database")
    print("\nExample for PostgreSQL:")
    print(f"psql -h your-host -U your-username -d your-database -f {migration_file}")
    print("\nExample for MySQL:")
    print(f"mysql -h your-host -u your-username -p your-database < {migration_file}")

if __name__ == "__main__":
    main()
