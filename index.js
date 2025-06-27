async function fetchGoldSpot() {
  const url = "https://query1.finance.yahoo.com/v8/finance/chart/XAUUSD=X";
  const res = await axios.get(url);
  const price = res.data.chart.result[0].meta.regularMarketPrice;
  return price;
}
