<template>
  <div>
    <q-dialog v-model="dialogOpen" auto-close="auto-close">
      <q-card  class="dialog">
        <q-card-section class="row items-center q-pb-none">
          <Avatar v-bind:contact="selectedContact"/>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-list>
              <q-item>
                <q-item-section>
                  <q-item-label>Nickname:</q-item-label>
                </q-item-section>

                <q-item-section>
                  <q-item-label>{{ selectedContact.nick_name }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label>Full name:</q-item-label>
                </q-item-section>

                <q-item-section>
                  <q-item-label>{{ selectedContact.fullName }}</q-item-label>
                </q-item-section>
              </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-item
      v-for="contact in contacts"
      :key="contact.id"
      class="q-my-sm cursor-pointer q-hoverable"
      clickable
      @click="changeDialogOpen(contact)"
      v-ripple
    >
      <Avatar v-bind:contact="contact"  v-bind:inHeader="false"/>

      <q-item-section>
        <q-item-label>{{ contact.nick_name }}</q-item-label>
      </q-item-section>

    </q-item>
  </div>
</template>

<script lang="ts">

import { defineComponent } from 'vue';
import Avatar from 'components/Avatar.vue';

export default defineComponent({
  components: { Avatar },
  // type inference enabled
  data() {
    return {
      dialogOpen: false,
      selectedContact: {}
    };
  },
  props: {
    contacts: Object
  },
  methods: {
    changeDialogOpen(contact: object) {
      if (!this.dialogOpen) {
        this.selectedContact = contact;
      }
      this.dialogOpen = !this.dialogOpen;
    },
    userState(state: string): string {
      let color = 'bg-negative';
      switch (state) {
        case 'Online':
          color = 'bg-positive';
          break;
        case 'Offline':
          color = 'bg-negative';
          break;
        case 'DND':
          color = 'bg-warning';
          break;
      }
      ;
      return color;
    }
  }

});

</script>

<style>
.badge-state {
  margin: 0 -4px -4px 0;
  padding: 0;
  width: 16px;
  height: 16px;
  border: 2px solid white;
  border-radius: 10px;
}
.dialog {
  width: 400px;
  height: 400px;
}

</style>
