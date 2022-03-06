<template>
  <div class="q-pa-sm q-gutter-md">
    <q-list padding class="rounded-borders" style="max-width: 350px">

      <q-item
        v-for="channel in channels"
        :key="channel.id"
        clickable
        v-ripple
      >
        <q-item-section>
          <q-item-label 
            lines="1"
            class
            :class="channelSeen(channel.seen)"
          >
            # {{ channel.name }}
          </q-item-label>
        </q-item-section>

        <q-item-section
          v-if="!channel.seen" 
          side
        >
          <q-badge 
            rounded
            color="blue"
          />
        </q-item-section>
      </q-item>

      
    </q-list>
  </div>
</template>

<script lang="ts">

import { defineComponent } from 'vue'

export default defineComponent({
  data() {
    return {
      channels: [
        { 'id': 1, 'name': 'Channel 1', 'seen': false },
        { 'id': 2, 'name': 'Channel 2', 'seen': false },
        { 'id': 3, 'name': 'Channel 3', 'seen': true },
        { 'id': 4, 'name': 'Channel 4', 'seen': true },
        { 'id': 5, 'name': 'Channel 5', 'seen': true },
      ]
    }
  },

  methods: {
    channelSeen(seen: boolean): string {
      if(!seen){
        return 'text-bold';
      }
      return '';
    },
  },
})

</script>

<style>
  .q-item__label{
    font-size: 16px;
  }
</style>