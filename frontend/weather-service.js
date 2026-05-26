// 🌤️ Weather Service using Open-Meteo API
class WeatherService {
  constructor() {
    this.baseUrl = 'https://api.open-meteo.com/v1/forecast';
  }

  async getWeather(latitude, longitude) {
    try {
      const params = new URLSearchParams({
        latitude,
        longitude,
        current: 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,precipitation',
        hourly: 'temperature_2m,precipitation',
        daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum',
        timezone: 'Asia/Kolkata'
      });

      const response = await fetch(`${this.baseUrl}?${params}`);
      if (!response.ok) throw new Error('Weather API failed');
      return await response.json();
    } catch (error) {
      console.error('Weather error:', error);
      return null;
    }
  }

  async getLocationCoordinates(cityName) {
    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1&language=en&format=json`
      );
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const result = data.results[0];
        return { latitude: result.latitude, longitude: result.longitude };
      }
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  }

  getFarmingTips(weatherCode, temp, humidity) {
    const tips = [];

    if (weatherCode === 0 || weatherCode === 1) {
      tips.push('☀️ Clear skies - Great day for field work and pest management.');
    }
    if (weatherCode >= 51 && weatherCode <= 67) {
      tips.push('🌧️ Rain expected - Water your crops wisely, avoid excess.');
    }
    if (temp > 35) {
      tips.push('🔥 High temperature - Increase irrigation and use mulch.');
    }
    if (temp < 5) {
      tips.push('❄️ Cold weather - Protect sensitive crops from frost.');
    }
    if (humidity > 80) {
      tips.push('💧 High humidity - Risk of fungal diseases, ensure ventilation.');
    }

    return tips.length > 0 ? tips : ['📌 Maintain regular crop monitoring.'];
  }
}

window.WeatherService = WeatherService;
