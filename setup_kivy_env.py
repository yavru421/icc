import os
import subprocess

def setup_kivy_env(env_name="kivy_calculator"):
    # Create a project directory
    project_dir = os.path.join(os.getcwd(), env_name)
    os.makedirs(project_dir, exist_ok=True)
    
    # Change to the project directory
    os.chdir(project_dir)
    
    # Create and activate virtual environment
    subprocess.run(["python", "-m", "venv", "venv"])
    
    # Install dependencies
    pip_cmd = "venv/bin/pip" if os.name != 'nt' else "venv\\Scripts\\pip"
    subprocess.run([pip_cmd, "install", "kivy", "sympy", "pyinstaller"])
    
    print(f"Project '{env_name}' setup complete! Open it in VSCode and start coding.")

if __name__ == "__main__":
    setup_kivy_env()
