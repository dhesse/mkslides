#!/usr/bin/env python

from pandocfilters import toJSONFilter, RawBlock

def replaceHR(key, value, format, meta):
    if key == "HorizontalRule":
        return RawBlock('html', '</div>\n<div class="slide">')

if __name__ == "__main__":
    toJSONFilter(replaceHR)

