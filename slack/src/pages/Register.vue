<template>
  <q-page class="window-height window-width row justify-center items-center">
    <div class="column q-mx-xl text-center">
      <q-icon size="12em" class="mobile-hide q-mx-auto">
        <img src="~assets/icon3.svg" />
      </q-icon>
      <q-icon size="10em" class="desktop-hide q-mx-auto">
        <img src="~assets/icon3.svg" />
      </q-icon>
      <h4 class="text-h4 q-my-md">
          VoidMessenger
      </h4>
      <p class="text-subtitle-2 text-italic">Your best choice</p>
    </div>
    <div class="column q-mx-xl">
      <div class="row">
        <q-card square class="q-pa-md register-card" >
          <q-form class="q-gutter-md" @submit="$router.replace('/login')">
            <q-card-section>
              <q-input square standout="bg-grey-10 text-white" clearable v-model="username" type="text" label="username" />
              <q-input class="q-mt-lg" square standout="bg-grey-10 text-white" clearable v-model="fullname" type="text" label="full name" />
              <q-input class="q-mt-lg" square standout="bg-grey-10 text-white" clearable v-model="email" type="email" label="email" />
              <q-input class="q-mt-lg" square standout="bg-grey-10 text-white" clearable v-model="password" type="password" label="password" />
              <q-input class="q-mt-lg" square standout="bg-grey-10 text-white" clearable v-model="repeatpassword" type="password" label="repeat password" />

            </q-card-section>
            <q-card-actions class="q-px-md q-mt-sm">
              <q-btn color="primary" class="full-width" label="Create account" type="submit"/>
            </q-card-actions>
          </q-form>
          <q-card-section class="text-center q-pa-none q-mt-sm">
            <a class="text-grey-6 cursor-pointer underlined-text" @click="$router.replace('/login')">
              Back to login
            </a>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'PageLogin',
  setup () {
    const email = ref('');
    const password = ref('');
    const username = ref('');
    const fullname = ref('');
    const repeatpassword = ref('');

    return {
      email,
      password,
      username,
      fullname,
      repeatpassword
    };
  }
}
</script>

<style>
.register-card {
  width: 300px;
  height: 530px
}
</style>
