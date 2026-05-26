document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("cropForm");
  const resultDiv = document.getElementById("result");

  const renderLoading = () => {
    resultDiv.innerHTML = `
      <div class="loading-text">
        <span class="spinner"></span>
        Fetching crop recommendations based on soil, location and season...
      </div>
    `;
  };

  const renderError = (message) => {
    resultDiv.innerHTML = `<div class="result-card error-card">⚠️ ${message}</div>`;
  };

  const renderResult = (data) => {
    const topCrop = data.recommended_crops?.[0] || null;
    const altCrops = data.recommended_crops?.slice(1) || [];

    const weatherHtml = `
      <div class="weather-card">
        <h4>Weather snapshot</h4>
        <p>📍 ${data.location}</p>
        <p>🌡 ${data.temperature.toFixed(1)} °C</p>
        <p>💧 ${data.humidity.toFixed(1)}% humidity</p>
        <p>🌧 ${data.rainfall.toFixed(1)} mm rainfall</p>
      </div>
    `;

    const mainHtml = topCrop ? `
      <div class="result-card">
        <div class="card-header">
          <div class="crop-icon">${topCrop.icon || '🌾'}</div>
          <div>
            <h3>${topCrop.crop}</h3>
            <p>${topCrop.description}</p>
          </div>
        </div>

        <div class="result-grid">
          <div><strong>Confidence</strong><br>${(topCrop.confidence * 100).toFixed(1)}%</div>
          <div><strong>Season</strong><br>${topCrop.suitable_season}</div>
          <div><strong>Soil</strong><br>${topCrop.soil_compatibility}</div>
          <div><strong>Water</strong><br>${topCrop.water_requirement}</div>
        </div>

        <div class="detail-block">
          <h4>Recommended Fertilizer</h4>
          <p>${topCrop.recommended_fertilizer}</p>
        </div>

        <div class="detail-block">
          <h4>Farming Tips</h4>
          <p>${topCrop.tips}</p>
        </div>
      </div>
    ` : `<div class="result-card">No recommendation available.</div>`;

    const alternativesHtml = altCrops.length ? `
      <div class="alternative-list">
        <h4>Other suitable crops</h4>
        <div class="crop-grid">
          ${altCrops.map(crop => `
            <div class="alt-card">
              <div class="alt-header"><span>${crop.icon || '🌿'}</span><strong>${crop.crop}</strong></div>
              <p>${crop.suitable_season}</p>
              <p>${(crop.confidence * 100).toFixed(0)}% confidence</p>
            </div>
          `).join('')}
        </div>
      </div>
    ` : "";

    resultDiv.innerHTML = `
      <div class="prediction-result">
        ${weatherHtml}
        ${mainHtml}
        ${alternativesHtml}
      </div>
    `;
  };

  form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const soilType = document.getElementById("soilType").value.trim();
    const city = document.getElementById("city").value.trim();
    const season = document.getElementById("season").value;

    if (!soilType || !city || !season) {
      renderError("Please select soil type, city, and season.");
      return;
    }

    const payload = {
      soil_type: soilType,
      location: city,
      season: season
    };

    renderLoading();

    try {

      const res = await fetch(getApiUrl("/api/predict-crop"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || "Prediction service returned an error.");
      }

      const data = await res.json();
      renderResult(data);

      const predictionHistory = JSON.parse(localStorage.getItem('krishi_prediction_history')) || [];
      predictionHistory.push({
        crop: data.recommended_crops?.[0]?.crop || "Unknown",
        location: data.location,
        season,
        soil_type: soilType,
        timestamp: Date.now()
      });
      localStorage.setItem('krishi_prediction_history', JSON.stringify(predictionHistory));

      const stats = JSON.parse(localStorage.getItem('krishi_stats')) || {};
      stats.predictions = (stats.predictions || 0) + 1;
      localStorage.setItem('krishi_stats', JSON.stringify(stats));

      if (!localStorage.getItem('krishi_first_use')) {
        localStorage.setItem('krishi_first_use', Date.now().toString());
      }

    } catch (error) {

      console.error(error);
      renderError(error.message || "Backend connection error.");

    }

  });

});