<template>
  <router-view />
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { useQuasar } from 'quasar'
import { User } from './components/models';

export default defineComponent({
  name: 'App',

  setup() {
    const $q = useQuasar()
    // calling here; equivalent to when component is created
    $q.dark.set(true)
  },

  data() {
    let users: User[] = [];
    users.push(new User(1, 'Jesse', 'Jesse Jones', 'Jesse@Jones.com', 'Online'));
    users.push(new User(2, 'John', 'John Jones', 'John@Jones.com', 'Online'));
    users.push(new User(3, 'Clarence', 'Clarence Jones', 'Clarence@Jones.com', 'DND'));
    users.push(new User(4, 'Tina', 'Tina Jones', 'Tina@Jones.com', 'Offline'));
    users.push(new User(5, 'Anne', 'Anne Jones', 'Anne@Jones.com', 'Offline'));
    void this.$store.dispatch('chatModule/updateAllUsersState', users);

    let loggedUser = localStorage.getItem('loggedUser');
    if(loggedUser){
      void this.$store.dispatch('chatModule/updateLoggedUserState', JSON.parse(loggedUser));
    }

    return{
      users
    }
  }
});
</script>
