<template>
  <div class='q-pa-sm q-gutter-md'>
    <q-item
      class='q-ml-none'
      clickable
      v-ripple
      @click="changeActiveModel(channels[0])"
    >
      <ChannelItem :channel='channels[0]' />
    </q-item>
    <q-list padding class='rounded-borders' style='max-width: 350px'>
      <q-expansion-item
        switch-toggle-side
        expand-separator
        default-opened
        dense
        label='PUBLIC'
        expand-icon='chevron_right'
        expanded-icon='expand_more'
        class='expandable-icon'
      >
        <q-item
          class='channel-item q-mt-sm'
          v-for='channel in publicChannels'
          :key='channel.id'
          clickable
          v-ripple
          @click="changeActiveModel(channel)"
        >
          <ChannelItem :channel='channel' />
        </q-item>
      </q-expansion-item>
    </q-list>

    <q-list padding class='rounded-borders' style='max-width: 350px'>
      <q-expansion-item
        switch-toggle-side
        expand-separator
        default-opened
        dense
        label='PRIVATE'
        expand-icon='chevron_right'
        expanded-icon='expand_more'
        class='expandable-icon'
      >
        <q-item
          class='channel-item q-mt-sm'
          v-for='channel in privateChannels'
          :key='channel.id'
          clickable
          v-ripple
          @click="changeActiveModel(channel)"
        >
          <ChannelItem :channel='channel' />
        </q-item>
      </q-expansion-item>
    </q-list>

  </div>
</template>

<script lang='ts'>

import { defineComponent, PropType } from 'vue';
import { Channel } from 'components/models';
import ChannelItem from 'components/ChannelItem.vue';

export default defineComponent({
  components: { ChannelItem },
  props: {
    channels: {
      type: Array as PropType<Array<Channel>>,
      required: true
    },
    activeChannel: {
      type: Object as PropType<Channel>,
      required: true
    }
  },
  methods: {
    changeActiveModel: function(channel: Channel): void {
      this.$emit('updateActiveChannel', channel);
    },
    compare: function(a: Channel, b: Channel): number {
      if (!a.topped && b.topped) {
        return -1;
      }
      if (a.topped && !b.topped) {
        return 1;
      }
      return 0;
    }
  },
  computed: {
    privateChannels: function(): Channel[] {
      let privateChannels: Channel[] = [];
      this.channels.forEach(item => {
        if (item.isPrivate && item.name !== 'General')
          privateChannels.push(item);
      });
      privateChannels.sort(this.compare);
      return privateChannels;
    },
    publicChannels: function(): Channel[] {
      let publicChannels: Channel[] = [];
      this.channels.forEach(item => {
        if (!item.isPrivate && item.name !== 'General')
          publicChannels.push(item);
      });
      publicChannels.sort(this.compare);
      return publicChannels;
    }
  }
});

</script>

<style>
.q-item__label {
  font-size: 16px;
}

.q-expansion-item__container .q-item {
  padding-left: 0;
}

.expandable-icon > div > div > .q-item__section--avatar {
  min-width: 35px;
}

.q-item:last-child {
  margin-bottom: 48px;
}

.q-item:hover {
  background-color: rgba(38, 166, 154, 0.11) !important;
}
</style>
