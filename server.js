const express = require("express");
const { firefox } = require("playwright");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.post("/browse", async (req, res) => {
  const { url } = req.body;

  if (!url || !url.startsWith("http")) return res.status(400).json({ error: "Invalid URL" });

  let browser;
  try {
    browser = await firefox.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
    const screenshot = await page.screenshot({ type: "png" });

    res.set("Content-Type", "image/png");
    res.send(screenshot);
  } catch (err) {
    console.error("Failed to browse URL:", err);
    res.status(500).json({ error: "Failed to load page" });
  } finally {
    if (browser) await browser.close();
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Firefox server running on port ${PORT}`);
});
