from kivy.uix.boxlayout import BoxLayout
from kivy.uix.button import Button
from kivy.uix.textinput import TextInput
from kivy.uix.label import Label
import sympy as sp
import re

class AlgebraCalculator(BoxLayout):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.orientation = 'vertical'
        self.spacing = 10
        self.padding = [10, 5]

        self.label = Label(
            text="Enter an equation to solve:",
            size_hint_y=None,
            height=30,
            font_size='16sp'
        )

        self.input_field = TextInput(
            multiline=False,
            size_hint=(1, None),
            height=40,
            hint_text="e.g., 2x + 3 = 10",
            font_size='16sp'
        )

        self.solve_button = Button(
            text="Solve",
            size_hint=(0.4, None),
            height=40,
            pos_hint={'center_x': 0.5}
        )
        self.solve_button.bind(on_press=self.solve_equation)

        self.result_label = Label(
            text="Solution will be shown here",
            size_hint_y=None,
            height=40,
            font_size='16sp',
            halign='center',
            valign='middle'
        )

        self.add_widget(self.label)
        self.add_widget(self.input_field)
        self.add_widget(self.solve_button)
        self.add_widget(self.result_label)

    def preprocess_equation(self, equation):
        # Add multiplication symbol (*) between a number and a variable (e.g., "2x" -> "2*x")
        equation = re.sub(r'(\d)([a-zA-Z])', r'\1*\2', equation)
        return equation

    def solve_equation(self, instance):
        equation_text = self.input_field.text
        try:
            equation_text = self.preprocess_equation(equation_text)
            lhs, rhs = equation_text.split("=")
            lhs = sp.sympify(lhs.strip())
            rhs = sp.sympify(rhs.strip())

            x = sp.Symbol('x')
            solution = sp.solve(lhs - rhs, x)

            self.result_label.text = f"Solution: {solution}"
        except Exception as e:
            self.result_label.text = f"Error: {str(e)}"
