<template>
  <div>
    <q-dialog v-model='dialogOpen'>
      <UserInfoDialogContent v-bind:selectedContact='selectedContact' v-bind:inHeader='false' />
    </q-dialog>

    <q-item
      v-for='contact in contacts'
      :key='contact.id'
      class='q-my-sm cursor-pointer q-hoverable'
      clickable
      @click='changeDialogOpen(contact)'
      v-ripple
    >
      <q-item-section avatar>
        <Avatar v-bind:contact='contact' v-bind:inHeader='false' />
      </q-item-section>

      <q-item-section>
        <q-item-label>{{ contact.nickname }}</q-item-label>
      </q-item-section>

    </q-item>
  </div>
</template>

<script lang='ts'>

import { defineComponent, PropType } from 'vue';
import Avatar from 'components/Avatar.vue';
import UserInfoDialogContent from 'components/UserInfoDialogContent.vue';
import { User } from 'components/models';

export default defineComponent({
  components: { UserInfoDialogContent, Avatar },
  // type inference enabled
  data() {
    return {
      dialogOpen: false,
      selectedContact: User
    };
  },
  props: {
    contacts: Array as PropType<Array<User>>
  },
  methods: {
    changeDialogOpen(contact: typeof User) {
      if (!this.dialogOpen) {
        this.selectedContact = contact;
      }
      this.dialogOpen = !this.dialogOpen;
    }
  }

});

</script>

<style>

</style>
