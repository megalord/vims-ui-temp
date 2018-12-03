#!/usr/bin/python

from functools import partial
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, test
import os


class PushStateHTTPRequestHandler(SimpleHTTPRequestHandler):

    def do_GET(self):
        path = self.translate_path(self.path)
        if os.path.isdir(path):
            super().do_GET()
            return

        try:
            os.stat(path)
        except FileNotFoundError:
            f = open('index.html', 'rb')
            fs = os.fstat(f.fileno())
            self.send_response(HTTPStatus.OK)
            self.send_header('Content-type', 'text/html')
            self.send_header('Content-Length', str(fs[6]))
            self.send_header('Last-Modified', self.date_time_string(fs.st_mtime))
            self.end_headers()
            self.copyfile(f, self.wfile)
            f.close()
        else:
            super().do_GET()


if __name__ == '__main__':
    import argparse

    parser = argparse.ArgumentParser()
    parser.add_argument('--bind', '-b', default='', metavar='ADDRESS',
                        help='Specify alternate bind address '
                             '[default: all interfaces]')
    parser.add_argument('--directory', '-d', default=os.getcwd(),
                        help='Specify alternative directory '
                        '[default:current directory]')
    parser.add_argument('port', action='store',
                        default=8000, type=int,
                        nargs='?',
                        help='Specify alternate port [default: 8000]')
    args = parser.parse_args()
    handler_class = partial(PushStateHTTPRequestHandler,
                            directory=args.directory)
    test(HandlerClass=handler_class, port=args.port, bind=args.bind)
