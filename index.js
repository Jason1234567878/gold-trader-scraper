// index.js
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

async function fetchFromYahoo(symbol) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`;
  const res = await axios.get(url);
  return res.data.chart.result[0].meta.regularMarketPrice;
}

async function fetchGoldSpot() {
  // Scrape from Investing.com (via AllOrigins)
  const proxyUrl = "https://api.allorigins.win/raw?url=https://www.investing.com/commodities/gold";
  const html = await axios.get(proxyUrl).then(res => res.data);
  const match = html.match(/last_last">([\d,\.]+)/);
  if (!match) throw new Error("Gold spot price not found");
  return parseFloat(match[1].replace(",", ""));
}

app.get("/prices", async (req, res) => {
  try {
    const xau = await fetchGoldSpot();           // XAU/USD Spot
    const gc = await fetchFromYahoo("GC=F");      // Gold Futures
    const dxy = await fetchFromYahoo("DX-Y.NYB"); // DXY Index

    res.json({ xau, gc, dxy });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to fetch prices" });
  }
});

app.get("/", (req, res) => {
  res.send("✅ Gold Trader Scraper is running.");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
