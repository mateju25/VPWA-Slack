<template>
  <q-page class="window-height window-width row justify-center items-center">
    <div class="column">
      <div class="row">
        <q-card square class="q-pa-md register-card">
          <q-form class="q-gutter-md">
            <q-card-section>
              <q-input square filled clearable v-model="username" type="text" label="username" />
              <q-input class="q-mt-lg" square filled clearable v-model="fullname" type="text" label="full name" />
              <q-input class="q-mt-lg" square filled clearable v-model="email" type="email" label="email" />
              <q-input class="q-mt-lg" square filled clearable v-model="password" type="password" label="password" />
              <q-input class="q-mt-lg" square filled clearable v-model="repeatpassword" type="password" label="repeat password" />

            </q-card-section>
            <q-card-actions class="q-px-md q-mt-sm">
              <q-btn color="primary" class="full-width" label="Create account" type="submit"/>
            </q-card-actions>
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
  height: 500px
}
</style>
