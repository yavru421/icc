from PyQt6.QtWidgets import QWidget, QVBoxLayout, QLabel, QLineEdit, QPushButton, QTextEdit
import re
import math
from sympy import sympify

def parse_feet_inches(expression):
    """
    Converts feet/inches expressions into pure inches for calculation.
    Supports fractional inches (e.g., 5 ft 6 1/2 in).
    """
    
    def convert_match(m):
        feet = int(m.group(1)) if m.group(1) else 0
        inches = int(m.group(2)) if m.group(2) else 0
        fraction = m.group(3)
        
        if fraction:
            num, denom = map(int, fraction.split('/'))
            inches += num / denom  # Convert fraction to decimal
        
        return f"({feet}*12 + {inches})"

    # Match: 5 ft 6 1/2 in | 3 ft 2 in | 4 ft | 12 in | 5' 6" | 4'6 1/2"
    expression = re.sub(
        r"(\d+)\s*ft\s*(\d+)?\s*(\d+/\d+)?\s*in?",
        convert_match,
        expression
    )
    
    # Handle cases like "5' 6 1/2"" (short notation)
    expression = re.sub(
        r"(\d+)'\s*(\d+)?\s*(\d+/\d+)?\"?",
        convert_match,
        expression
    )

    return expression

def evaluate_expression(expression):
    """
    Evaluates the converted feet/inches expression.
    Returns both total inches and feet/inches format.
    """
    try:
        parsed_expression = parse_feet_inches(expression)
        result = sympify(parsed_expression).evalf()
        feet = int(result // 12)
        inches = round(result % 12, 4)
        
        return f"{result} inches ({feet} ft {inches} in)"
    except Exception as e:
        return f"Error: {str(e)}"

class FeetInchesCalculator(QWidget):
    """
    PyQt6 GUI for the Feet & Inches Calculator.
    """
    def __init__(self):
        super().__init__()

        self.setWindowTitle("Feet & Inches Calculator")
        self.layout = QVBoxLayout()

        self.label = QLabel("Enter a mathematical expression with feet and inches:")
        self.label.setStyleSheet("font-size: 20px; font-weight: bold;")
        self.layout.addWidget(self.label)

        self.input_field = QLineEdit()
        self.input_field.setPlaceholderText("e.g., 15 ft 6 in + (6 ft * 2) or 5' 6 1/2\"")
        self.input_field.setStyleSheet("font-size: 18px; padding: 5px;")
        self.layout.addWidget(self.input_field)

        self.calculate_button = QPushButton("Calculate")
        self.calculate_button.setStyleSheet("font-size: 18px; padding: 10px;")
        self.calculate_button.clicked.connect(self.calculate)
        self.layout.addWidget(self.calculate_button)

        self.result_display = QTextEdit()
        self.result_display.setReadOnly(True)
        self.result_display.setStyleSheet("font-size: 22px; font-weight: bold; color: green;")
        self.layout.addWidget(self.result_display)

        self.setLayout(self.layout)

    def calculate(self):
        expression = self.input_field.text()
        result = evaluate_expression(expression)
        self.result_display.append(f"> {result}")

# if __name__ == "__main__":
#     app = QApplication(sys.argv)