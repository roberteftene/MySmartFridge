import { createApp } from 'vue'
import App from './App.vue'
import { Quasar } from 'quasar'
import quasarUserOptions from './quasar-user-options'
import router from "./router"
import PrimeVue from 'primevue/config';
import "primeicons/primeicons.css";
import "primevue/resources/themes/md-light-indigo/theme.css";
import "primevue/resources/primevue.min.css";

createApp(App).use(Quasar, quasarUserOptions).use(router).use(PrimeVue).mount('#app')
