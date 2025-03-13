import PyInstaller.__main__
import os
import sys
from src.version import VERSION, APP_NAME

def ensure_directories():
    """Create necessary directories if they don't exist"""
    dirs = ['src/assets', 'dist', 'build']
    for d in dirs:
        os.makedirs(d, exist_ok=True)

def create_placeholder_assets():
    """Create a placeholder logo if none exists"""
    logo_path = 'src/assets/logo.png'
    if not os.path.exists(logo_path):
        try:
            from PIL import Image, ImageDraw
            img = Image.new('RGB', (400, 400), color='black')
            d = ImageDraw.Draw(img)
            d.text((150, 200), "ICC", fill='white', size=100)
            img.save(logo_path)
        except ImportError:
            print("Warning: PIL not installed. Skipping logo creation.")
            # Create an empty file to prevent repeated attempts
            open(logo_path, 'w').close()

def build_exe():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    src_dir = os.path.join(script_dir, 'src')
    
    # Add src directory to Python path
    sys.path.append(src_dir)
    
    # Ensure directories exist
    ensure_directories()
    create_placeholder_assets()
    
    PyInstaller.__main__.run([
        os.path.join(src_dir, 'main.py'),
        '--name', f'{APP_NAME}-{VERSION}',
        '--onefile',
        '--windowed',
        # Paths
        '--distpath', os.path.join(script_dir, 'dist'),
        '--workpath', os.path.join(script_dir, 'build'),
        '--specpath', script_dir,
        # Data files
        '--add-data', f'{src_dir}/config.json;.',
        '--add-data', f'{src_dir}/calculator.kv;.',
        '--add-data', f'{src_dir}/assets;assets',
        # Kivy
        '--hidden-import', 'kivy',
        '--hidden-import', 'kivy.core.window',
        '--hidden-import', 'kivy.core.window.window_sdl2',
        '--hidden-import', 'kivy.core.text',
        '--hidden-import', 'kivy.core.text.text_sdl2',
        '--hidden-import', 'kivy.core.clipboard',
        '--hidden-import', 'kivy.core.image',
        '--hidden-import', 'kivy.core.image.img_sdl2',
        # Application imports
        '--hidden-import', 'src.algebra',
        '--hidden-import', 'src.feet_inches_calculator',
        '--hidden-import', 'src.version',
        # Excludes
        '--exclude-module', 'tkinter',
        '--exclude-module', 'enchant',
        '--exclude-module', 'gi',
        '--exclude-module', 'cv2',
        '--exclude-module', 'picamera',
        '--exclude-module', 'pytest',
        # Build options
        '--clean',
        '--log-level', 'WARN'
    ])

if __name__ == "__main__":
    build_exe()
