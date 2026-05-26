document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("cropForm");
  const resultDiv = document.getElementById("result");

  form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const soilType = document.getElementById("soilType").value.trim();
    const city = document.getElementById("city").value.trim();
    const season = document.getElementById("season").value;
    const nitrogen = document.getElementById("nitrogen").value.trim();
    const phosphorus = document.getElementById("phosphorus").value.trim();
    const potassium = document.getElementById("potassium").value.trim();
    const soilPh = document.getElementById("soilPh").value.trim();

    if (!soilType || !city || !season) {

      resultDiv.innerHTML = "⚠️ Please fill all fields";
      return;

    }

    const payload = {

      soil_type: soilType,
      season: season,
      location: city

    };

    // attach optional numeric inputs if provided
    if (nitrogen) payload.N = Number(nitrogen);
    if (phosphorus) payload.P = Number(phosphorus);
    if (potassium) payload.K = Number(potassium);
    if (soilPh) payload.ph = Number(soilPh);

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

      // render weather
      let cropsHtml = '';
      if (data.recommended_crops && Array.isArray(data.recommended_crops)) {
        cropsHtml = '<ul>' + data.recommended_crops.map(c => `<li>${c.crop} — ${(c.confidence*100).toFixed(1)}%</li>`).join('') + '</ul>';
      } else if (data.recommended_crop) {
        cropsHtml = `<b>${data.recommended_crop}</b>`;
      }

      resultDiv.innerHTML = `
        <div class="weather-box">
          🌍 Location: ${data.location} <br>
          🌡 Temperature: ${data.temperature} °C <br>
          💧 Humidity: ${data.humidity} %
        </div>

        <div class="crop-box">
          🌾 Top Recommendations:
          ${cropsHtml}
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