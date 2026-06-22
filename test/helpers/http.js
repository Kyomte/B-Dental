// Minimal stand-ins for the Vercel (Node http-like) req/res objects the API
// handlers expect. Enough to drive a handler in-process and assert on what it
// sent back — no network, no server.

export function mockReq({ method = 'GET', body, query = {}, cookies } = {}) {
  return {
    method,
    body,
    query,
    headers: cookies ? { cookie: cookies } : {},
  };
}

export function mockRes() {
  const res = {
    statusCode: 200,
    body: undefined,
    headers: {},
    ended: false,
    status(code) { this.statusCode = code; return this; },
    json(payload) { this.body = payload; this.ended = true; return this; },
    end() { this.ended = true; return this; },
    setHeader(k, v) { this.headers[k] = v; },
    getHeader(k) { return this.headers[k]; },
  };
  return res;
}
