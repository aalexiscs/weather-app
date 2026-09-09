<template>
  <div class="weather-icon-container flex justify-center items-center">
    <img :src="iconUrl" :class="[sizeClass]" :alt="description || 'Icono del clima'" loading="lazy" />
  </div>
</template>

<script setup>
import { computed } from 'vue';

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
    'sm': 'w-10 h-10',
    'md': 'w-20 h-20',
    'lg': 'w-32 h-32',
    'xl': 'w-48 h-48'
  };
  return sizes[props.size] || sizes.md;
});

const iconUrl = computed(() => {
  let meteoconName = 'not-available';
  const basePath = import.meta.env.BASE_URL || '/';

  if (props.code === 0) {
    meteoconName = props.isDay ? 'clear-day' : 'clear-night';
  } else if (props.code === 1 || props.code === 2) {
    meteoconName = props.isDay ? 'partly-cloudy-day' : 'partly-cloudy-night';
  } else if (props.code === 3) {
    meteoconName = 'cloudy';
  } else if ([45, 48].includes(props.code)) {
    meteoconName = props.isDay ? 'fog-day' : 'fog-night';
  } else if ([51, 53, 55, 56, 57].includes(props.code)) {
    meteoconName = props.isDay ? 'partly-cloudy-day-drizzle' : 'partly-cloudy-night-drizzle';
  } else if ([61, 63, 65, 66, 67].includes(props.code)) {
    meteoconName = props.isDay ? 'partly-cloudy-day-rain' : 'partly-cloudy-night-rain';
  } else if ([71, 73, 75, 77].includes(props.code)) {
    meteoconName = props.isDay ? 'partly-cloudy-day-snow' : 'partly-cloudy-night-snow';
  } else if ([80, 81, 82].includes(props.code)) {
    meteoconName = 'extreme-rain';
  } else if ([85, 86].includes(props.code)) {
    meteoconName = 'extreme-snow';
  } else if ([95, 96, 99].includes(props.code)) {
    meteoconName = props.isDay ? 'thunderstorms-day' : 'thunderstorms-night';
  }

  return `${basePath}meteocons/${meteoconName}.svg`;
});
</script>
