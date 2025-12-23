const express = require("express");
const { firefox } = require("playwright");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname))); // serve frontend files

app.post("/browse", async (req, res) => {
  const { url } = req.body;

  if (!url || !url.startsWith("http")) return res.status(400).json({ error: "Invalid URL" });

  const browser = await firefox.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 20000 });
    const screenshot = await page.screenshot({ type: "png" });

    res.set("Content-Type", "image/png");
    res.send(screenshot);
  } catch {
    res.status(500).json({ error: "Failed to load page" });
  } finally {
    await browser.close();
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Firefox server running on port ${PORT}`);
});
