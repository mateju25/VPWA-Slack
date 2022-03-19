<template>
  <q-item-section class='q-ml-md'>
    <q-item-label
      lines='1'
      class
      :class='channelSeen(channel.topped)'
    >
      # {{channel.name}}
    </q-item-label>
  </q-item-section>

  <q-item-section
    v-if='!channel.topped'
    side
  >
    <q-badge
      rounded
      color='secondary'
    />
  </q-item-section>
</template>

<script lang='ts'>
import { Channel } from './models';

export default {
  name: 'ChannelItem',
  props: {
    channel: Channel
  },
  methods: {
    channelSeen(seen: boolean): string {
      if (!seen) {
        return 'text-bold';
      }
      return '';
    },
  }
};
</script>

<style scoped>

</style>
