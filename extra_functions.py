""""
This module contains the datetime functions
"""
from datetime import datetime
import pytz


def current_date():
    """Returns current date formatted as 'Month Day, Year' """
    jamaica = pytz.timezone("America/Jamaica")
    date    = datetime.now(jamaica).strftime("%B %d, %Y")
    return date