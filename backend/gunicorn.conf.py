import os

workers = 2
threads = 2
bind = f"0.0.0.0:{os.environ.get('PORT', '5001')}"
timeout = 600

loglevel = 'debug'