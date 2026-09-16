#!/usr/bin/env python3
"""
Simple local web server for Math Pop!
Automatically finds an available port starting at 8080 and opens the web app in your browser.
"""
import http.server
import socketserver
import webbrowser
import sys
import os

DEFAULT_PORT = 8080

class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        sys.stderr.write(f"[{self.log_date_time_string()}] {format % args}\n")
        sys.stderr.flush()

def find_available_port(start_port=DEFAULT_PORT, max_attempts=50):
    for port in range(start_port, start_port + max_attempts):
        try:
            with socketserver.TCPServer(("", port), None) as s:
                return port
        except OSError:
            continue
    return start_port

def main():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    port = find_available_port(DEFAULT_PORT)
    url = f"http://localhost:{port}"
    
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", port), QuietHandler) as httpd:
        print(f"\n=======================================================", flush=True)
        print(f"🎉 Math Pop! is running locally at: {url}", flush=True)
        print(f"⌨️  Press Ctrl+C to stop the server.", flush=True)
        print(f"=======================================================\n", flush=True)
        
        if "--no-browser" not in sys.argv:
            try:
                webbrowser.open(url)
            except Exception as e:
                print(f"Could not launch browser automatically: {e}", flush=True)

        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server. Happy learning!", flush=True)

if __name__ == "__main__":
    main()
