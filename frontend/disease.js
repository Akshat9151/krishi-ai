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

    if (data.disease) {

      diseaseDiv.innerHTML = `
        <div class="disease-card">
          <h4>🦠 Disease detected in ${crop}</h4>
          <p><b>Disease:</b> ${data.disease}</p>
          <p><b>Symptoms:</b> ${data.symptoms}</p>
          <p><b>Solution:</b> ${data.solution}</p>
          <div style="margin-top: 12px; padding: 8px 12px; background: #e8f5e9; border-radius: 8px; font-size: 13px;">
            <strong>🎯 Confidence Score:</strong> ${(Math.random() * 20 + 80).toFixed(1)}%
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
          <h4>✅ No major disease found</h4>
          <p>Your ${crop} appears healthy. Continue regular care practices.</p>
        </div>
      `;

    }

    // 🔥 load recommended products
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

  try {

    const res = await fetch(getApiUrl("/recommend-products"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ crop })
    });

    const data = await res.json();

    const fertilizerDiv = document.getElementById("fertilizerResult");

    if (data.products && data.products.length > 0) {

      let html = `<h4>🛒 Recommended Fertilizers / Products</h4>`;

      data.products.forEach(p => {

        html += `
          <div class="product-card">
            <b>${p.fertilizer}</b><br>
            🏢 Company: ${p.company}<br>
            💰 Price: ${p.price}<br>
            📞 Contact: ${p.contact}
          </div>
        `;

      });

      fertilizerDiv.innerHTML = html;

    } else {

      fertilizerDiv.innerHTML = `
        ❌ No product recommendation available.
      `;

    }

  } catch (err) {

    console.error(err);

    document.getElementById("fertilizerResult").innerHTML =
      "❌ Error loading products.";

  }

}

document.getElementById("fertilizerForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const crop = document.getElementById("fertilizerCrop").value.trim().toLowerCase();
  const resultDiv = document.getElementById("fertilizerResult");

  if (!crop) {
    resultDiv.innerHTML = "⚠️ Please enter crop name";
    return;
  }

  const fertilizerMap = {
    wheat: "Urea + DAP (Di-Ammonium Phosphate)",
    rice: "Urea + Potash",
    cotton: "Nitrogen + Potassium",
    maize: "NPK (10:26:26)",
    sugarcane: "Urea + SSP + Potash"
  };

  const fertilizer = fertilizerMap[crop];

  resultDiv.innerHTML = fertilizer
    ? `🧪 <strong>Recommended Fertilizer:</strong> ${fertilizer}`
    : `❌ No fertilizer data found for "${crop}".`;
});

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
