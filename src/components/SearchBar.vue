<template>
  <div class="relative w-full mb-6 z-50">
    <div class="relative flex items-center">
      <input 
        type="text" 
        v-model="query" 
        @input="onInput"
        @focus="isFocused = true"
        placeholder="Buscar ciudad..."
        class="w-full bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-700 rounded-full py-3 pl-12 pr-12 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
      />
      <Search class="absolute left-4 w-5 h-5 text-gray-400" />
      
      <button 
        @click="getCurrentLocation" 
        class="absolute right-4 p-1 rounded-full text-indigo-500 hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors"
        title="Usar mi ubicación"
      >
        <MapPin class="w-5 h-5" />
      </button>
    </div>

    <!-- Dropdown Results -->
    <div 
      v-if="isFocused && results.length > 0" 
      class="absolute mt-2 w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50"
    >
      <ul class="max-h-60 overflow-y-auto">
        <li 
          v-for="city in results" 
          :key="city.id"
          @click="selectCity(city)"
          class="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-50 dark:border-gray-700 last:border-0"
        >
          <div class="flex items-center">
            <MapPin class="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
            <div>
              <span class="block font-medium text-gray-800 dark:text-white">{{ city.name }}</span>
              <span class="block text-xs text-gray-500 dark:text-gray-400">
                {{ city.admin1 ? city.admin1 + ', ' : '' }}{{ city.country }}
              </span>
            </div>
          </div>
        </li>
      </ul>
    </div>
    
    <!-- Click outside overlay -->
    <div 
      v-if="isFocused && results.length > 0" 
      @click="isFocused = false"
      class="fixed inset-0 z-40 bg-black/5 dark:bg-black/20"
    ></div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { Search, MapPin } from 'lucide-vue-next';
import { weatherService } from '../services/weatherService';

const emit = defineEmits(['location-selected', 'request-geolocation']);

const query = ref('');
const results = ref([]);
const isFocused = ref(false);
let debounceTimeout = null;

const onInput = () => {
  if (debounceTimeout) clearTimeout(debounceTimeout);
  
  if (query.value.length < 2) {
    results.value = [];
    return;
  }
  
  debounceTimeout = setTimeout(async () => {
    try {
      results.value = await weatherService.searchCities(query.value);
    } catch (error) {
      console.error('Search error:', error);
      results.value = [];
    }
  }, 500);
};

const selectCity = (city) => {
  emit('location-selected', {
    name: city.name,
    latitude: city.latitude,
    longitude: city.longitude
  });
  query.value = '';
  results.value = [];
  isFocused.value = false;
};

const getCurrentLocation = () => {
  emit('request-geolocation');
  query.value = '';
  isFocused.value = false;
};
</script>
