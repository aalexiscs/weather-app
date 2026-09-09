<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300 pb-10">
    <div class="max-w-md mx-auto px-4 pt-8">
      
      <!-- Header with Theme Toggle -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
          <Cloud class="w-6 h-6 mr-2 text-indigo-500" />
          Clima
        </h1>
        <button 
          @click="toggleTheme" 
          class="p-2 rounded-full bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          :title="isDark ? 'Modo claro' : 'Modo oscuro'"
        >
          <Sun v-if="isDark" class="w-5 h-5 text-yellow-400" />
          <Moon v-else class="w-5 h-5 text-indigo-500" />
        </button>
      </div>

      <!-- Search Bar -->
      <SearchBar 
        @location-selected="onLocationSelected" 
        @request-geolocation="requestGeolocation" 
      />

      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-20 space-y-4">
        <div class="w-12 h-12 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin"></div>
        <p class="text-gray-500 dark:text-gray-400 font-medium">Obteniendo clima...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-2xl p-6 text-center">
        <AlertTriangle class="w-10 h-10 text-red-500 mx-auto mb-3" />
        <h3 class="text-lg font-bold text-red-800 dark:text-red-400 mb-2">¡Ups! Algo salió mal</h3>
        <p class="text-red-600 dark:text-red-300 text-sm">{{ error }}</p>
        <button 
          @click="retryFetch" 
          class="mt-4 px-4 py-2 bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-100 rounded-lg text-sm font-medium hover:bg-red-200 dark:hover:bg-red-700 transition-colors"
        >
          Intentar de nuevo
        </button>
      </div>

      <!-- Weather Content -->
      <template v-else-if="weatherData">
        <CurrentWeather 
          :weather="weatherData.current" 
          :location="locationName" 
        />
        
        <HourlyForecast 
          :hourlyData="weatherData.hourly" 
        />
        
        <DailyForecast 
          :dailyData="weatherData.daily" 
        />
      </template>
      
      <!-- Empty State -->
      <div v-else class="flex flex-col items-center justify-center py-20 text-center">
        <Map class="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
        <h3 class="text-lg font-bold text-gray-700 dark:text-gray-300">Sin ubicación</h3>
        <p class="text-gray-500 dark:text-gray-500 mt-2 text-sm max-w-[250px]">
          Busca una ciudad o permite el acceso a tu ubicación para ver el clima.
        </p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { Sun, Moon, Cloud, AlertTriangle, Map } from 'lucide-vue-next';
import SearchBar from './components/SearchBar.vue';
import CurrentWeather from './components/CurrentWeather.vue';
import HourlyForecast from './components/HourlyForecast.vue';
import DailyForecast from './components/DailyForecast.vue';
import { weatherService } from './services/weatherService';

const isDark = ref(false);
const loading = ref(false);
const error = ref(null);
const weatherData = ref(null);
const locationName = ref('Ubicación actual');
const currentCoords = ref(null);

// Default coordinates (CDMX)
const DEFAULT_COORDS = { lat: 19.42847, lon: -99.12766, name: 'Ciudad de México' };

onMounted(() => {
  // Check user preference for theme
  isDark.value = document.documentElement.classList.contains('dark') || 
                 window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (isDark.value) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  // Try to get geolocation on startup
  requestGeolocation();
});

const toggleTheme = () => {
  isDark.value = !isDark.value;
  if (isDark.value) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

const onLocationSelected = async (location) => {
  locationName.value = location.name;
  currentCoords.value = { lat: location.latitude, lon: location.longitude };
  await fetchWeather(location.latitude, location.longitude);
};

const fetchWeather = async (lat, lon) => {
  loading.value = true;
  error.value = null;
  
  try {
    weatherData.value = await weatherService.getWeatherData(lat, lon);
  } catch (err) {
    error.value = 'No pudimos obtener los datos del clima. Verifica tu conexión a internet.';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const retryFetch = () => {
  if (currentCoords.value) {
    fetchWeather(currentCoords.value.lat, currentCoords.value.lon);
  } else {
    requestGeolocation();
  }
};

const requestGeolocation = () => {
  loading.value = true;
  error.value = null;
  
  if (!navigator.geolocation) {
    // Geolocation not supported, fallback to default
    loadDefaultLocation('Tu navegador no soporta geolocalización.');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      
      currentCoords.value = { lat, lon };
      
      try {
        locationName.value = await weatherService.getCityNameByCoords(lat, lon);
        await fetchWeather(lat, lon);
      } catch (err) {
        error.value = 'Error al obtener los datos para tu ubicación.';
        loading.value = false;
      }
    },
    (err) => {
      console.warn('Geolocation error:', err.message);
      // User denied or error occurred, load default
      loadDefaultLocation('No pudimos acceder a tu ubicación. Mostrando Ciudad de México por defecto.');
    },
    { timeout: 10000 }
  );
};

const loadDefaultLocation = (warningMessage = null) => {
  locationName.value = DEFAULT_COORDS.name;
  currentCoords.value = { lat: DEFAULT_COORDS.lat, lon: DEFAULT_COORDS.lon };
  if (warningMessage) {
    console.warn(warningMessage);
    // Podríamos mostrar un toast aquí en el futuro
  }
  fetchWeather(DEFAULT_COORDS.lat, DEFAULT_COORDS.lon);
};
</script>
