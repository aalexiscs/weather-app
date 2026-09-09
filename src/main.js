import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

// Detectar y aplicar modo oscuro por defecto si el sistema lo prefiere
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  document.documentElement.classList.add('dark')
}

createApp(App).mount('#app')
