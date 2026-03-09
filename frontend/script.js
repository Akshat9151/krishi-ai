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

      const res = await fetch("http://127.0.0.1:8000/predict", {

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

    } catch (error) {

      console.error(error);
      resultDiv.innerHTML = "❌ Backend connection error";

    }

  });

});