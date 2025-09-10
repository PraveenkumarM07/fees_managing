#!/usr/bin/env python3
"""
Quick Start Script for Cloud Database Setup
This script will guide you through setting up a cloud database quickly
"""

import os
import webbrowser
from pathlib import Path

def print_banner():
    """Print welcome banner"""
    print("🚀 Fee Management System - Quick Start")
    print("=" * 50)
    print("This script will help you set up a cloud database for your application.")
    print()

def show_options():
    """Show available cloud database options"""
    print("Choose your preferred cloud database provider:")
    print()
    print("1. Railway.app (Recommended - Easiest)")
    print("   - Free PostgreSQL database")
    print("   - Automatic deployment")
    print("   - No credit card required")
    print()
    print("2. Supabase")
    print("   - Free PostgreSQL database")
    print("   - 500MB storage")
    print("   - Great for development")
    print()
    print("3. Neon.tech")
    print("   - Free PostgreSQL database")
    print("   - 3GB storage")
    print("   - Serverless PostgreSQL")
    print()
    print("4. PlanetScale")
    print("   - Free MySQL database")
    print("   - 1GB storage")
    print("   - Branching for databases")
    print()

def get_user_choice():
    """Get user's choice"""
    while True:
        try:
            choice = input("Enter your choice (1-4): ").strip()
            if choice in ['1', '2', '3', '4']:
                return int(choice)
            else:
                print("Please enter a valid choice (1-4)")
        except KeyboardInterrupt:
            print("\nExiting...")
            return None

def open_railway():
    """Open Railway.app signup"""
    print("Opening Railway.app...")
    webbrowser.open("https://railway.app")
    print()
    print("Steps for Railway:")
    print("1. Sign up with GitHub")
    print("2. Create a new project")
    print("3. Add PostgreSQL database")
    print("4. Copy the DATABASE_URL")
    print("5. Deploy your app")

def open_supabase():
    """Open Supabase signup"""
    print("Opening Supabase...")
    webbrowser.open("https://supabase.com")
    print()
    print("Steps for Supabase:")
    print("1. Sign up and create a new project")
    print("2. Go to Settings → Database")
    print("3. Copy the connection string")
    print("4. Use it as your DATABASE_URL")

def open_neon():
    """Open Neon.tech signup"""
    print("Opening Neon.tech...")
    webbrowser.open("https://neon.tech")
    print()
    print("Steps for Neon:")
    print("1. Sign up and create a new project")
    print("2. Copy the connection string from dashboard")
    print("3. Use it as your DATABASE_URL")

def open_planetscale():
    """Open PlanetScale signup"""
    print("Opening PlanetScale...")
    webbrowser.open("https://planetscale.com")
    print()
    print("Steps for PlanetScale:")
    print("1. Sign up and create a new database")
    print("2. Get the connection string")
    print("3. Use it as your DATABASE_URL")

def create_env_file():
    """Create .env file with placeholder"""
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
    else:
        print("✅ .env file already exists")

def show_next_steps():
    """Show next steps"""
    print()
    print("📋 Next Steps:")
    print("1. Update the DATABASE_URL in your .env file")
    print("2. Run: python deploy.py")
    print("3. Run: python test_deployment.py")
    print("4. Deploy to your preferred hosting platform")
    print()
    print("📖 For detailed instructions, see CLOUD_DEPLOYMENT_GUIDE.md")
    print()
    print("🎉 You're all set! Your fee management system will be cloud-ready!")

def main():
    """Main function"""
    print_banner()
    show_options()
    
    choice = get_user_choice()
    if choice is None:
        return
    
    # Create .env file
    create_env_file()
    
    # Open the chosen provider
    if choice == 1:
        open_railway()
    elif choice == 2:
        open_supabase()
    elif choice == 3:
        open_neon()
    elif choice == 4:
        open_planetscale()
    
    show_next_steps()

if __name__ == "__main__":
    main()
