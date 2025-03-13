#!/usr/bin/env python3
import subprocess
import sys
from datetime import datetime
import os

# Ensure we're running as a Python script
if sys.executable.endswith('notepad++.exe'):
    # Re-run the script with python
    python_path = sys.executable if sys.executable.lower().endswith('python.exe') else 'python'
    os.execvp(python_path, [python_path] + sys.argv)

# ANSI color codes
class Colors:
    HEADER = '\033[95m'
    BLUE = '\033[94m'
    GREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    END = '\033[0m'
    BOLD = '\033[1m'

def run_command(command, error_msg="Command failed"):
    """Run a command and handle its output"""
    try:
        result = subprocess.run(command, 
                              capture_output=True, 
                              text=True, 
                              shell=True)
        if result.returncode != 0:
            print(f"{Colors.FAIL}Error: {error_msg}{Colors.END}")
            print(f"Details: {result.stderr}")
            return False
        return result.stdout.strip()
    except Exception as e:
        print(f"{Colors.FAIL}Error: {str(e)}{Colors.END}")
        return False

def git_status():
    """Check git status"""
    print(f"{Colors.HEADER}Checking Git status...{Colors.END}")
    status = run_command("git status", "Failed to get status")
    if status:
        print(status)
    return status != False

def git_pull():
    """Pull latest changes"""
    print(f"{Colors.HEADER}Pulling latest changes...{Colors.END}")
    return run_command("git pull", "Failed to pull changes")

def git_push(message=None):
    """Push changes to remote"""
    if not message:
        message = f"Auto-update {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
    
    print(f"{Colors.HEADER}Pushing changes...{Colors.END}")
    
    # Add all changes
    if not run_command("git add .", "Failed to add files"):
        return False
    
    # Commit changes
    if not run_command(f'git commit -m "{message}"', "Failed to commit"):
        return False
    
    # Push to remote
    return run_command("git push", "Failed to push")

def main():
    if len(sys.argv) < 2:
        print(f"""
{Colors.BOLD}Usage:{Colors.END}
python git.py <command> [options]

{Colors.BOLD}Commands:{Colors.END}
status  - Show git status
pull    - Pull latest changes
push    - Push changes (auto-commits all changes)
update  - Pull then push (recommended)

{Colors.BOLD}Options:{Colors.END}
-m "message"  - Commit message for push (optional)
        """)
        return

    command = sys.argv[1].lower()
    message = None

    # Check for commit message
    if "-m" in sys.argv:
        msg_index = sys.argv.index("-m") + 1
        if msg_index < len(sys.argv):
            message = sys.argv[msg_index]

    if command == "status":
        git_status()
    elif command == "pull":
        git_pull()
    elif command == "push":
        if git_status():
            git_push(message)
    elif command == "update":
        if git_pull():
            if git_status():
                git_push(message)
    else:
        print(f"{Colors.FAIL}Unknown command: {command}{Colors.END}")

if __name__ == "__main__":
    main()
