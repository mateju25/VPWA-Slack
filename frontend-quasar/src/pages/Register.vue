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
          <q-form class="q-gutter-md" @submit.stop="onSubmit()">
            <q-card-section>
              <q-input square standout="bg-grey-10 text-white" clearable v-model="username" type="text" label="username" :error="v$.password.$error"/>
              <q-input class="q-mt-sm" square standout="bg-grey-10 text-white" clearable v-model="fullname" type="text" label="full name" :error="v$.password.$error"/>
              <q-input class="q-mt-sm" square standout="bg-grey-10 text-white" clearable v-model="email" type="email" label="email" :error="v$.password.$error"/>
              <q-input class="q-mt-sm" square standout="bg-grey-10 text-white" clearable v-model="password" type="password" label="password" :error="v$.password.$error"/>
              <q-input class="q-mt-sm" square standout="bg-grey-10 text-white" clearable v-model="repeatpassword" type="password" label="repeat password" :error="v$.password.$error"/>

              <p class="q-ma-none">
                {{ message }}
              </p>
            </q-card-section>
            <q-card-actions class="q-px-md q-mt-none">
              <q-btn color="primary" class="full-width" label="Create account" type="submit" :loading='loading'/>
            </q-card-actions>
          </q-form>
          <q-card-section class="text-center q-pa-none q-mt-sm">
            <a class="text-grey-6 cursor-pointer underlined-text" @click="$router.replace('/auth/login')">
              Back to login
            </a>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import useVuelidate from '@vuelidate/core'
import { required, minLength, email, sameAs } from '@vuelidate/validators'
import { RouteLocationRaw } from 'vue-router';

export default defineComponent({
  name: 'PageLogin',
  setup(){
    return {
      v$: useVuelidate({ $autoDirty: true })
    }
  },
  data () {
    return {
      email: '',
      password: '',
      username: '',
      fullname: '',
      repeatpassword: '',

      message:''
    }
  },
  validations(){
    return{
      email:{
        required,
        email
      },
      password:{
        required,
        minLength: minLength(8),
      },
      username:{
        required
      },
      fullname:{
        required
      },
      repeatpassword:{
        required,
        sameAsPassword: sameAs(this.password),
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
        this.$store.dispatch('auth/register', {'email': this.email,'username': this.username,'fullname': this.fullname,'password': this.password,'passwordConfirmation': this.repeatpassword}).then(() => this.$router.push(this.redirectTo))
      }
    },
  },
  computed:{
    redirectTo (): RouteLocationRaw {
      return { name: 'login' }
    },
    loading (): boolean {
      return this.$store.state.auth.status === 'pending'
    }
  },
  watch:{
    username(){
      this.message='';
    },
    password(){
      this.message='';
    },
    email(){
      this.message='';
    },
    fullname(){
      this.message='';
    },
    repeatpassword(){
      this.message='';
    }
  }
})
</script>

<style>
.register-card {
  width: 300px;
  height: 580px
}
</style>
