import { createVuetify } from 'vuetify';
import 'vuetify/styles';

import { createApp } from 'vue';
import App from './App.vue';

import ShoppingListsMain from './components/ShoppingListsMain.vue';
import ShoppingList from './components/ShoppingList.vue';
import * as VueRouter from 'vue-router';

const routes = [
  { path: '/', component: ShoppingListsMain },
  { path: '/row/:id', component: ShoppingList, props: true, name:"item" },
];

const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes
});

const vuetify = createVuetify({
  icons: {
    defaultSet: 'mdi'
  }
});

createApp(App).use(router).use(vuetify).mount('#app');
