# Billify POS - Desktop Application

A native desktop Point of Sale application that connects to the Billify cloud platform.

## Features

- 🔐 Secure access key authentication
- 🛒 Product catalog and cart management
- 💳 Payment processing
- ☁️ Cloud synchronization with Billify dashboard
- 🖥️ Native Windows application (Python + CustomTkinter)

## Quick Links

- **Having authentication issues?** → See [QUICK-START.md](QUICK-START.md)
- **Need detailed troubleshooting?** → See [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- **Want to understand the fixes?** → See [FIX-SUMMARY.md](FIX-SUMMARY.md)

## Files Overview

### Application Files

- `main.py` - Main application code
- `Billify-POS.spec` - PyInstaller build configuration
- `requirements.txt` - Python dependencies

### Build & Test Scripts

- `build.bat` - Build the executable
- `Launch Billify POS.bat` - Run from source (for development)
- `test-key.bat` - Test access key verification
- `test_key_verification.py` - Diagnostic script

### Documentation

- `QUICK-START.md` - Quick fix guide for authentication issues
- `TROUBLESHOOTING.md` - Detailed troubleshooting guide
- `FIX-SUMMARY.md` - Technical details of recent fixes

## Development Setup

1. **Install Python dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

2. **Run from source:**

   ```bash
   # Double-click:
   Launch Billify POS.bat

   # Or manually:
   venv\Scripts\activate
   python main.py
   ```

3. **Build executable:**

   ```bash
   # Double-click:
   build.bat

   # Or manually:
   venv\Scripts\activate
   pyinstaller Billify-POS.spec
   ```

## How It Works

### Authentication Flow

1. User generates access key from web portal (`/dashboard/biller-portal`)
2. Key is stored in MongoDB `biller_keys` collection with 3-minute expiration
3. Desktop app verifies key against database
4. On success, user can access POS features

### Database Connection

- Reads `MONGO_URL` from `.env` file in project root
- Connects to MongoDB Atlas cluster
- Accesses `billify` database

### Key Verification

- Looks up key in `biller_keys` collection
- Checks expiration timestamp (UTC timezone)
- Retrieves biller name from `billers` collection
- Returns success/failure with appropriate message

## Common Issues

### "Access key not found"

**Cause:** Key doesn't match database or .env file not loaded correctly.

**Fix:** Run `test-key.bat` to diagnose, then `build.bat` to rebuild.

### "Access key has expired"

**Cause:** Keys expire after 3 minutes for security.

**Fix:** Generate a new key from the portal.

### "Cannot connect to Billify Cloud"

**Cause:** No internet connection or invalid MONGO_URL.

**Fix:** Check internet connection and verify `.env` file exists in project root.

## Architecture

```
biller-app/
├── main.py                    # Main application
├── Billify-POS.spec          # Build configuration
├── requirements.txt          # Dependencies
├── build.bat                 # Build script
├── Launch Billify POS.bat    # Development launcher
├── test-key.bat              # Test script launcher
├── test_key_verification.py  # Diagnostic tool
├── venv/                     # Virtual environment
├── build/                    # Build artifacts (temp)
└── dist/
    └── Billify-POS.exe       # Final executable
```

## Building for Production

1. **Disable console mode:**
   - Edit `Billify-POS.spec`
   - Change `console=True` to `console=False`

2. **Build:**

   ```bash
   build.bat
   ```

3. **Test:**
   - Run `dist\Billify-POS.exe`
   - Verify authentication works
   - Test product catalog and cart

4. **Distribute:**
   - Copy `dist\Billify-POS.exe` to `public/downloads/`
   - Users can download from web portal

## Tech Stack

- **GUI Framework:** CustomTkinter (modern, dark-themed UI)
- **Database:** MongoDB (via pymongo)
- **Packaging:** PyInstaller (creates standalone .exe)
- **Python Version:** 3.x

## Support

For issues or questions:

1. Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
2. Run `test-key.bat` for diagnostics
3. Check console output (if console mode enabled)
4. Review MongoDB Atlas logs
