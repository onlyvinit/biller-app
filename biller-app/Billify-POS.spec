# -*- mode: python ; coding: utf-8 -*-

import os

# Bundle the portal's .env so the exe can read MONGO_URL at runtime
# Get absolute path to .env in project root
spec_root = os.path.dirname(os.path.abspath(SPECPATH))
env_path = os.path.join(spec_root, '.env')

a = Analysis(
    ['main.py'],
    pathex=[],
    binaries=[],
    datas=[(env_path, '.')],   # copies .env next to the exe
    hiddenimports=[
        'pymongo',
        'pymongo.mongo_client',
        'pymongo.mongo_replica_set_client',
        'pymongo.errors',
        'pymongo.uri_parser',
        'dns',
        'dns.resolver',
        'dns.rdatatype',
    ],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    noarchive=False,
    optimize=0,
)
pyz = PYZ(a.pure)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.datas,
    [],
    name='Billify-POS',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=False,  # Disable console for production
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
)
