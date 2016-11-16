#!/usr/bin/env python
import argparse
from flask import Flask, jsonify, send_from_directory, render_template
from itertools import chain
from re import search
import os
import subprocess

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
            "url": os.path.join(os.path.relpath(root), filename)}

def get_talks_list():
    path = os.getcwd()
    talks = []
    for root, dirs, files in os.walk(path):
        for filename in files:
            if search('\.md$', filename):
                talks.append(get_obj(root, filename))
    return talks

@app.route("/")
def main():
    return render_template('index.html', talks=get_talks_list())

@app.route("/talks/")
def get_talks():
    return jsonify(get_talks_list())

def get_file_path():
    return os.path.dirname(os.path.realpath(__file__))

def call_pandoc(filename):
    fmt = "+".join(["markdown",
                    "link_attributes",
                    "simple_tables",
                    "grid_tables"])
    data_dir = get_file_path()
    hrfilter = os.path.join(get_file_path(), 'replacehr.py')
    call = ["pandoc", "-f", fmt, "-t", "html",
            "--filter", hrfilter, "-s",
            "--data-dir", data_dir, "--template", "slides",
            filename]
    return subprocess.check_output(call)

@app.route("/talk/<path:filename>")
def get_talk(filename):
    if ".md" in filename:
        return call_pandoc(filename)
    else:
        print os.getcwd()
        print filename
        return send_from_directory(os.getcwd(), filename)

if __name__ == "__main__":
    app.run(debug=True, threaded=True)
