import axios from 'axios';

const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';
const GEOCODING_API_URL = 'https://geocoding-api.open-meteo.com/v1/search';

export const weatherService = {
  // Buscar ciudades por nombre
  async searchCities(query) {
    try {
      if (!query || query.length < 2) return [];
      
      const response = await axios.get(GEOCODING_API_URL, {
        params: {
          name: query,
          count: 5,
          language: 'es',
          format: 'json'
        }
      });
      
      return response.data.results || [];
    } catch (error) {
      console.error('Error fetching cities:', error);
      throw error;
    }
  },

  // Obtener clima completo (actual, por hora y diario)
  async getWeatherData(lat, lon) {
    try {
      const response = await axios.get(WEATHER_API_URL, {
        params: {
          latitude: lat,
          longitude: lon,
          current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m',
          hourly: 'temperature_2m,precipitation_probability,weather_code,is_day',
          daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset',
          timezone: 'auto'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    }
  },

  // Obtener nombre de ciudad aproximado a partir de coordenadas si es por geolocalización
  async getCityNameByCoords(lat, lon) {
    try {
      // Open-Meteo no tiene un reverse geocoding nativo sencillo sin DB local
      // Usaremos una API gratuita alternativa para esto, o lo dejaremos como "Ubicación actual"
      const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`);
      
      if (response.data && response.data.address) {
        return response.data.address.city || 
               response.data.address.town || 
               response.data.address.village || 
               response.data.address.county || 
               'Ubicación actual';
      }
      return 'Ubicación actual';
    } catch (error) {
      console.error('Error in reverse geocoding:', error);
      return 'Ubicación actual';
    }
  }
};
