import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'
import { reveal } from './directives/reveal'
import { parallax } from './directives/parallax'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.directive('reveal', reveal)
app.directive('parallax', parallax)
app.mount('#app')
