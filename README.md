# Simple pandoc slides

The call you want is

    pandoc -t html -s --data-dir . -f markdown+pandoc_title_block --template slides --filter ./replacehr.py test.md
