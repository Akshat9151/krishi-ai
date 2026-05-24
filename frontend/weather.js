// API Configuration
const API_BASE_URL = 'https://krishi-ai-2-4j3k.onrender.com';
const getApiUrl = (endpoint) => `${API_BASE_URL}${endpoint}`;

document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("weatherForm");
  const resultDiv = document.getElementById("weatherResult");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const city = document.getElementById("city").value.trim();

    if (!city) {
      resultDiv.innerHTML = "⚠️ Please enter city name";
      return;
    }

    resultDiv.innerHTML = "⏳ Fetching weather data...";

    try {
      const response = await fetch(
        getApiUrl("/api/weather"),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ location: city })
        }
      );

      const data = await response.json();

      resultDiv.innerHTML = `
        <div class="weather-card">
          <h4>🌍 Weather in ${city}</h4>
          <p>🌡️ <b>Temperature:</b> ${data.temperature} °C</p>
          <p>💧 <b>Humidity:</b> ${data.humidity} %</p>
          <p>🌧️ <b>Rainfall:</b> ${data.rainfall} mm</p>
        </div>
      `;

    } catch (error) {
      console.error(error);
      resultDiv.innerHTML = "❌ Failed to fetch weather data";
    }
  });

});
