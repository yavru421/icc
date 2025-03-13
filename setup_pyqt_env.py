import os
import subprocess

def setup_pyqt6_env(env_name="pyqt6_calculator"):
    # Create a project directory
    project_dir = os.path.join(os.getcwd(), env_name)
    os.makedirs(project_dir, exist_ok=True)
    
    # Change to the project directory
    os.chdir(project_dir)
    
    # Create and activate virtual environment
    subprocess.run(["python", "-m", "venv", "venv"])
    
    # Install dependencies
    subprocess.run(["venv/bin/pip", "install", "PyQt6", "sympy"] if os.name != 'nt' else ["venv\\Scripts\\pip", "install", "PyQt6", "sympy"])
    
    # Create project folder structure
    os.makedirs("src", exist_ok=True)
    os.makedirs("ui", exist_ok=True)
    os.makedirs("assets", exist_ok=True)
    
    # Create a basic main.py file
    main_py_content = """\
from PyQt6.QtWidgets import QApplication, QMainWindow
import sys

class CalculatorApp(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle('Imperial Measurement Calculator')
        self.setGeometry(100, 100, 800, 600)

if __name__ == '__main__':
    app = QApplication(sys.argv)
    window = CalculatorApp()
    window.show()
    sys.exit(app.exec())
"""
    
    with open(os.path.join("src", "main.py"), "w") as f:
        f.write(main_py_content)
    
    print(f"Project '{env_name}' setup complete! Open it in VSCode and start coding.")

if __name__ == "__main__":
    setup_pyqt6_env()
