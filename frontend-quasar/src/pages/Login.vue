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
          <q-form class="q-gutter-md" @submit.stop="onSubmit()">
            <q-card-section>
              <q-input
                square
                standout="bg-grey-10 text-white"
                clearable
                v-model="username"
                type="name"
                label="username"
                :input-style="{ color: 'white' }"
                :error="v$.username.$error"
              />
              <q-input
                class="q-mt-lg"
                square
                standout="bg-grey-10 text-white"
                clearable
                v-model="password"
                type="password"
                label="password"
                :error="v$.password.$error"
              />
              <p>
                {{ message }}
              </p>
            </q-card-section>
            <q-card-actions class="q-px-md q-mt-xs">
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

<script lang="ts">
import { User } from 'src/components/models';
import { defineComponent } from 'vue';
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'

export default defineComponent({
  name: 'PageLogin',
  setup(){
    return {
      v$: useVuelidate({ $autoDirty: true })
    }
  },
  data() {
    return {
      username: 'tmp',
      password: 'tmp',
      message:''
    }
  },
  validations(){
    return{
      username:{
        required
      },
      password:{
        required
      },
    }
  },
  methods:{
    async onSubmit(){
      const isFormCorrect = await this.v$.$validate()

      if (!isFormCorrect) {
        this.$q.notify({
          color: 'red-4',
          textColor: 'white',
          icon: 'warning',
          message: this.v$.$errors.map(e => e.$message).join()
        })
      }else{
        this.validateUser();
      }
    },
    validateUser(){
      // toto druhe asi zatial unsafe
      let users: User[] = this.$store.state.chatModule.users as User[];
      // let user = users.find((x) =>
      //                       x.nickname === this.username
      //                       // &&
      //                       // x.password === this.password
      //                     );
      let user = users[0];
      if(user){
        void this.$store.dispatch('chatModule/updateLoggedUserState', user);
        void this.$router.replace('/');
      }
      else{
        this.message = 'Invalid username or password'
      }
    }
  },
  watch:{
    username(){
      this.message='';
    },
    password(){
      this.message='';
    }
  }
});

</script>

<style>
.login-card {
  width: 300px;
  height: 340px;
}

</style>
