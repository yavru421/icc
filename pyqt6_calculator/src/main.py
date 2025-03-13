import sys
import importlib
import json
import os
from kivy.app import App
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.scrollview import ScrollView
from kivy.uix.label import Label
from kivy.uix.image import Image
from version import FULL_APP_NAME, COPYRIGHT

class CalculatorLayout(BoxLayout):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.orientation = 'vertical'
        self.spacing = 15  # Increased spacing
        self.padding = [20, 20]  # Increased padding
        self.bind(minimum_height=self.setter('height'))

        # Add logo with larger size
        logo = Image(
            source='assets/logo.png',
            size_hint=(None, None),
            size=(400, 400),  # Much larger size
            pos_hint={'center_x': 0.5}  # Center horizontally
        )
        self.add_widget(logo)

        # Add branding title
        brand = Label(
            text=FULL_APP_NAME,
            size_hint_y=None,
            height=60,
            font_size='24sp',
            bold=True,
            padding=[0, 20]  # Add vertical padding
        )
        self.add_widget(brand)

        # Add copyright with extra bottom margin
        copyright_label = Label(
            text=COPYRIGHT,
            size_hint_y=None,
            height=30,
            font_size='14sp',
            color=(0.7, 0.7, 0.7, 1),
            halign='center',
            padding=[0, 0, 0, 50]  # Increased bottom padding to 50
        )
        self.add_widget(copyright_label)

        # Add spacer
        spacer = Label(
            text="",
            size_hint_y=None,
            height=30  # Extra space before calculators
        )
        self.add_widget(spacer)

        if getattr(sys, 'frozen', False):
            application_path = os.path.dirname(sys.executable)
        else:
            application_path = os.path.dirname(os.path.abspath(__file__))

        config_path = os.path.join(application_path, 'config.json')
        with open(config_path, "r") as f:
            config = json.load(f)

        for calc in config["calculators"]:
            # Add section divider
            divider = Label(
                text=calc["name"],
                size_hint_y=None,
                height=30,
                bold=True,
                color=(0.2, 0.6, 1, 1)
            )
            self.add_widget(divider)
            
            # Add calculator
            module = importlib.import_module(calc["module"])
            cls = getattr(module, calc["class"])
            self.add_widget(cls())

class MainApp(App):
    def build(self):
        # iOS specific settings
        from kivy.utils import platform
        if platform == 'ios':
            from pyobjus import autoclass
            UIScreen = autoclass('UIScreen')
            bounds = UIScreen.mainScreen.bounds
            scale = UIScreen.mainScreen.scale
            self.window.size = (bounds.size.width * scale, bounds.size.height * scale)
        
        self.title = f"{FULL_APP_NAME} - Imperial Measurement Calculator"
        
        # Create scrollable container
        scroll = ScrollView(
            do_scroll_x=False,
            do_scroll_y=True,
            size_hint=(1, 1)
        )
        
        # Add main layout to scroll view
        scroll.add_widget(CalculatorLayout())
        return scroll

if __name__ == "__main__":
    MainApp().run()