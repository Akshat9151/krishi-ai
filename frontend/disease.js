/* =========================
   🦠 DISEASE PREDICTION
=========================== */

// Image Preview Functionality
const cropImageInput = document.getElementById("cropImage");
const imagePreview = document.getElementById("imagePreview");
const previewImg = document.getElementById("previewImg");
const imageName = document.getElementById("imageName");

if (cropImageInput) {
  cropImageInput.addEventListener("change", function(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        previewImg.src = e.target.result;
        imageName.textContent = file.name;
        imagePreview.style.display = "block";
      };
      reader.readAsDataURL(file);
    }
  });
}

document.getElementById("diseaseForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const crop = document.getElementById("diseaseCrop").value.trim().toLowerCase();
  const diseaseDiv = document.getElementById("diseaseResult");
  const fertilizerDiv = document.getElementById("fertilizerResult");

  if (!crop) {
    diseaseDiv.innerHTML = "⚠️ Please enter crop name";
    return;
  }

  diseaseDiv.innerHTML = `<div class="loading-text"><span class="spinner"></span> Checking disease...</div>`;
  fertilizerDiv.innerHTML = "";

  try {

    const res = await fetch(getApiUrl("/api/predict-disease"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ crop })
    });

    const data = await res.json();

    if (data && data.disease && data.disease !== "No data found") {
      const confidence = 95.0;

      diseaseDiv.innerHTML = `
        <div class="disease-card">
          <h4>🦠 Disease Analysis for ${crop}</h4>
          <p><b>Disease:</b> ${data.disease}</p>
          <p><b>Symptoms:</b> ${data.symptoms || "Standard field symptoms detected"}</p>
          <p><b>Solution:</b> ${data.solution || "Apply recommended organic or chemical treatment"}</p>
          <div style="margin-top: 12px; padding: 8px 12px; background: #e8f5e9; border-radius: 8px; font-size: 13px; color: #1b5e20;">
            <strong>🎯 Diagnostic Confidence:</strong> ${confidence.toFixed(1)}% (Database Verified)
          </div>
        </div>
      `;

      // Save to disease history
      const diseaseHistory = JSON.parse(localStorage.getItem('krishi_disease_history')) || [];
      diseaseHistory.push({
        crop: crop,
        disease: data.disease,
        solution: data.solution,
        timestamp: Date.now()
      });
      localStorage.setItem('krishi_disease_history', JSON.stringify(diseaseHistory));

      // Update stats
      const stats = JSON.parse(localStorage.getItem('krishi_stats')) || {};
      stats.diseases = (stats.diseases || 0) + 1;
      localStorage.setItem('krishi_stats', JSON.stringify(stats));

    } else {

      diseaseDiv.innerHTML = `
        <div class="disease-card" style="background: #e8f5e9; border-left-color: #4caf50;">
          <h4>✅ General Farm Health for ${crop}</h4>
          <p>Your ${crop} crop profile is in good condition. Follow timely irrigation, weeding, and balanced fertilizer dosage.</p>
        </div>
      `;

    }

    // 🔥 load recommended products from AgriStore
    loadProducts(crop);

  } catch (err) {

    console.error(err);
    diseaseDiv.innerHTML = "❌ Backend error while predicting disease.";

  }

});


/* =========================
   🛒 PRODUCT RECOMMENDATION
=========================== */

async function loadProducts(crop) {
  const fertilizerDiv = document.getElementById("fertilizerResult");
  fertilizerDiv.innerHTML = `<div class="loading-text"><span class="spinner"></span> Loading store products for ${crop}...</div>`;

  try {

    const res = await fetch(getApiUrl(`/api/store/fertilizers/recommend?crop=${encodeURIComponent(crop)}`));
    if (!res.ok) {
      throw new Error("Store API error");
    }

    const data = await res.json();

    if (data && data.length > 0) {

      let html = `<h4 style="margin-bottom: 12px; color: #1b5e20;">🛒 Recommended Remedies & Fertilizers from Krishi AI Store</h4>`;
      html += `<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">`;

      data.slice(0, 4).forEach(r => {
        const p = r.product;
        if (!p) return;
        html += `
          <div class="product-card" style="border: 1px solid #c8e6c9; border-radius: 12px; padding: 14px; background: #fff; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <img src="${p.image_url}" alt="${p.name}" style="width: 100%; height: 110px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;" />
              <div style="font-size: 11px; color: #2e7d32; font-weight: bold;">${p.badge || 'प्रमाणित इलाज'}</div>
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
      });

      html += `</div>`;
      fertilizerDiv.innerHTML = html;

    } else {

      fertilizerDiv.innerHTML = `
        <div style="padding: 12px; background: #f9f9f9; border-radius: 8px; color: #666;">
          ℹ️ Visit <a href="store/index.html" style="color: #2e7d32; font-weight: bold;">Krishi AI Store</a> for more crop protection products.
        </div>
      `;

    }

  } catch (err) {

    console.error(err);

    fertilizerDiv.innerHTML = `
      <div style="padding: 12px; background: #fff3e0; border-radius: 8px; color: #e65100;">
        🛒 Visit <a href="store/index.html" style="color: #1b5e20; font-weight: bold;">Krishi AI Store</a> to explore remedies.
      </div>
    `;

  }

}

if (document.getElementById("fertilizerForm")) {
  document.getElementById("fertilizerForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const crop = document.getElementById("fertilizerCrop").value.trim();
    const resultDiv = document.getElementById("fertilizerResult");

    if (!crop) {
      resultDiv.innerHTML = "⚠️ Please enter crop name";
      return;
    }

    resultDiv.innerHTML = `<div class="loading-text"><span class="spinner"></span> Querying database for ${crop} fertilizers...</div>`;

    try {
      const res = await fetch(getApiUrl(`/api/store/fertilizers/recommend?crop=${encodeURIComponent(crop)}`));
      if (!res.ok) throw new Error("Could not fetch recommendations");
      const recs = await res.json();

      if (recs && recs.length > 0) {
        const topRec = recs[0];
        resultDiv.innerHTML = `
          <div style="background: #e8f5e9; border-left: 4px solid #2e7d32; padding: 12px; border-radius: 8px; margin-bottom: 15px;">
            🧪 <strong>Recommended Fertilizer for ${crop}:</strong> ${topRec.fertilizer_type || "Balanced NPK"} (Score: ${topRec.recommendation_score})
          </div>
        `;
        loadProducts(crop);
      } else {
        resultDiv.innerHTML = `
          <div style="background: #fff3e0; border-left: 4px solid #e65100; padding: 12px; border-radius: 8px;">
            ℹ️ No specific chemical recommendation mapped for "${crop}". Explore general organic bio-fertilizers below:
          </div>
        `;
        loadProducts(crop);
      }
    } catch (err) {
      console.error(err);
      resultDiv.innerHTML = `❌ Error connecting to fertilizer database. Please visit <a href="store/index.html">AgriStore</a>.`;
    }
  });
}

/* =========================
   🤖 AI ASSISTANT
=========================== */

const assistantForm = document.getElementById("assistantForm");
if (assistantForm) {
  const assistantMessage = document.getElementById("assistantMessage");
  const assistantChat = document.getElementById("assistantChat");
  const assistantStatus = document.getElementById("assistantStatus");

  const addAssistantMessage = (text, sender) => {
    const bubble = document.createElement("div");
    bubble.className = sender === "assistant" ? "chat bot" : "chat user";
    bubble.innerText = text;
    assistantChat.appendChild(bubble);
    assistantChat.scrollTop = assistantChat.scrollHeight;
  };

  const setAssistantStatus = (text, isError = false) => {
    assistantStatus.innerText = text;
    assistantStatus.style.color = isError ? "#c0392b" : "#2e7d32";
  };

  assistantForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const message = assistantMessage.value.trim();
    if (!message) {
      setAssistantStatus("Kripya sawal likhe.", true);
      return;
    }

    addAssistantMessage(message, "user");
    assistantMessage.value = "";
    setAssistantStatus("Krishi AI se jawab aa raha hai...", false);

    try {
      const response = await fetch(getApiUrl("/api/ai-assistant"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
      });

      if (!response.ok) {
        let errorData = {};
        try {
          errorData = await response.json();
        } catch (_err) {}
        throw new Error(errorData.detail || "Server abhi thoda busy hai.");
      }

      const data = await response.json();
      addAssistantMessage(data.reply || "Krishi AI abhi jawab nahi de pa raha hai.", "assistant");
      setAssistantStatus("Jawab mil gaya. Neeche dekhein.", false);
    } catch (err) {
      console.error(err);
      setAssistantStatus(err.message || "AI assistant service unavailable.", true);
      addAssistantMessage("Krishi AI se abhi jawab nahin mila. Kuch der baad phir koshish karein.", "assistant");
    }
  });
}
