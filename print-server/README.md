Print server
===========

This is a small Node.js print server that receives HTML + printer name and prints
via `puppeteer` -> `pdf-to-printer`. Run this on a machine with access to the
physical printers (Windows or a machine with configured printers).

Quick start
-----------

1. From the repository root, install dependencies (if not already):

```bash
npm install
```

2. Start the print server:

```bash
npm run start:print-server
```

3. By default the server listens on port `3001`. Point your client to
`http://<host>:3001/api/print` or open the app and set `print_server` query
parameter to that URL so `directPrint` will use it.

Security
--------

This server exposes a raw print endpoint. Run it only on trusted networks or
behind a VPN/proxy and consider adding authentication.
