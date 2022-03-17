<template>
  <div class='q-pa-sm q-gutter-md'>

    <div class="q-ma-lg text-h6"># {{activeChannel.name}}</div>
    <q-separator />

    <q-list>
      <q-item-label header v-if='owners.length > 0'>Owners</q-item-label>
      <UserContactListItem
        :contacts="owners"
      />

      <q-item-label header  v-if='users.length > 0'>Users</q-item-label>
      <UserContactListItem
        :contacts="users"
      />
    </q-list>

  </div>
</template>

<script lang="ts">

import { defineComponent, PropType } from 'vue';
import UserContactListItem from 'src/components/UserContactListItem.vue';
import { Channel, RelationUserChannel, User } from './models';

export default defineComponent({
  // type inference enabled
  components: {
    UserContactListItem
  },
  props: {
    contacts: {
      type: Array as PropType<Array < RelationUserChannel >>,
      required: true
    },
    activeChannel: {
      type: Object as PropType<Channel>,
      required: true
    }
  },
  computed: {
    owners: function(): User[] {
      let owners: User[] = [];
      this.contacts.filter(item => item.relation.id == 1).forEach(item => owners.push(item.user));
      return owners;
    },
    users: function(): User[] {
      let users: User[] = [];
      this.contacts.filter(item => item.relation.id == 2).forEach(item => users.push(item.user));
      return users;
    }
  }
})

</script>
