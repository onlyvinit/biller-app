"""
Test script to debug access key verification issues
"""
import os
import sys
from datetime import datetime, timezone

# Add parent directory to path to import from main.py
sys.path.insert(0, os.path.dirname(__file__))

from pymongo import MongoClient
from pymongo.errors import ConnectionFailure

def _load_mongo_url():
    """Load MONGO_URL from .env file"""
    base_dir = os.path.normpath(os.path.join(os.path.dirname(__file__), ".."))
    env_path = os.path.join(base_dir, ".env")
    
    print(f"Looking for .env at: {env_path}")
    print(f"File exists: {os.path.exists(env_path)}")
    
    if os.path.exists(env_path):
        with open(env_path, "r") as f:
            for line in f:
                line = line.strip()
                if line.startswith("MONGO_URL="):
                    url = line[len("MONGO_URL="):]
                    print(f"Found MONGO_URL: {url[:50]}...")
                    return url
    return None

def test_connection():
    """Test MongoDB connection"""
    print("\n=== Testing MongoDB Connection ===")
    mongo_url = _load_mongo_url()
    
    if not mongo_url:
        print("❌ ERROR: MONGO_URL not found in .env")
        return None
    
    try:
        client = MongoClient(mongo_url, serverSelectionTimeoutMS=5000)
        db = client["billify"]
        # Test connection
        client.server_info()
        print("✅ Successfully connected to MongoDB")
        return db
    except ConnectionFailure as e:
        print(f"❌ Connection failed: {e}")
        return None
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return None

def list_all_keys(db):
    """List all biller keys in the database"""
    print("\n=== All Biller Keys in Database ===")
    try:
        keys = list(db["biller_keys"].find())
        if not keys:
            print("No keys found in database")
            return
        
        now = datetime.now(timezone.utc)
        for i, key_doc in enumerate(keys, 1):
            expires_at = key_doc.get("expiresAt")
            if expires_at and expires_at.tzinfo is None:
                expires_at = expires_at.replace(tzinfo=timezone.utc)
            
            is_expired = expires_at < now if expires_at else False
            status = "EXPIRED" if is_expired else "ACTIVE"
            
            print(f"\n{i}. Key: {key_doc.get('key')}")
            print(f"   User ID: {key_doc.get('userId')}")
            print(f"   Created: {key_doc.get('createdAt')}")
            print(f"   Expires: {expires_at}")
            print(f"   Status: {status}")
            
    except Exception as e:
        print(f"❌ Error listing keys: {e}")

def test_key_lookup(db, test_key):
    """Test looking up a specific key"""
    print(f"\n=== Testing Key Lookup ===")
    print(f"Searching for key: '{test_key}'")
    print(f"Key length: {len(test_key)}")
    print(f"Key bytes: {test_key.encode('utf-8')}")
    
    try:
        key_doc = db["biller_keys"].find_one({"key": test_key})
        
        if not key_doc:
            print("❌ Key not found in database")
            
            # Try to find similar keys
            print("\nSearching for keys with similar patterns...")
            all_keys = list(db["biller_keys"].find({}, {"key": 1}))
            for doc in all_keys:
                stored_key = doc.get("key", "")
                if len(stored_key) == len(test_key):
                    print(f"  Similar length key found: '{stored_key}'")
                    # Character by character comparison
                    for i, (c1, c2) in enumerate(zip(test_key, stored_key)):
                        if c1 != c2:
                            print(f"    Diff at position {i}: '{c1}' vs '{c2}'")
            return False
        
        print("✅ Key found in database!")
        
        # Check expiration
        now = datetime.now(timezone.utc)
        expires_at = key_doc.get("expiresAt")
        if expires_at and expires_at.tzinfo is None:
            expires_at = expires_at.replace(tzinfo=timezone.utc)
        
        if expires_at and expires_at < now:
            print(f"❌ Key has expired (expired at {expires_at})")
            return False
        
        print(f"✅ Key is valid and not expired")
        print(f"   User ID: {key_doc.get('userId')}")
        print(f"   Expires at: {expires_at}")
        return True
        
    except Exception as e:
        print(f"❌ Error during lookup: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    print("Billify POS - Access Key Verification Test")
    print("=" * 50)
    
    # Test connection
    db = test_connection()
    if db is None:
        print("\n❌ Cannot proceed without database connection")
        sys.exit(1)
    
    # List all keys
    list_all_keys(db)
    
    # Test specific key if provided
    print("\n" + "=" * 50)
    test_key = input("\nEnter access key to test (or press Enter to skip): ").strip()
    
    if test_key:
        test_key_lookup(db, test_key)
    
    print("\n" + "=" * 50)
    print("Test complete!")
