const form = document.getElementById("weatherForm");
const cityInput = document.getElementById("cityInput");
const message = document.getElementById("message");
const result = document.getElementById("result");

const placeEl = document.getElementById("place");
const countryEl = document.getElementById("country");
const iconEl = document.getElementById("icon");
const tempEl = document.getElementById("temp");
const descEl = document.getElementById("desc");
const feelsEl = document.getElementById("feels");
const humidEl = document.getElementById("humidity");
const windEl = document.getElementById("wind");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (!city) return;

  message.textContent = "";
  result.classList.add("hidden");
  message.textContent = "Fetching weather...";

  try {
    const res = await fetch(`/weather?city=${encodeURIComponent(city)}`);
    const data = await res.json();

    if (!res.ok) {
      message.textContent = data.error || "Could not fetch weather.";
      return;
    }

    // Populate UI
    placeEl.textContent = data.city;
    countryEl.textContent = data.country ? `, ${data.country}` : "";
    tempEl.textContent = `${Math.round(data.temp)}°C`;
    descEl.textContent = data.description;
    feelsEl.textContent = `${Math.round(data.feels_like)}°C`;
    humidEl.textContent = `${data.humidity}%`;
    windEl.textContent = data.wind ?? "-";

    if (data.icon) {
      iconEl.src = `https://openweathermap.org/img/wn/${data.icon}@2x.png`;
      iconEl.alt = data.description;
      iconEl.style.display = "";
    } else {
      iconEl.style.display = "none";
    }

    applyTempBackground(data.temp);

    message.textContent = "";
    result.classList.remove("hidden");
  } catch (err) {
    console.error(err);
    message.textContent = "Network or server error.";
  }
});

function applyTempBackground(tempC) {
  
  const body = document.body;
  if (typeof tempC !== "number") return;
  if (tempC <= 5) {
    body.style.background = "linear-gradient(180deg,#e6f0ff,#f3f7ff)";
  } else if (tempC <= 20) {
    body.style.background = "linear-gradient(180deg,#eefaf1,#f6fff8)";
  } else if (tempC <= 30) {
    body.style.background = "linear-gradient(180deg,#fff7ed,#fffef7)";
  } else {
    body.style.background = "linear-gradient(180deg,#fff6f0,#fff5f0)";
  }
}
