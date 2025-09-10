#!/usr/bin/env python3
"""
Deployment Helper Script
This script helps prepare your application for cloud deployment
"""

import os
import sys
import subprocess
from pathlib import Path

def check_requirements():
    """Check if all required packages are installed"""
    print("Checking requirements...")
    try:
        with open('requirements.txt', 'r') as f:
            requirements = f.read().splitlines()
        
        missing_packages = []
        for requirement in requirements:
            if requirement.strip() and not requirement.startswith('#'):
                package = requirement.split('==')[0].split('>=')[0].split('<=')[0]
                try:
                    __import__(package.replace('-', '_'))
                except ImportError:
                    missing_packages.append(package)
        
        if missing_packages:
            print(f"Missing packages: {', '.join(missing_packages)}")
            print("Installing missing packages...")
            subprocess.run([sys.executable, '-m', 'pip', 'install'] + missing_packages)
        else:
            print("✅ All requirements satisfied")
            
    except FileNotFoundError:
        print("❌ requirements.txt not found")
        return False
    
    return True

def create_env_file():
    """Create .env file if it doesn't exist"""
    env_file = Path('.env')
    if not env_file.exists():
        print("Creating .env file...")
        env_content = """# Database Configuration
# Replace with your actual cloud database URL
DATABASE_URL=postgresql://username:password@host:port/database_name

# Flask Configuration
FLASK_ENV=production
SECRET_KEY=your-secret-key-here

# Security Settings
SESSION_COOKIE_SECURE=True
SESSION_COOKIE_HTTPONLY=True
SESSION_COOKIE_SAMESITE=Lax

# CORS Settings
CORS_ORIGINS=*
"""
        with open('.env', 'w') as f:
            f.write(env_content)
        print("✅ .env file created")
        print("⚠️  Please update the DATABASE_URL in .env with your actual cloud database URL")
    else:
        print("✅ .env file already exists")

def test_database_connection():
    """Test database connection"""
    print("Testing database connection...")
    try:
        from main import app, db
        with app.app_context():
            # Try to connect to database
            db.engine.execute('SELECT 1')
            print("✅ Database connection successful")
            return True
    except Exception as e:
        print(f"❌ Database connection failed: {str(e)}")
        print("Please check your DATABASE_URL in .env file")
        return False

def create_tables():
    """Create database tables"""
    print("Creating database tables...")
    try:
        from main import app, db
        with app.app_context():
            db.create_all()
            print("✅ Database tables created successfully")
            return True
    except Exception as e:
        print(f"❌ Failed to create tables: {str(e)}")
        return False

def run_migrations():
    """Run database migrations"""
    print("Running database migrations...")
    try:
        from main import app, db
        with app.app_context():
            # Initialize migration if needed
            if not os.path.exists('migrations'):
                subprocess.run(['flask', 'db', 'init'])
            
            # Create migration
            subprocess.run(['flask', 'db', 'migrate', '-m', 'Initial migration'])
            
            # Apply migration
            subprocess.run(['flask', 'db', 'upgrade'])
            
            print("✅ Database migrations completed")
            return True
    except Exception as e:
        print(f"❌ Migration failed: {str(e)}")
        return False

def main():
    """Main deployment preparation function"""
    print("🚀 Fee Management System - Deployment Preparation")
    print("=" * 50)
    
    # Check if we're in the right directory
    if not os.path.exists('main.py'):
        print("❌ main.py not found. Please run this script from the project root directory.")
        return
    
    # Step 1: Check requirements
    if not check_requirements():
        return
    
    # Step 2: Create .env file
    create_env_file()
    
    # Step 3: Test database connection
    if not test_database_connection():
        print("\n⚠️  Please update your DATABASE_URL in .env file and try again.")
        print("You can get your database URL from:")
        print("- Railway: Dashboard → Database → Connect")
        print("- Supabase: Settings → Database → Connection string")
        print("- Neon: Dashboard → Connection Details")
        print("- PlanetScale: Database → Connect")
        return
    
    # Step 4: Create tables
    if not create_tables():
        return
    
    # Step 5: Run migrations
    if not run_migrations():
        return
    
    print("\n🎉 Deployment preparation completed successfully!")
    print("\nNext steps:")
    print("1. Your application is ready for deployment")
    print("2. Choose a hosting platform (Railway, Heroku, Render, etc.)")
    print("3. Set the same environment variables in your hosting platform")
    print("4. Deploy your application")
    print("\nFor detailed instructions, see CLOUD_DEPLOYMENT_GUIDE.md")

if __name__ == "__main__":
    main()
