import puppeteer from 'puppeteer';

export default async function handler(req, res) {
  try {
    const { html } = req.body;

    if (!html) {
      return res.status(400).json({ error: 'No HTML content provided' });
    }

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    // 整页截图
    const buffer = await page.screenshot({ type: 'jpeg', fullPage: true, quality: 90 });
    await browser.close();

    const base64 = buffer.toString('base64');
    return res.status(200).json({
      imageBase64: `data:image/jpeg;base64,${base64}`
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
