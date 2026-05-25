const express = require('express');
const path = require('path');
const fs = require('fs');

async function createServer() {
  const expressP = express();
  expressP.use(express.json({ limit: '20mb' }));

  // Enable CORS middleware to allow local and external network cross-origin print requests
  expressP.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  const TMP_DIR = path.join(__dirname, 'tmp');
  if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR, { recursive: true });

  expressP.post('/api/print', async (req, res) => {
    try {
      const { html, printerName } = req.body || {};
      if (!html || !printerName) {
        return res.status(400).json({ status: 'error', message: 'Missing html or printerName' });
      }

      // Lazy import heavy native deps
      const puppeteer = (await import('puppeteer')).default;
      const pdfToPrinter = (await import('pdf-to-printer')).default || (await import('pdf-to-printer'));

      const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
      const page = await browser.newPage();
      await page.setViewport({ width: 302, height: 800 });
      await page.setContent(html, { waitUntil: 'networkidle0' });

      const tmpFile = path.join(TMP_DIR, `pos_print_${Date.now()}.pdf`);
      await page.pdf({ path: tmpFile, width: '80mm', printBackground: true, margin: { top: '2mm', right: '2mm', bottom: '2mm', left: '2mm' } });
      await browser.close();

      // Printer mapping logic: map logical names to physical Windows printers
      const physicalPrinter = 
        printerName.toLowerCase() === 'kitchen' ? (process.env.PRINTER_KITCHEN || 'kitchen') :
        printerName.toLowerCase() === 'drink' ? (process.env.PRINTER_DRINK || 'drink') :
        printerName;

      console.log(`[print-server] Logical printer "${printerName}" mapped to physical printer "${physicalPrinter}"`);
      await pdfToPrinter.print(tmpFile, { printer: physicalPrinter });

      // cleanup
      fs.unlink(tmpFile, () => { });

      return res.json({ status: 'ok', printer: printerName });
    } catch (err) {
      console.error('[print-server] print error', err);
      return res.status(500).json({ status: 'error', message: err?.message || String(err) });
    }
  });

  const port = process.env.PRINT_SERVER_PORT || 8085;
  expressP.listen(port, () => console.log(`[print-server] Listening on http://0.0.0.0:${port}`));
}

createServer().catch(err => {
  console.error('Failed to start print server', err);
  process.exit(1);
});
