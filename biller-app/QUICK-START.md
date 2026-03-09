# Quick Start - Fix Access Key Issue

## Problem

The POS executable shows "Access key not found" even with a valid key from the portal.

## Solution - 3 Simple Steps

### Step 1: Test Your Connection (30 seconds)

```bash
# Double-click this file:
test-key.bat
```

This will show:

- ✅ If MongoDB connection works
- ✅ All active keys in your database
- ✅ Let you test your specific key

**What to look for:**

- If you see "Successfully connected to MongoDB" → Good!
- If you see keys listed → Your database is working
- Paste your key when prompted to test it

---

### Step 2: Rebuild the Executable (1 minute)

```bash
# Double-click this file:
build.bat
```

This will:

- ✅ Fix the .env file loading issue
- ✅ Add debug output to help diagnose issues
- ✅ Improve key input handling

**What to look for:**

- Wait for "SUCCESS! Executable created successfully!"
- New file will be at: `dist\Billify-POS.exe`

---

### Step 3: Test Authentication (30 seconds)

1. **Generate a fresh key:**
   - Go to your web portal
   - Click "Generate Biller Access Key"
   - Triple-click the key to select it all
   - Press Ctrl+C to copy

2. **Use the key immediately:**
   - Run `dist\Billify-POS.exe`
   - You'll see TWO windows: the app + a console window
   - Paste the key (Ctrl+V)
   - Click "Authenticate Terminal"

3. **Check the console window:**
   - You'll see debug messages like:
     ```
     [DEBUG] Searching for key: 'ABC123xyz!@#' (length: 12)
     [DEBUG] Key is valid and not expired
     [DEBUG] Authentication successful for: Biller Terminal
     ```

---

## If It Still Doesn't Work

The console window will show exactly what's wrong:

### "Key not found. Total keys in DB: 0"

→ No keys in database. Generate one from the portal first.

### "Key not found. Total keys in DB: 5"

→ Your key doesn't match. Run `test-key.bat` to see what keys exist.

### "Key has expired"

→ Keys expire after 3 minutes. Generate a new one.

### "Cannot connect to Billify Cloud"

→ Check your internet connection or .env file.

---

## After It Works

Once authentication works, you can disable the console window:

1. Open `Billify-POS.spec`
2. Find the line: `console=True,`
3. Change it to: `console=False,`
4. Run `build.bat` again

Now the executable will run without the console window!

---

## Need More Help?

See `TROUBLESHOOTING.md` for detailed diagnostics and solutions.
