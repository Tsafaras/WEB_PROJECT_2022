import {createApp} from "vue";
import App from "./App.vue";
import "./assets/tailwind.css";
import router from "./router";
import Popup from "./components/Popup.vue";
import ActionButton from "./components/ActionButton.vue";
import Container from './components/Container.vue'
import mitt from 'mitt';
import PageContent from "./components/PageContent.vue";
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import BarChart from './components/BarChart.vue'

const app = createApp(App);

app.config.globalProperties.emitter = mitt();
app.component('Popup', Popup)
    .component('ActionButton', ActionButton)
    .component('Container', Container)
    .component('PageContent', PageContent)
    .component('Datepicker', Datepicker)
    .component('BarChart', BarChart)

app.use(router).mount("#app");
