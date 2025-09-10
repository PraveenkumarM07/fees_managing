#!/usr/bin/env python3
"""
Test script to verify cloud database deployment
"""

import os
import sys
from dotenv import load_dotenv

def test_imports():
    """Test if all required modules can be imported"""
    print("Testing imports...")
    try:
        from main import app, db, User, Student, Transaction, Complaint
        print("✅ All imports successful")
        return True
    except ImportError as e:
        print(f"❌ Import error: {e}")
        return False

def test_database_connection():
    """Test database connection"""
    print("Testing database connection...")
    try:
        from main import app, db
        with app.app_context():
            # Test basic connection
            result = db.engine.execute('SELECT 1 as test').fetchone()
            if result and result[0] == 1:
                print("✅ Database connection successful")
                return True
            else:
                print("❌ Database connection test failed")
                return False
    except Exception as e:
        print(f"❌ Database connection error: {e}")
        return False

def test_tables_exist():
    """Test if all required tables exist"""
    print("Testing table existence...")
    try:
        from main import app, db
        with app.app_context():
            # Check if tables exist
            inspector = db.inspect(db.engine)
            tables = inspector.get_table_names()
            
            required_tables = ['users', 'students', 'transactions', 'complaints']
            missing_tables = [table for table in required_tables if table not in tables]
            
            if missing_tables:
                print(f"❌ Missing tables: {missing_tables}")
                return False
            else:
                print("✅ All required tables exist")
                return True
    except Exception as e:
        print(f"❌ Table check error: {e}")
        return False

def test_basic_operations():
    """Test basic database operations"""
    print("Testing basic operations...")
    try:
        from main import app, db, User
        with app.app_context():
            # Test user creation
            test_user = User(
                username='test_user',
                email='test@example.com',
                role='employee'
            )
            test_user.set_password('test_password')
            
            # Add to database
            db.session.add(test_user)
            db.session.commit()
            
            # Query user
            found_user = User.query.filter_by(email='test@example.com').first()
            if found_user and found_user.check_password('test_password'):
                print("✅ Basic operations successful")
                
                # Clean up
                db.session.delete(found_user)
                db.session.commit()
                return True
            else:
                print("❌ Basic operations failed")
                return False
    except Exception as e:
        print(f"❌ Basic operations error: {e}")
        return False

def main():
    """Main test function"""
    print("🧪 Fee Management System - Deployment Test")
    print("=" * 50)
    
    # Load environment variables
    load_dotenv()
    
    # Check if DATABASE_URL is set
    if not os.getenv('DATABASE_URL'):
        print("❌ DATABASE_URL environment variable not set")
        print("Please set your cloud database URL in .env file")
        return False
    
    print(f"Using database: {os.getenv('DATABASE_URL')[:50]}...")
    
    # Run tests
    tests = [
        test_imports,
        test_database_connection,
        test_tables_exist,
        test_basic_operations
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        if test():
            passed += 1
        print()
    
    print(f"Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! Your application is ready for deployment.")
        return True
    else:
        print("❌ Some tests failed. Please check your configuration.")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
