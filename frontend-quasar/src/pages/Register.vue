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
              <q-input
                square
                standout='bg-grey'
                name='username'
                id='username'
                v-model='username'
                type='text'
                label='Username'
                :error='v$.username.$error'
                :error-message="usernameError"
              />
              <q-input
                class="q-mt-md"
                square
                standout='bg-grey'
                name='fullname'
                id='fullname'
                v-model='fullname'
                type='text'
                label='Full name'
                :error='v$.fullname.$error'
                :error-message="fullnameError"
              />
              <q-input
                class="q-mt-md"
                square
                standout='bg-grey'
                name='email'
                id='email'
                v-model='email'
                type='email'
                label='Email'
                :error='v$.email.$error'
                :error-message="emailError"
              />
              <q-input
                class="q-mt-md"
                square
                standout='bg-grey'
                name='password'
                id='password'
                v-model='password'
                :type="isPwd ? 'password' : 'text'"
                label='Password'
                :error='v$.password.$error'
                :error-message="passwordError"
              >
                <template v-slot:append>
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class='cursor-pointer'
                    @click='isPwd = !isPwd'
                  />
                </template>
              </q-input>
              <q-input
                class="q-mt-md"
                square
                standout='bg-grey'
                name='passwordConfirm'
                id='passwordConfirm'
                v-model='passwordConfirm'
                type='password'
                label='Confirm password'
                :error='v$.passwordConfirm.$error'
                :error-message="passwordConfirmError"
              />
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
import { required, minLength, email, sameAs, maxLength, alphaNum} from '@vuelidate/validators';
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
      passwordConfirm: '',
      isPwd: true,
    }
  },
  validations(){
    return{
      email:{
        required,
        email
      },
      password: {
        required,
        min: minLength(8),
        max: maxLength(20)
      },
      username:{
        required,
        alphaNum,
        min: minLength(5),
        max: maxLength(30)
      },
      fullname:{
        required,
        min: minLength(5),
        max: maxLength(50)
      },
      passwordConfirm:{
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
        this.$store.dispatch('auth/register',
          {'email': this.email,
            'username': this.username,
            'fullname': this.fullname,
            'password': this.password,
            'passwordConfirmation': this.passwordConfirm})
          .then(() => this.$router.push(this.redirectTo)).catch(() => {
          this.$q.notify({
            color: 'red-4',
            textColor: 'white',
            icon: 'warning',
            message: 'User with same username or email already exists'
          })
        })
      }
    },
  },
  computed:{
    redirectTo (): RouteLocationRaw {
      return { name: 'login' }
    },
    loading (): boolean {
      return this.$store.state.auth.status === 'pending'
    },
    usernameError(): string {
      return 'Username should be between 5 and 30 alphanumeric letters';
    },
    fullnameError(): string {
      return 'Full name should be between 5 and 50 letters';
    },
    passwordError(): string {
      return 'Password should be between 8 and 20 letters';
    },
    emailError(): string {
      return 'Email should have a valid format';
    },
    passwordConfirmError(): string {
      return 'Passwords do not match';
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
