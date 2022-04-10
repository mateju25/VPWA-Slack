<template>
  <q-page class='window-height window-width row justify-center items-center'>
    <div class='column q-mx-xl text-center'>
      <q-icon size='12em' class='mobile-hide q-mx-auto'>
        <img src='~assets/icon3.svg' />
      </q-icon>
      <q-icon size='10em' class='desktop-hide q-mx-auto'>
        <img src='~assets/icon3.svg' />
      </q-icon>
      <h4 class='text-h4 q-my-md'>
        VoidMessenger
      </h4>
      <p class='text-subtitle-2 text-italic'>Your best choice</p>
    </div>
    <div class='column q-mx-xl'>
      <div class='row'>
        <q-card square class='q-pa-md login-card'>
          <q-form class='q-gutter-md' @submit.stop='onSubmit()'>
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
                v-model='password'
                standout='bg-grey'
                square class='q-mt-lg'
                :type="isPwd ? 'password' : 'text'"
                label='Password'
                name='password'
                id='password'
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
            </q-card-section>
            <q-card-actions class='q-px-md q-mt-xs'>
              <q-btn color='primary' class='full-width q-mx-lg' label='Login' type='submit' :loading='loading' />
            </q-card-actions>
            <q-card-section class='text-center q-pa-none q-mt-sm'>
              <a class='text-grey-6 cursor-pointer underlined-text' @click="$router.replace('/auth/register')">Create an
                account</a>
            </q-card-section>
          </q-form>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script lang='ts'>
import { defineComponent } from 'vue';
import useVuelidate from '@vuelidate/core';
import { alphaNum, maxLength, minLength, required } from '@vuelidate/validators';
import { RouteLocationRaw } from 'vue-router';

export default defineComponent({
  name: 'PageLogin',
  setup() {
    return {
      v$: useVuelidate({ $autoDirty: true }),
    }
  },
  data() {
    return {
      username: 'jesse',
      password: 'password',
      isPwd: true,
    };
  },
  computed: {
    redirectTo(): RouteLocationRaw {
      return (this.$route.query.redirect as string) || { name: 'home' };
    },
    loading(): boolean {
      return this.$store.state.authStore.status === 'pending';
    },
    usernameError(): string {
      return 'Username should be between 5 and 30 alphanumeric letters';
    },
    passwordError(): string {
      return 'Password should be between 8 and 20 letters';
    }
  },
  validations() {
    return {
      username: {
        alphaNum,
        required,
        min: minLength(5),
        max: maxLength(30)
      },
      password: {
        required,
        min: minLength(8),
        max: maxLength(20)
      }
    };
  },
  methods: {
    async onSubmit() {
      const isFormCorrect = await this.v$.$validate();

      if (!isFormCorrect) {
        this.$q.notify({
          color: 'red-4',
          textColor: 'white',
          position: 'top',
          icon: 'warning',
          message: this.v$.$errors.map(e => e.$message).join()
        });
      } else {
        this.$store.dispatch('authStore/login', {
          'username': this.username,
          'password': this.password
        }).then(() => {
          this.$router.push(this.redirectTo)
        }).catch(() => {
          this.$q.notify({
            color: 'red-4',
            textColor: 'white',
            position: 'top',
            icon: 'warning',
            message: 'Invalid username or password'
          });
        });
      }
    }
  },
});

</script>

<style>
.login-card {
  width: 300px;
  height: 340px;
}

</style>
