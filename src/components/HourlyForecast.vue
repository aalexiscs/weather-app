<template>
  <div class="hourly-forecast bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg mb-6 transition-colors duration-300">
    <h3 class="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center">
      <Clock class="w-5 h-5 mr-2 text-indigo-500" />
      Próximas 24 horas
    </h3>
    
    <div class="flex overflow-x-auto pb-4 pt-2 hide-scrollbar snap-x">
      <div 
        v-for="(hour, index) in next24Hours" 
        :key="index"
        class="flex flex-col items-center min-w-[80px] snap-center"
      >
        <span class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
          {{ index === 0 ? 'Ahora' : formatHour(hour.time) }}
        </span>
        
        <WeatherIcon 
          :code="hour.weather_code" 
          :isDay="hour.is_day === 1" 
          size="sm"
          class="my-1"
        />
        
        <span class="text-lg font-bold text-gray-800 dark:text-white mt-2">
          {{ Math.round(hour.temperature_2m) }}°
        </span>
        
        <div class="flex items-center mt-1" v-if="hour.precipitation_probability > 0">
          <CloudRain class="w-3 h-3 text-blue-400 mr-1" />
          <span class="text-xs text-blue-500 font-medium">{{ hour.precipitation_probability }}%</span>
        </div>
        <div class="h-4 mt-1" v-else></div> <!-- Spacer to keep alignment -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { format } from 'date-fns';
import { Clock, CloudRain } from 'lucide-vue-next';
import WeatherIcon from './WeatherIcon.vue';

const props = defineProps({
  hourlyData: {
    type: Object,
    required: true
  }
});

const next24Hours = computed(() => {
  if (!props.hourlyData || !props.hourlyData.time) return [];
  
  // Find current hour index
  const now = new Date();
  const currentHourString = now.toISOString().slice(0, 14) + '00'; // Match YYYY-MM-DDTHH:00 format mostly
  
  // A simpler approach: find the first time that is in the future or within the last hour
  let currentIndex = props.hourlyData.time.findIndex(timeStr => {
    return new Date(timeStr).getTime() >= now.getTime() - 3600000;
  });
  
  if (currentIndex === -1) currentIndex = 0;
  
  const hours = [];
  // Get next 24 hours
  for (let i = 0; i < 24; i++) {
    const idx = currentIndex + i;
    if (idx < props.hourlyData.time.length) {
      hours.push({
        time: props.hourlyData.time[idx],
        temperature_2m: props.hourlyData.temperature_2m[idx],
        precipitation_probability: props.hourlyData.precipitation_probability[idx],
        weather_code: props.hourlyData.weather_code[idx],
        is_day: props.hourlyData.is_day[idx]
      });
    }
  }
  
  return hours;
});

const formatHour = (timeString) => {
  // 'h:mm a' formatea la hora en 12 horas con AM/PM (ej: 2:00 PM)
  return format(new Date(timeString), 'h:mm a');
};
</script>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
