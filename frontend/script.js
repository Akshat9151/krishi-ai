document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("cropForm");
  const resultDiv = document.getElementById("result");

  form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const soilType = document.getElementById("soilType").value.trim();
    const city = document.getElementById("city").value.trim();
    const season = document.getElementById("season").value;

    if (!soilType || !city || !season) {

      resultDiv.innerHTML = "⚠️ Please fill all fields";
      return;

    }

    const payload = {

      soil_type: soilType,
      season: season,
      location: city

    };

    resultDiv.innerHTML = "⏳ Predicting best crop...";

    try {

      const res = await fetch(getApiUrl("/api/predict-crop"), {

        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)

      });

      const data = await res.json();

      resultDiv.innerHTML = `

        <div class="weather-box">
          🌍 Location: ${data.location} <br>
          🌡 Temperature: ${data.temperature} °C <br>
          💧 Humidity: ${data.humidity} %
        </div>

        <div class="crop-box">
          🌾 Recommended Crop:
          <b>${data.recommended_crop}</b>
        </div>

      `;

      // Save to prediction history
      const predictionHistory = JSON.parse(localStorage.getItem('krishi_prediction_history')) || [];
      predictionHistory.push({
        crop: data.recommended_crop,
        location: data.location,
        temperature: data.temperature,
        humidity: data.humidity,
        soil_type: soilType,
        season: season,
        timestamp: Date.now()
      });
      localStorage.setItem('krishi_prediction_history', JSON.stringify(predictionHistory));

      // Update stats
      const stats = JSON.parse(localStorage.getItem('krishi_stats')) || {};
      stats.predictions = (stats.predictions || 0) + 1;
      localStorage.setItem('krishi_stats', JSON.stringify(stats));

      // Set first use if not set
      if (!localStorage.getItem('krishi_first_use')) {
        localStorage.setItem('krishi_first_use', Date.now().toString());
      }

    } catch (error) {

      console.error(error);
      resultDiv.innerHTML = "❌ Backend connection error";

    }

  });

});