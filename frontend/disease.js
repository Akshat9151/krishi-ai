/* =========================
   🦠 DISEASE PREDICTION
=========================== */

document.getElementById("diseaseForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const crop = document.getElementById("diseaseCrop").value.trim().toLowerCase();
  const diseaseDiv = document.getElementById("diseaseResult");
  const fertilizerDiv = document.getElementById("fertilizerResult");

  if (!crop) {
    diseaseDiv.innerHTML = "⚠️ Please enter crop name";
    return;
  }

  diseaseDiv.innerHTML = "⏳ Checking disease...";
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
        </div>
      `;

    } else {

      diseaseDiv.innerHTML = `
        <p>✅ No major disease found for this crop.</p>
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