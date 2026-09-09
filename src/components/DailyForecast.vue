<template>
  <div class="daily-forecast bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg mb-6 transition-colors duration-300">
    <h3 class="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center">
      <CalendarDays class="w-5 h-5 mr-2 text-indigo-500" />
      Próximos 7 días
    </h3>
    
    <div class="flex flex-col space-y-4">
      <div 
        v-for="(day, index) in forecastDays" 
        :key="index"
        class="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-4 last:border-0 last:pb-0"
      >
        <!-- Day Name -->
        <div class="w-1/4">
          <span class="text-base font-semibold text-gray-800 dark:text-gray-200 capitalize">
            {{ index === 0 ? 'Hoy' : formatDay(day.time) }}
          </span>
        </div>
        
        <!-- Icon & Precipitation -->
        <div class="w-2/4 flex items-center justify-center">
          <WeatherIcon 
            :code="day.weather_code" 
            :isDay="true" 
            size="sm"
            class="mr-2"
          />
          <div class="flex items-center w-12" v-if="day.precipitation_probability_max > 0">
            <CloudRain class="w-3 h-3 text-blue-400 mr-1" />
            <span class="text-xs text-blue-500 font-medium">{{ day.precipitation_probability_max }}%</span>
          </div>
          <div class="w-12" v-else></div>
        </div>
        
        <!-- Temperatures (Min/Max) -->
        <div class="w-1/4 flex justify-end space-x-3">
          <span class="text-base font-medium text-gray-500 dark:text-gray-400">
            {{ Math.round(day.temperature_2m_min) }}°
          </span>
          <span class="text-base font-bold text-gray-800 dark:text-white">
            {{ Math.round(day.temperature_2m_max) }}°
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { format, isToday } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarDays, CloudRain } from 'lucide-vue-next';
import WeatherIcon from './WeatherIcon.vue';

const props = defineProps({
  dailyData: {
    type: Object,
    required: true
  }
});

const forecastDays = computed(() => {
  if (!props.dailyData || !props.dailyData.time) return [];
  
  const days = [];
  // Typically open-meteo returns 7 days
  for (let i = 0; i < props.dailyData.time.length && i < 7; i++) {
    days.push({
      time: props.dailyData.time[i],
      temperature_2m_max: props.dailyData.temperature_2m_max[i],
      temperature_2m_min: props.dailyData.temperature_2m_min[i],
      precipitation_probability_max: props.dailyData.precipitation_probability_max[i],
      weather_code: props.dailyData.weather_code[i]
    });
  }
  
  return days;
});

const formatDay = (timeString) => {
  const date = new Date(timeString + 'T12:00:00'); // Prevent timezone shifts
  return format(date, 'EEEE', { locale: es });
};
</script>
