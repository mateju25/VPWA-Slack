<template>
  <div>

    <div class="q-ma-md text-h6"># {{activeChannel.name}}</div>
    <q-separator />

    <q-list>
      <q-item-label header>Owner</q-item-label>
      <UserContactListItem
        :contacts="owners"
      />

      <q-item-label header>Users</q-item-label>
      <UserContactListItem
        :contacts="contacts"
      />
    </q-list>

  </div>
</template>

<script lang="ts">

import { defineComponent, PropType } from 'vue';
import UserContactListItem from 'src/components/UserContactListItem.vue';
import { Channel, User } from './models';

export default defineComponent({
  // type inference enabled
  components: {
    UserContactListItem
  },
  props: {
    contacts: Array as PropType<Array<User>>,
    activeChannel: Object as PropType<Channel>
  },
  data() {
    let owners: User[] = [(this.contacts as Array<User>)[0]];
    return {
      owners: owners
    }
  },
})

</script>
