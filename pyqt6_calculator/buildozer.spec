[app]
title = ICC Calculator
package.name = icccalculator
package.domain = org.imperial
source.dir = .
source.include_exts = py,png,jpg,kv,json
version = 6.1.0

requirements = python3,\
    kivy==2.3.0,\
    sympy==1.12,\
    pillow==10.2.0

# iOS specific
ios.kivy_ios_version = 2.3.0
ios.deployment_target = 13.0
ios.codesign.allowed = false

# Orientation
orientation = portrait

[buildozer]
log_level = 2
warn_on_root = 1
