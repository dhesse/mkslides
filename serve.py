#!/usr/bin/env python
import argparse
from flask import Flask, jsonify, send_from_directory, render_template, request
from itertools import chain
from re import search
import os
import io
import subprocess
from jinja2 import PackageLoader, Environment, select_autoescape

app = Flask(__name__)

env = Environment(
    loader=PackageLoader("serve"),
    autoescape=select_autoescape()
)

@app.route('/static/<path:filename>')
def get_static_file(filename):
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

@app.route("/python", methods=['GET', 'POST'])
def run_python():
    return 'req'

def get_file_path():
    return os.path.dirname(os.path.realpath(__file__))

def call_pandoc(md_data):
    """A little hacky, but as of now, there's no support for pandoc
    2.19 in the python package."""
    fmt = "+".join(["markdown",
                    "raw_html",
                    "link_attributes",
                    "simple_tables",
                    "grid_tables",
                    "tex_math_dollars"])
    data_dir = get_file_path()
    hrfilter = os.path.join(get_file_path(), 'replacehr.py')
    call = ["pandoc", "-f", fmt, "-t", "html", "--mathjax"]
    return subprocess.check_output(call, input=md_data, encoding='utf-8')

def parse_slide(slide):

    match slide.split("%%%"):
        case [contents]:
            return call_pandoc(contents)
        case [head, *columns]:
            template = env.get_template("multi_column.html")
            return template.render(
                header=call_pandoc(head),
                columns=[call_pandoc(c) for c in columns]) 

def parse_md(md):

    return {
        'slide_html': [parse_slide(s) for s in md.split("---")]}
        

def fmt(file_handle):
    contents = file_handle.read()
    parsed_contents = parse_md(contents)
    template = env.get_template("presentation.html")
    return template.render(**parsed_contents)

    
@app.route("/talk/<path:filename>")
def get_talk(filename):
    if ".md" in filename:
        with open(filename) as fh:
            return fmt(fh)
    else:
        return send_from_directory(os.getcwd(), filename)

if __name__ == "__main__":
    app.run(debug=True, threaded=True)
