import os
import sys

# Add src directory to Python path
src_path = os.path.join(os.path.dirname(__file__), 'src')
sys.path.append(src_path)

# Import and run the app
from main import MainApp

if __name__ == "__main__":
    MainApp().run()
