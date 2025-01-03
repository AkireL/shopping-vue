<script setup lang="ts">
</script>

<template>
  <h1>Hello App!</h1>
  <p>
    <!-- use the router-link component for navigation. -->
    <!-- specify the link by passing the `to` prop. -->
    <!-- `<router-link>` will render an `<a>` tag with the correct `href` attribute -->
      <router-link to="/main">Main</router-link>
      <br>
      <router-link to="/about">About</router-link>
      <br>
      <router-link to="/row/1">Row</router-link>
  </p>
  <!-- <router-view></router-view> -->
  <router-view></router-view>
</template>