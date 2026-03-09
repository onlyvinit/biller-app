"""
Quick diagnostic — run with:
  .\venv\Scripts\python.exe test_auth.py <YOUR_KEY>
"""
import sys, os
from datetime import datetime, timezone

# Load .env from project root
env_path = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", ".env"))
MONGO_URL = None
if os.path.exists(env_path):
    with open(env_path) as f:
        for line in f:
            line = line.strip()
            if line.startswith("MONGO_URL="):
                MONGO_URL = line[len("MONGO_URL="):]
                break

print(f"[1] .env found : {os.path.exists(env_path)}")
print(f"[2] MONGO_URL  : {'✓ loaded' if MONGO_URL else '✗ NOT FOUND'}")

if not MONGO_URL:
    print("STOP: Cannot proceed without MONGO_URL.")
    sys.exit(1)

from pymongo import MongoClient
from pymongo.errors import ConnectionFailure

try:
    client = MongoClient(MONGO_URL, serverSelectionTimeoutMS=6000)
    client.admin.command("ping")
    print("[3] MongoDB    : ✓ connected")
except Exception as e:
    print(f"[3] MongoDB    : ✗ FAILED — {e}")
    sys.exit(1)

db = client["billify"]
key_arg = sys.argv[1] if len(sys.argv) > 1 else None
if not key_arg:
    print("\nUsage: .\\venv\\Scripts\\python.exe test_auth.py YOUR_KEY")
    # Show all active keys so user can copy one
    all_keys = list(db["biller_keys"].find({}, {"key": 1, "expiresAt": 1}))
    print(f"\n[4] biller_keys collection has {len(all_keys)} doc(s):")
    now = datetime.now(timezone.utc)
    for k in all_keys:
        exp = k.get("expiresAt")
        if exp and exp.tzinfo is None:
            exp = exp.replace(tzinfo=timezone.utc)
        status = "✓ VALID" if exp and exp > now else "✗ EXPIRED"
        print(f"    key={k['key']}  expires={exp}  {status}")
    sys.exit(0)

now = datetime.now(timezone.utc)
doc = db["biller_keys"].find_one({"key": key_arg})
print(f"\n[4] Key search : {'✓ FOUND' if doc else '✗ NOT FOUND in biller_keys'}")
if doc:
    exp = doc.get("expiresAt")
    if exp and exp.tzinfo is None:
        exp = exp.replace(tzinfo=timezone.utc)
    expired = exp < now if exp else True
    print(f"    expiresAt  : {exp}")
    print(f"    Status     : {'✗ EXPIRED' if expired else '✓ VALID'}")
