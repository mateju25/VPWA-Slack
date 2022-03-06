<template>
  <div>
    
    <div class="q-ma-md text-h6"># Channel</div>
    <q-separator />

    <q-list>      
      <q-item-label header>Owner</q-item-label>
      <UserContactListItem
        :contacts="owner"
      />

      <q-item-label header>Users</q-item-label>
      <UserContactListItem
        :contacts="contacts"
      />
    </q-list>

  </div>
</template>

<script lang="ts">

import { defineComponent } from 'vue'
import UserContactListItem from 'src/components/UserContactListItem.vue';

export default defineComponent({
  // type inference enabled
  components: {
    UserContactListItem
  },

  data() {
    return {
      owner: [
        { 'id': 1, 'nick_name': 'Jesse', 'state': 'Online' },
      ],

      contacts: [
        { 'id': 2, 'nick_name': 'John', 'state': 'Online' },
        { 'id': 4, 'nick_name': 'Clarence', 'state': 'DND' },
        { 'id': 3, 'nick_name': 'Tina', 'state': 'Offline' },
        { 'id': 5, 'nick_name': 'Anne', 'state': 'Offline' },
      ]
    }
  },

  // computed: {
  //   onlineContacts(){
  //     return this.contacts.filter(x => x.state == 'Online');
  //   }
  // },
  
})

</script>