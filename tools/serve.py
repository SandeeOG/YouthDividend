#!/usr/bin/env python3
"""Local development server for the Youth Dividend site.

    python tools/serve.py [port]      # default port 5173

* Serves the site from the project root.
* Builds content-manifest.json on every request, so a post file dropped into
  research/, data-lab/ or resources/ shows up on the next page refresh.
* Sends no-cache headers so the browser never shows a stale page while editing.
"""
import functools
import http.server
import json
import sys

from build_content import ROOT, build, bundle_js


class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

    def do_GET(self):
        if self.path.split('?')[0] == '/content-manifest.json':
            body = json.dumps(build()).encode('utf-8')
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Content-Length', str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        if self.path.split('?')[0] == '/assets/js/content-bundle.js':
            body = bundle_js().encode('utf-8')
            self.send_response(200)
            self.send_header('Content-Type', 'text/javascript; charset=utf-8')
            self.send_header('Content-Length', str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        super().do_GET()

    def log_message(self, fmt, *args):  # keep the console quiet apart from errors
        if args and str(args[1]).startswith(('4', '5')):
            super().log_message(fmt, *args)


Handler.extensions_map.update({'.md': 'text/markdown; charset=utf-8', '.js': 'text/javascript; charset=utf-8'})

if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 5173
    server = http.server.ThreadingHTTPServer(('', port), functools.partial(Handler, directory=ROOT))
    print(f'Youth Dividend running at http://localhost:{port}')
    server.serve_forever()
