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
        <q-card square class="q-pa-md login-card">
          <q-form class="q-gutter-md" @submit="$router.replace('/')">
            <q-card-section>
              <q-input square standout="bg-grey-10 text-white" clearable v-model="username" type="name" label="username" :input-style="{ color: 'white' }"/>
              <q-input class="q-mt-lg"  square standout="bg-grey-10 text-white" clearable v-model="password" type="password" label="password" />
            </q-card-section>
            <q-card-actions class="q-px-md q-mt-lg">
              <q-btn color="primary" class="full-width q-mx-lg" label="Login" type="submit" />
            </q-card-actions>
            <q-card-section class="text-center q-pa-none q-mt-sm">
              <a class="text-grey-6 cursor-pointer underlined-text" @click="$router.replace('/register')">Create an account</a>
            </q-card-section>
          </q-form>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'PageLogin',
  data() {
    return {
      username: '',
      password: ''
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
