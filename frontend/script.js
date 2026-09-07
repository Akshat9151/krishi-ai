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

      // Save prediction history with temperature & humidity
      const predictionHistory = JSON.parse(localStorage.getItem('krishi_prediction_history')) || [];
      predictionHistory.push({
        crop: data.recommended_crops?.[0]?.crop || "Unknown",
        location: data.location,
        temperature: data.temperature,
        humidity: data.humidity,
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

      // 🔥 Fetch matching products from AgriStore DB
      const topCropName = data.recommended_crops?.[0]?.crop;
      if (topCropName) {
        fetchStoreProductsForCrop(topCropName);
      }

    } catch (error) {

      console.error(error);
      renderError(error.message || "Backend connection error.");

    }

  });

  // Helper to fetch store recommendations for predicted crop
  async function fetchStoreProductsForCrop(cropName) {
    try {
      const res = await fetch(getApiUrl(`/api/store/fertilizers/recommend?crop=${encodeURIComponent(cropName)}`));
      if (!res.ok) return;
      const recs = await res.json();
      if (!recs || !recs.length) return;

      const storeSec = document.createElement("div");
      storeSec.className = "store-recommendations-block sprout-reveal";
      storeSec.style.marginTop = "24px";
      storeSec.style.padding = "20px";
      storeSec.style.background = "#ffffff";
      storeSec.style.borderRadius = "16px";
      storeSec.style.boxShadow = "0 4px 15px rgba(0,0,0,0.06)";
      storeSec.style.border = "1px solid #c8e6c9";

      let productsHtml = recs.slice(0, 4).map(r => {
        const p = r.product;
        if (!p) return "";
        return `
          <div class="store-rec-card" style="border: 1px solid #e0e0e0; border-radius: 12px; padding: 14px; background: #fafafa; display: flex; flex-direction: column; justify-content: space-between; transition: transform 0.2s ease;">
            <div>
              <img src="${p.image_url}" alt="${p.name}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;" />
              <div style="font-size: 11px; color: #2e7d32; font-weight: bold;">${p.badge || 'प्रमाणित'}</div>
              <h5 style="margin: 4px 0; color: #1b5e20; font-size: 14px;">${p.name}</h5>
              <div style="font-size: 13px; color: #555; margin-bottom: 8px;">
                <strong style="color: #2e7d32;">₹${p.price}</strong> 
                ${p.original_price ? `<span style="text-decoration: line-through; color: #999; font-size: 11px;">₹${p.original_price}</span>` : ''}
              </div>
            </div>
            <div style="display: flex; gap: 8px; margin-top: 8px;">
              <button onclick="quickAddToCart(${p.id}, '${p.name.replace(/'/g, "\\'")}', ${p.price}, '${p.image_url}')" style="flex: 1; padding: 6px 10px; background: #2e7d32; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 12px;">
                🛒 Add to Cart
              </button>
              <a href="store/product.html?id=${p.id}" style="padding: 6px 10px; background: #e8f5e9; color: #1b5e20; border-radius: 6px; text-decoration: none; font-size: 12px; font-weight: bold;">
                View
              </a>
            </div>
          </div>
        `;
      }).join('');

      storeSec.innerHTML = `
        <h4 style="margin-top: 0; color: #1b5e20; font-size: 18px; display: flex; align-items: center; gap: 8px;">
          🛒 Recommended Products & Fertilizers from Krishi AI Store
        </h4>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-top: 12px;">
          ${productsHtml}
        </div>
      `;

      resultDiv.appendChild(storeSec);
    } catch (e) {
      console.warn("Could not load store recommendations:", e);
    }
  }

});

// Global Quick Add to Cart Helper
window.quickAddToCart = function(id, name, price, image) {
  let cart = JSON.parse(localStorage.getItem('krishiCart')) || [];
  let existing = cart.find(item => item.id === id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id, name, price, image, quantity: 1 });
  }
  localStorage.setItem('krishiCart', JSON.stringify(cart));
  alert(`✅ ${name} added to cart!`);
};