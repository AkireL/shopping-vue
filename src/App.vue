<script setup lang="ts">
</script>

<template>
  <h1>Hello App!</h1>
  <p>
    <!-- use the router-link component for navigation. -->
    <!-- specify the link by passing the `to` prop. -->
    <!-- `<router-link>` will render an `<a>` tag with the correct `href` attribute -->
      <router-link to="/main">lista</router-link>
      <router-link to="/row" tag="button">lista</router-link>
  </p>
  <!-- <router-view></router-view> -->
  <RouterView v-slot="{ Component }">
  <component
    :is="Component"
    view-prop="value"
   />
</RouterView>
</template>