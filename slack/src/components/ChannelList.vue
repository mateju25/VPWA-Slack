<template>
  <div class='q-pa-sm q-gutter-md'>
    <q-item
      class='q-ml-none'
      clickable
      v-ripple
      :class='channels[0].id === activeChannel.id ? "channel-active" : ""'
      @click="changeActiveModel(channels[0])"
    >
      <ChannelItem  :channel='channels[0]' />
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
          :class='channel.id === activeChannel.id ? "channel-active" : ""'
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
          :class='channel.id === activeChannel.id ? "channel-active" : ""'
          @click="changeActiveModel(channel)"
        >
          <ChannelItem :channel='channel' />
        </q-item>
      </q-expansion-item>
    </q-list>

    <q-separator/>

    <q-btn
      flat
      dense
      :color="Dark.isActive ? 'white' : 'black'"
      label='Create new channel'
      icon="add_circle_outline"
      class="full-width q-pl-lg last-item"
      align="left"
      @click='newChannel = true'
    >
    </q-btn>


    <q-dialog v-model='newChannel' persistent>
      <q-card>
        <q-card-section class='row items-center'>
          <q-input square standout="bg-grey-10 text-white" clearable v-model="newChannelName" type="name" label="Channel name"/>
          <q-toggle v-model='newChannelPrivate' label='Private'/>
        </q-card-section>

        <q-card-actions align='right'>
          <q-btn flat label='Cancel' color='secondary' v-close-popup />
          <q-btn flat label='Create' color='primary' @click="this.$emit('createNewChannel', newChannelName, newChannelPrivate)" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </div>
</template>

<script lang='ts'>

import { defineComponent, PropType, ref } from 'vue';
import { Channel } from 'components/models';
import ChannelItem from 'components/ChannelItem.vue';
import { Dark } from 'quasar';

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
  data(){
    let channelPrivacy = ref(false);
    return{
      newChannelName: '',
      newChannelPrivate: channelPrivacy,
      newChannel: false,
      Dark: Dark,
    }
  },
  methods: {
    changeActiveModel: function(channel: Channel): void {
      this.$emit('updateActiveChannel', channel);
    }
  },
  computed: {
    privateChannels: function(): Channel[] {
      let privateChannels: Channel[] = [];
      this.channels.forEach(item => {
        if (item.isPrivate && item.name !== 'General')
          privateChannels.push(item);
      });
      return privateChannels;
    },
    publicChannels: function(): Channel[] {
      let publicChannels: Channel[] = [];
      this.channels.forEach(item => {
        if (!item.isPrivate && item.name !== 'General')
          publicChannels.push(item);
      });
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

.new-channel {
  margin-bottom: 60px;
}

.q-item:hover {
  background-color: rgba(38, 166, 154, 0.11) !important;
}
.channel-active {
  background-color: rgba(38, 166, 154, 0.11) !important;
}

.last-item {
  margin-bottom: 70px;
}
.q-field__control-container {
  margin-left: 10px;
}
</style>
