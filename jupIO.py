from __future__ import print_function
import readline
import jupyter_client
from Queue import Empty
from time import sleep
import json

class DigestBase(object):
    def __call__(self, msg):
        functions = {'status': self.digest_status,
                     'stream': self.digest_stream,
                     'execute_result': self.digest_result,
                     'error': self.digest_error,
                     'display_data': self.digest_display}
        header = msg['header']
        fn = functions.get(header['msg_type'],
                           lambda x: None)
        return fn(msg['content'])
    def digest_status(self, content):
        return None
    def digest_stream(self, content):
        return None
    def digest_result(self, content):
        return None
    def digest_error(self, content):
        return None
    def digest_display(self, content):
        return None


class PrintDigest(DigestBase):
    def digest_status(self, content):
        if content['execution_state'] == 'idle':
            return True
        return None
    def digest_stream(self, content):
        print('stream', content)
        return None
    def digest_result(self, content):
        print('result', content)
        return None
    def digest_error(self, content):
        print("{ename}: {evalue}".format(**content))
        print("\n".join(content['traceback']))
        return None
    def digest_display(self, content):
        print('display', content)
        return None

class JupIO(object):
    def __init__(self, kernel_name = 'python2'):
        self.m = jupyter_client.KernelManager()
        self.m.kernel_name = kernel_name
        self.m.start_kernel()
        self.c = self.m.client()
        self.c.start_channels()
        self.timeout = 1
    def dump_all(self, channel):
        def print_with_json(msg):
            print(json.dumps(msg,
                             default=str,
                             indent=2,
                             sort_keys=True))
        self.forall_channel(channel, print_with_json)
    def run_with_callback(self, code, callback):
        self.c.execute(code)
        self.forall_iopub(callback)
    def forall_channel(self, channel, callback):
        ch_ms = self.c.__getattribute__('get_{0}_msg'.format(channel))
        while (True):
            try:
                if callback(ch_ms(timeout = self.timeout)):
                    break
            except Empty:
                break
    def forall_iopub(self, callback):
        self.forall_channel('iopub', callback)
    def forall_shell(self, callback):
        self.forall_channel('shell', callback)
                
if __name__ == "__main__":
    k = JupIO()
    d = PrintDigest()
    while (True):
        try:
            code = raw_input('> ')
        except EOFError:
            break
        k.run_with_callback(code, d)
