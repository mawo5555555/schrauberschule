# Hilfsserver für den Headless-Test: antwortet nach 4 s (hält die virtuelle Zeit an, damit IndexedDB in Echtzeit fertig wird)
import http.server,time,sys
class H(http.server.BaseHTTPRequestHandler):
    def do_GET(s):
        time.sleep(4); s.send_response(200); s.send_header('Access-Control-Allow-Origin','*'); s.end_headers(); s.wfile.write(b'ok')
    def log_message(s,*a): pass
http.server.ThreadingHTTPServer(('127.0.0.1',int(sys.argv[1])),H).serve_forever()
