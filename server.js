import express from "express";
import fetch from "node-fetch"; 
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "frontend")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

app.get("/weather", async (req, res) => {
  const city = (req.query.city || "").trim();
  if (!city) return res.status(400).json({ error: "city query param is required" });

  const url = `https://wttr.in/${encodeURIComponent(city)}?format=j1`;

  try {
    const r = await fetch(url, { headers: { "User-Agent": "node.js" } });
    if (!r.ok) {
     
      const txt = await r.text();
      return res.status(r.status).json({ error: "Upstream error", upstreamStatus: r.status, upstreamBody: txt });
    }

    const data = await r.json();

    const current = data.current_condition?.[0] ?? {};
    const area = data.nearest_area?.[0] ?? null;

    const result = {
      city: area?.areaName?.[0]?.value || city,
      region: area?.region?.[0]?.value || "",
      country: area?.country?.[0]?.value || "",
      temp: current.temp_C ? Number(current.temp_C) : null,
      feels_like: current.FeelsLikeC ? Number(current.FeelsLikeC) : null,
      humidity: current.humidity ? Number(current.humidity) : null,
      wind_kmph: current.windspeedKmph ? Number(current.windspeedKmph) : null,
      description: current.weatherDesc?.[0]?.value || "",
      icon: current.weatherIconUrl?.[0]?.value || "",
      raw: null 
    };

    res.json(result);
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ error: "Server error fetching weather", detail: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
