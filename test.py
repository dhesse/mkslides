import unittest
from serve import call_pandoc, fmt
import io

class TestCallPandoc(unittest.TestCase):

    def test_h3(self):

        actual = call_pandoc("### Test")
        self.assertIn("h3", actual)

    def test_math(self):

        actual = call_pandoc("$\alpha$")
        self.assertIn("math inline", actual)


class TestFmt(unittest.TestCase):

    def test_basic(self):

        actual = fmt(io.StringIO("Hello, World!"))
        print(actual)
