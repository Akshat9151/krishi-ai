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
          <p>💨 <b>Wind Speed:</b> ${data.wind_speed} km/h</p>
        </div>
        <div class="weather-card" style="margin-top: 15px; background: #fff3e0; border-left: 5px solid #e65100;">
          <h4>🌾 Farming Recommendations</h4>
          <p style="white-space: pre-line; line-height: 1.6;">${data.recommendations}</p>
        </div>
      `;

      // Save weather data to localStorage for dashboard
      localStorage.setItem('krishi_last_weather', JSON.stringify({
        location: city,
        temperature: data.temperature,
        humidity: data.humidity,
        rainfall: data.rainfall,
        wind_speed: data.wind_speed,
        recommendations: data.recommendations,
        timestamp: Date.now()
      }));

    } catch (error) {
      console.error(error);
      resultDiv.innerHTML = "❌ Failed to fetch weather data";
    }
  });

});
