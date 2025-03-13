# -*- mode: python ; coding: utf-8 -*-
from PyInstaller.utils.hooks import collect_all

datas = [('C:\\Users\\John\\Documents\\imperial\\pyqt6_calculator\\src/config.json', '.'), ('C:\\Users\\John\\Documents\\imperial\\pyqt6_calculator\\src/calculator.kv', '.'), ('C:\\Users\\John\\Documents\\imperial\\pyqt6_calculator\\src/assets', 'assets')]
binaries = []
hiddenimports = ['kivy.core.window.window_sdl2', 'kivy.core.text.text_sdl2', 'kivy.core.image', 'kivy.core.text', 'src.algebra', 'src.feet_inches_calculator', 'src.version']
tmp_ret = collect_all('kivy')
datas += tmp_ret[0]; binaries += tmp_ret[1]; hiddenimports += tmp_ret[2]


a = Analysis(
    ['C:\\Users\\John\\Documents\\imperial\\pyqt6_calculator\\src\\main.py'],
    pathex=[],
    binaries=binaries,
    datas=datas,
    hiddenimports=hiddenimports,
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=['tkinter', 'enchant', 'gi', 'cv2', 'picamera'],
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
    name='ICC-6.1.0',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=False,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
    icon='NONE',
)
