// import './assets/main.css'

import { createVuetify } from 'vuetify'
import 'vuetify/styles'

import { createApp } from 'vue'
import App from './App.vue'

import HelloWorld from './components/HelloWorld.vue'
import ListMain from './components/ListMain.vue'
import ShoppingList from './components/ShoppingList.vue'

// import VueRouter from 'vue-router'
import * as VueRouter from 'vue-router';


const routes = [
    { "path": '/main', "component": ListMain},
    { "path": '/about', "component": HelloWorld},
    { "path": '/row/:id', "component": ShoppingList, "props": true},
]

const router = VueRouter.createRouter({
    // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
    history: VueRouter.createWebHashHistory(),
    routes, // short for `routes: routes`
})
  
const vuetify = createVuetify(
    {
        icons: {
            defaultSet: 'mdi',
        },
    },
);

createApp(App)
    .use(router)
    .use(vuetify)
    .mount('#app')
