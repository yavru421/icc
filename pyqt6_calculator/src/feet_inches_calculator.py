from kivy.uix.boxlayout import BoxLayout
from kivy.uix.button import Button
from kivy.uix.textinput import TextInput
from kivy.uix.label import Label
import re
import sys
from sympy import sympify
from kivy.app import App

def parse_feet_inches(expression):
    """
    Converts feet/inches expressions into pure inches for calculation.
    Supports fractional inches (e.g., 5 ft 6 1/2 in).
    """
    def convert_match(m):
        feet = float(m.group(1)) if m.group(1) else 0
        inches = float(m.group(2)) if m.group(2) else 0
        fraction = m.group(3)
        
        if fraction:
            try:
                num, denom = map(int, fraction.split('/'))
                inches += num / denom
            except ValueError:
                pass
        
        total_inches = feet * 12 + inches
        return f"({total_inches})"  # Simplified return format

    # Process the expression in steps
    expression = expression.replace("'", " ft ")  # Convert ' to ft
    expression = expression.replace('"', " in")   # Convert " to in
    
    # Handle full format: "5 ft 6 1/2 in"
    expression = re.sub(
        r"(\d+)\s*ft\s*(\d+)?\s*(\d+/\d+)?\s*in?",
        convert_match,
        expression
    )
    
    print(f"Parsed expression: {expression}")  # Debug output
    return expression

def evaluate_expression(expression):
    try:
        parsed_expression = parse_feet_inches(expression)
        print(f"Evaluating: {parsed_expression}")  # Debug output
        result = float(sympify(parsed_expression).evalf())
        feet = int(result // 12)
        inches = round(result % 12, 3)
        print(f"Raw result: {result} inches")  # Debug output
        return f"{result:.3f} inches ({feet} ft {inches:.3f} in)"
    except Exception as e:
        return f"Error: {str(e)}"

class FeetInchesCalculator(BoxLayout):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.orientation = 'vertical'
        self.spacing = 10
        self.padding = [10, 5]
        
        self.label = Label(
            text="Enter a mathematical expression with feet and inches:",
            size_hint_y=None,
            height=30,
            font_size='16sp'
        )
        
        self.input_field = TextInput(
            multiline=False,
            size_hint=(1, None),
            height=40,
            hint_text="e.g., 15 ft 6 1/2 in or 5'6 1/2\"",
            font_size='16sp'
        )
        
        self.calculate_button = Button(
            text="Calculate",
            size_hint=(0.4, None),
            height=40,
            pos_hint={'center_x': 0.5}
        )
        self.calculate_button.bind(on_press=self.calculate)  # Add this line to bind the button
        
        self.result_label = Label(
            text="Result will be shown here",
            size_hint_y=None,
            height=40,
            font_size='16sp',
            halign='center',
            valign='middle'
        )
        
        self.add_widget(self.label)
        self.add_widget(self.input_field)
        self.add_widget(self.calculate_button)
        self.add_widget(self.result_label)
    
    def calculate(self, instance):
        expression = self.input_field.text
        print(f"Input: {expression}")  # Debug output
        result = evaluate_expression(expression)
        print(f"Final result: {result}")  # Debug output
        self.result_label.text = result

class FeetInchesApp(App):
    def build(self):
        return FeetInchesCalculator()

if __name__ == "__main__":
    FeetInchesApp().run()