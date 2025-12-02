import os

# Ableton OSC settings
ABLETON_HOST = os.getenv('ABLETON_HOST', '127.0.0.1')
ABLETON_PORT = int(os.getenv('ABLETON_PORT', '11000'))

# Defaults
DEFAULT_VELOCITY = 80
MIN_NOTE_DURATION = 0.25
