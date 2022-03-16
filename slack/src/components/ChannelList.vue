<template>
  <div class="q-pa-sm q-gutter-md">
    <q-item
      clickable
      v-ripple
    >
      <q-item-section>
        <q-item-label
          lines="1"
          class
          :class="channelSeen(channels[0].seen)"
        >
          # General
        </q-item-label>
      </q-item-section>

      <q-item-section
        v-if="!channels[0].seen"
        side
      >
        <q-badge
          rounded
          color="secondary"
        />
      </q-item-section>
    </q-item>

    <q-list padding class="rounded-borders" style="max-width: 350px">
      <q-expansion-item
        switch-toggle-side
        expand-separator
        default-opened
        dense
        label="PUBLIC"
        expand-icon="chevron_right"
        expanded-icon="expand_more"
        class="expandable-icon"
      >
        <q-item
          class="channel-item q-mt-sm"
          v-for="channel in channels"
          :key="channel.id"
          clickable
          v-ripple
        >
          <q-item-section>
            <q-item-label
              lines="1"
              class="q-pl-md"
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
              color="secondary"
            />
          </q-item-section>
        </q-item>
      </q-expansion-item>
    </q-list>

    <q-list padding class="rounded-borders" style="max-width: 350px">
      <q-expansion-item
        switch-toggle-side
        expand-separator
        default-opened
        dense
        label="PRIVATE"
        expand-icon="chevron_right"
        expanded-icon="expand_more"
        class="expandable-icon"
      >
        <q-item
          class="channel-item q-mt-sm"
          v-for="channel in channels"
          :key="channel.id"
          clickable
          v-ripple
        >
          <q-item-section>
            <q-item-label
              lines="1"
              class="q-pl-md"
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
              color="secondary"
            />
          </q-item-section>
        </q-item>
      </q-expansion-item>
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

  .q-expansion-item__container .q-item {
    padding-left: 0;
  }

  .expandable-icon > div > div > .q-item__section--avatar {
    min-width: 35px;
  }

  .q-item:last-child{
    margin-bottom: 48px;
  }

  .q-item:hover {
    background-color: rgba(38, 166, 154, 0.11) !important;
  }
</style>
