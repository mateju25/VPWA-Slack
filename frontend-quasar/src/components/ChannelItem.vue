<template>
  <q-item-section class='q-ml-md'>
    <q-item-label
      lines='1'
      class
      :class='channelTopped(channel.topped)'
    >
      # {{channel.channel.name}}
    </q-item-label>
  </q-item-section>

  <q-item-section
    v-if='channel.topped'
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
    channel: Object as () => { channel: Channel, topped: boolean }
  },
  methods: {
    channelTopped(topped: boolean): string {
      if (topped) {
        return 'text-bold';
      }
      return '';
    },
  }
};
</script>

<style scoped>

</style>
