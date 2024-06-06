<<<<<<< HEAD
#!C:\Users\angel\Documents\Polaris GitHub\Sistema restaurante\rest_system\venv\Scripts\python.exe
=======
#!C:\POLARISS\codigo\dia24\Rest_System\venv\Scripts\python.exe
>>>>>>> bd36b4b623b5ae9b7eab3c09f41effa8418e5f1a
# When the django-admin.py deprecation ends, remove this script.
import warnings

from django.core import management

try:
    from django.utils.deprecation import RemovedInDjango40Warning
except ImportError:
    raise ImportError(
        'django-admin.py was deprecated in Django 3.1 and removed in Django '
        '4.0. Please manually remove this script from your virtual environment '
        'and use django-admin instead.'
    )

if __name__ == "__main__":
    warnings.warn(
        'django-admin.py is deprecated in favor of django-admin.',
        RemovedInDjango40Warning,
    )
    management.execute_from_command_line()
