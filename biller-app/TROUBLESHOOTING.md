# Billify POS - Access Key Troubleshooting Guide

## Issue: "Access key not found" error when using valid key

### Quick Diagnosis Steps

1. **Run the test script first:**
   ```bash
   cd biller-app
   venv\Scripts\activate
   python test_key_verification.py
   ```
   
   This will:
   - Test MongoDB connection
   - List all keys in the database
   - Allow you to test a specific key

2. **Rebuild the executable with debug mode:**
   ```bash
   cd biller-app
   build.bat
   ```
   
   The new executable will show a console window with debug output.

### Common Issues and Solutions

#### 1. Key Copy-Paste Issues
**Problem:** Special characters in the key might not copy correctly.

**Solution:** 
- Triple-click the key in the web portal to select it completely
- Use Ctrl+C to copy (don't right-click)
- Paste into the POS app using Ctrl+V
- Make sure there are no extra spaces before or after the key

#### 2. Key Expiration
**Problem:** Keys expire after 3 minutes.

**Solution:**
- Generate a new key from the portal
- Use it immediately in the POS app
- Don't wait more than 3 minutes between generation and use

#### 3. Database Connection Issues
**Problem:** The .env file is not being read correctly.

**Solution:**
- Verify `.env` file exists in the project root (not in biller-app folder)
- Check that MONGO_URL is correctly set in `.env`
- Run the test script to verify connection

#### 4. Timezone Issues
**Problem:** Server and client have different timezones causing premature expiration.

**Solution:** The code now uses UTC timezone for all comparisons. Rebuild the executable.

### Debug Output Explanation

When you run the executable with console mode enabled, you'll see:

```
[DEBUG] Searching for key: 'ABC123xyz!@#' (length: 12)
[DEBUG] Key not found. Total keys in DB: 5
```

This means:
- The key you entered is being searched
- But it doesn't match any of the 5 keys in the database

If you see:
```
[DEBUG] Key is valid and not expired
[DEBUG] Authentication successful for: Biller Terminal
```

The authentication is working correctly!

### Manual Database Check

If you want to manually verify keys in MongoDB:

1. Connect to your MongoDB Atlas cluster
2. Navigate to the `billify` database
3. Open the `biller_keys` collection
4. Check the `key` field values
5. Compare with what you're entering in the POS app

### Still Having Issues?

Run the test script and provide the output:
```bash
python test_key_verification.py
```

Then paste your generated key when prompted. The script will show exactly what's happening.
