<template>
  <q-page class="window-height window-width row justify-center items-center">
    <div class="column q-mx-md text-center">
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
    <div class="column q-mx-md">
      <div class="row">
        <q-card square class="q-pa-md login-card">
          <q-form class="q-gutter-md" @submit="$router.replace('/')">
            <q-card-section>
              <q-input square filled clearable v-model="username" type="email" label="username" />
              <q-input class="q-mt-lg"  square filled clearable v-model="password" type="password" label="password" />
            </q-card-section>
            <q-card-actions class="q-px-md q-mt-lg">
              <q-btn color="primary" class="full-width q-mx-lg" label="Login" type="submit" />
            </q-card-actions>
            <q-card-section class="text-center q-pa-none q-mt-sm">
              <a class="text-grey-6 cursor-pointer" @click="$router.replace('/register')">Create an account</a>
            </q-card-section>
          </q-form>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'PageLogin',
  setup() {
    const username = ref('');
    const password = ref('');

    return {
      username,
      password
    }
  }
};
</script>

<style>
.login-card {
  width: 300px;
  height: 310px
}

</style>
