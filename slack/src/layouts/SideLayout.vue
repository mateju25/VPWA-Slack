<template>
  <q-layout view="hHh lpR fFf">

    <q-page-container>
      <router-view :class="Dark.isActive ? 'background-dark' : 'background-white'" />
    </q-page-container>

  </q-layout>
</template>

<script>
import { defineComponent } from 'vue';
import { Dark } from 'quasar';

export default defineComponent({
  name: 'SideLayout',
  data() {
    return {
      Dark: Dark
    }
  }
})
</script>

<style>
.background-dark {
  background-image: url('~assets/loginBackgroundDark.png');
}
.background-white {
  background-image: url('~assets/loginBackgroundWhite.png');
}
</style>
