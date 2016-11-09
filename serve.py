import argparse
from flask import Flask, jsonify, send_from_directory
from itertools import chain
from re import search
import os

app = Flask(__name__)

@app.route('/static/<path:filename>')
def get_static_file(filename):
    print filename
    return send_from_directory('static', filename)

def get_talk_name(root, filename):
    with open(os.path.join(root, filename)) as talkfile:
        first_line = talkfile.readline()
        if first_line.startswith('% '):
            return first_line[2:-1]
    return filename

def get_obj(root, filename):
    return {"name": get_talk_name(root, filename),
            "url": os.path.join(root, filename)}

@app.route("/talks/")
def get_talks(path = '.'):
    talks = []
    for root, dirs, files in os.walk(path):
        for filename in files:
            if search('\.md$', filename):
                talks.append(get_obj(root, filename))
    return jsonify(talks)

if __name__ == "__main__":
    app.run(debug=True, threaded=True)
