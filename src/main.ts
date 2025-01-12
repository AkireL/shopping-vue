import { createVuetify, type ThemeDefinition } from 'vuetify';
import 'vuetify/styles';

import { createApp } from 'vue';
import App from './App.vue';

import ShoppingListsMain from './components/ShoppingListsMain.vue';
import ShoppingList from './components/ShoppingList.vue';
import * as VueRouter from 'vue-router';

const routes = [
  { path: '/', component: ShoppingListsMain, name: "home" },
  { path: '/row/:id', component: ShoppingList, props: true, name:"item" },
];

const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes
});

const customTheme: ThemeDefinition = {
  dark: true,
  colors: {
    surface: '#212121',
    primary: '#0853a7',
    secondary: '#048377',
    error: '#B00020',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00',
    green: '#1a5e20',
  },
}

const vuetify = createVuetify({
  theme: {
    defaultTheme: isDarkMode ? 'customTheme' : "light",
    themes: {
      customTheme,
    },
  },
})

createApp(App).use(router).use(vuetify).mount('#app');
