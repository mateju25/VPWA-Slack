<template>
  <q-card  class="dialog">
    <q-card-section class="row items-center q-pb-none">
      <Avatar v-bind:contact="selectedContact"  v-bind:inHeader="inHeader"/>
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
</template>

<script lang="ts">

import { defineComponent } from 'vue';
import Avatar from 'components/Avatar.vue';

export default defineComponent({
  components: { Avatar },
  props: {
    selectedContact: Object,
    inHeader: Boolean
  },
  methods: {
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
    },
    isInHeader(): boolean {
      return this.inHeader;
    }
  }

});

</script>

<style>
.dialog {
  width: 400px;
  height: 400px;
}

</style>
