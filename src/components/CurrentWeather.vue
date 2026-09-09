<template>
  <div class="current-weather bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg mb-6 transition-colors duration-300 relative overflow-hidden">
    <div class="relative z-10 flex flex-col items-center">
      <!-- City & Date -->
      <h2 class="text-3xl font-bold text-gray-800 dark:text-white mb-1 tracking-tight">{{ location }}</h2>
      <p class="text-sm text-gray-500 dark:text-gray-400 font-medium mb-4">{{ currentDate }}</p>

      <!-- Main Icon -->
      <WeatherIcon 
        :code="weather.weather_code" 
        :isDay="weather.is_day === 1" 
        :description="weatherDescription"
        size="xl"
        class="my-2"
      />

      <!-- Temperature & Condition -->
      <div class="text-center mt-2">
        <h1 class="text-6xl font-black text-gray-800 dark:text-white tracking-tighter">
          {{ Math.round(weather.temperature_2m) }}°
        </h1>
        <p class="text-xl font-medium text-gray-600 dark:text-gray-300 mt-1 capitalize">
          {{ weatherDescription }}
        </p>
      </div>

      <!-- Quick Stats -->
      <div class="w-full grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
        <div class="flex flex-col items-center">
          <Droplets class="w-6 h-6 text-blue-500 mb-2" />
          <span class="text-sm font-semibold text-gray-700 dark:text-gray-200">{{ weather.relative_humidity_2m }}%</span>
          <span class="text-xs text-gray-500 dark:text-gray-400">Humedad</span>
        </div>
        
        <div class="flex flex-col items-center">
          <Wind class="w-6 h-6 text-teal-500 mb-2" />
          <span class="text-sm font-semibold text-gray-700 dark:text-gray-200">{{ Math.round(weather.wind_speed_10m) }} km/h</span>
          <span class="text-xs text-gray-500 dark:text-gray-400">Viento</span>
        </div>
        
        <div class="flex flex-col items-center">
          <Thermometer class="w-6 h-6 text-red-500 mb-2" />
          <span class="text-sm font-semibold text-gray-700 dark:text-gray-200">{{ Math.round(weather.apparent_temperature) }}°</span>
          <span class="text-xs text-gray-500 dark:text-gray-400">Sensación</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Droplets, Wind, Thermometer } from 'lucide-vue-next';
import WeatherIcon from './WeatherIcon.vue';
import { getWeatherDescription } from '../utils/weatherCodes';

const props = defineProps({
  weather: {
    type: Object,
    required: true
  },
  location: {
    type: String,
    required: true
  }
});

const currentDate = computed(() => {
  return format(new Date(), "EEEE, d 'de' MMMM", { locale: es });
});

const weatherDescription = computed(() => {
  return getWeatherDescription(props.weather.weather_code);
});
</script>
