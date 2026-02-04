// main.js
import { createApp } from 'vue'
import App from './App.vue'
import { Quasar, Dialog, Notify, Screen, LocalStorage, SessionStorage } from 'quasar'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'
import './style.css'
import router from "./routes/routes.js"

const myApp = createApp(App)

myApp.use(Quasar, {
  plugins: {
    Dialog,
    Notify,
    Screen,
    LocalStorage,
    SessionStorage
  },
})

myApp.use(router)

myApp.mount('#app')
