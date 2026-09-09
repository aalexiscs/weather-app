<template>
  <div v-if="needRefresh" class="fixed bottom-4 right-4 left-4 md:left-auto md:w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-4 z-50 transform transition-all duration-300 ease-in-out flex flex-col gap-3">
    <div class="flex items-start gap-3">
      <div class="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 2v6h-6"></path>
          <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
          <path d="M3 22v-6h6"></path>
          <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
        </svg>
      </div>
      <div>
        <h4 class="text-sm font-semibold text-gray-900 dark:text-white">¡Nueva versión disponible!</h4>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Toca el botón para actualizar a la última versión y disfrutar de las mejoras.
        </p>
      </div>
    </div>
    
    <div class="flex gap-2 w-full mt-1">
      <button 
        @click="close" 
        class="flex-1 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
      >
        Cerrar
      </button>
      <button 
        @click="updateServiceWorker()" 
        class="flex-1 px-3 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-lg transition-colors"
      >
        Actualizar app
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRegisterSW } from 'virtual:pwa-register/vue'

const {
  offlineReady,
  needRefresh,
  updateServiceWorker,
} = useRegisterSW()

const close = async () => {
  offlineReady.value = false
  needRefresh.value = false
}
</script>