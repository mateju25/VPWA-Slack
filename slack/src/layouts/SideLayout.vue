<template>
  <q-layout view="hHh lpR fFf">

    <q-page-container>
      <router-view class='background'/>
    </q-page-container>

  </q-layout>
</template>

<script>
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'SideLayout',
})
</script>

<style>
.background {
  background-image: url('~assets/loginBackground.png');
}
</style>
