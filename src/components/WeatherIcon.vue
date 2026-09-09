<template>
  <div class="weather-icon-container flex justify-center items-center">
    <!-- Componente dinámico de Lucide -->
    <component 
      :is="iconComponent.component" 
      :class="[
        'transition-colors duration-300', 
        sizeClass, 
        iconComponent.color
      ]" 
      :stroke-width="1.5"
      :aria-label="description"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { 
  Sun, 
  Moon, 
  Cloud, 
  CloudSun, 
  CloudMoon, 
  CloudRain, 
  CloudDrizzle, 
  CloudLightning, 
  CloudSnow,
  CloudFog,
  Snowflake
} from 'lucide-vue-next';

const props = defineProps({
  code: {
    type: Number,
    required: true
  },
  isDay: {
    type: Boolean,
    default: true
  },
  description: {
    type: String,
    default: 'Weather Icon'
  },
  size: {
    type: String,
    default: 'md' // sm, md, lg, xl
  }
});

const sizeClass = computed(() => {
  const sizes = {
    'sm': 'w-8 h-8',
    'md': 'w-16 h-16',
    'lg': 'w-24 h-24',
    'xl': 'w-32 h-32'
  };
  return sizes[props.size] || sizes.md;
});

const iconComponent = computed(() => {
  const code = props.code;
  const isDay = props.isDay;
  
  // Mapeo de códigos WMO (Open-Meteo) a iconos de Lucide y sus colores
  
  // Despejado (Clear sky)
  if (code === 0) {
    return isDay 
      ? { component: Sun, color: 'text-yellow-400 drop-shadow-md' }
      : { component: Moon, color: 'text-indigo-300 drop-shadow-md' };
  }
  
  // Mayormente despejado a parcialmente nublado (Mainly clear, partly cloudy)
  if (code === 1 || code === 2) {
    return isDay 
      ? { component: CloudSun, color: 'text-yellow-400 dark:text-yellow-300 drop-shadow-md' }
      : { component: CloudMoon, color: 'text-indigo-400 dark:text-indigo-300 drop-shadow-md' };
  }
  
  // Nublado (Overcast)
  if (code === 3) {
    return { component: Cloud, color: 'text-gray-400 dark:text-gray-400 drop-shadow-md' };
  }
  
  // Niebla (Fog)
  if (code === 45 || code === 48) {
    return { component: CloudFog, color: 'text-gray-400 dark:text-gray-500' };
  }
  
  // Llovizna (Drizzle)
  if (code === 51 || code === 53 || code === 55 || code === 56 || code === 57) {
    return { component: CloudDrizzle, color: 'text-blue-400 dark:text-blue-300' };
  }
  
  // Lluvia (Rain)
  if (code === 61 || code === 63 || code === 65 || code === 66 || code === 67 || code === 80 || code === 81 || code === 82) {
    return { component: CloudRain, color: 'text-blue-500 dark:text-blue-400 drop-shadow-md' };
  }
  
  // Nieve (Snow)
  if (code === 71 || code === 73 || code === 75 || code === 77 || code === 85 || code === 86) {
    return { component: CloudSnow, color: 'text-blue-200 dark:text-white drop-shadow-md' };
  }
  
  // Tormenta (Thunderstorm)
  if (code === 95 || code === 96 || code === 99) {
    return { component: CloudLightning, color: 'text-purple-500 dark:text-purple-400 drop-shadow-md' };
  }
  
  // Default fallback
  return isDay 
    ? { component: Sun, color: 'text-yellow-400' }
    : { component: Moon, color: 'text-indigo-300' };
});
</script>
