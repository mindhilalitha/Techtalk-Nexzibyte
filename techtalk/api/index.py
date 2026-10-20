import sys
import os

# Search both local techtalk/backend and parent backend
current_dir = os.path.dirname(os.path.abspath(__file__))
techtalk_dir = os.path.dirname(current_dir)
techtalk_backend = os.path.join(techtalk_dir, "backend")
root_dir = os.path.dirname(techtalk_dir)
root_backend = os.path.join(root_dir, "backend")

for path in [techtalk_backend, techtalk_dir, root_backend, root_dir]:
    if os.path.exists(path) and path not in sys.path:
        sys.path.insert(0, path)

from app.main import app

app = app
