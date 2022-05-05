<template >
  <div class='q-pa-sm q-gutter-md'>
    <q-list padding class='rounded-borders' style='max-width: 350px'>
      <q-expansion-item
        switch-toggle-side
        expand-separator
        default-opened
        dense
        label='INVITATIONS'
        expand-icon='chevron_right'
        expanded-icon='expand_more'
        class='expandable-icon'
      >
        <q-item
          class='channel-item q-mt-sm'
          v-for='channel in invitations'
          :key='channel.channel.id'
          :class='channel.channel.id === activeChannel.id ? "channel-active" : ""'
        >
          <ChannelItem :channel='channel'/>
        </q-item>
      </q-expansion-item>
    </q-list>

    <q-separator />

    <q-item
      class='q-ml-none'
      clickable
      v-ripple
      :class='general.channel.id === activeChannel.id ? "channel-active" : ""'
      @click='changeActiveModel(general)'
    >
      <ChannelItem :channel='general'/>
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
          :class='channel.channel.id === activeChannel.id ? "channel-active" : ""'
          @click='changeActiveModel(channel)'
        >
          <ChannelItem :channel='channel'/>
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
          :key='channel.channel.id'
          clickable
          v-ripple
          :class='channel.channel.id === activeChannel.id ? "channel-active" : ""'
          @click='changeActiveModel(channel)'
        >
          <ChannelItem :channel='channel'/>
        </q-item>
      </q-expansion-item>
    </q-list>

    <q-separator />

    <q-btn
      flat
      dense
      :color="Dark.isActive ? 'white' : 'black'"
      label='Join channel'
      icon='add_circle_outline'
      class='full-width q-pl-lg last-item'
      align='left'
      @click='newChannel = true'
    >
    </q-btn>


    <q-dialog v-model='newChannel' persistent>
      <q-card class='new-channel'>
        <q-card-section>
          <h2>Join channel</h2>
        </q-card-section>
        <q-card-section class='row items-center'>
          <q-input class='full-width' square standout='bg-grey' clearable v-model='newChannelName' type='name' label='Channel name' />
          <br/>
          <q-toggle class='q-mt-md' v-model='newChannelPrivate' :label='newChannelPrivate ? "Private" : "Public"' />
        </q-card-section>

        <q-card-actions align='right'>
          <q-btn flat label='Cancel' color='secondary' v-close-popup />
          <q-btn flat label='Join' color='primary' @click='createNewChannel()' v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </div>
</template>

<script lang='ts'>

import { defineComponent } from 'vue';
import { Channel } from 'components/models';
import ChannelItem from 'components/ChannelItem.vue';
import { Dark } from 'quasar';

export default defineComponent({
  components: { ChannelItem },
  data() {
    return {
      newChannelName: '',
      newChannelPrivate: false,
      newChannel: false,
      Dark: Dark,
    };
  },
  methods: {
    createNewChannel() {
      if (this.newChannelName.length > 0) {
        this.$store.dispatch('channelStore/addChannel', {
          name: this.newChannelName,
          isPrivate: this.newChannelPrivate
        }).catch((err) => {
          this.$q.notify({
            color: 'red-4',
            textColor: 'white',
            position: 'top',
            icon: 'warning',
            message: err.response?.data.message
          });
        });
        this.newChannelName = '';
        this.newChannelPrivate = false;
      }
    },
    changeActiveModel: async function(channel: { channel: Channel, topped: boolean }): Promise<void> {
      await this.$store.dispatch('channelStore/addMessageCurrentlyTyping', { channel: this.$store.state.channelStore.activeChannel!.name, message: '' });
      await this.$store.dispatch('channelStore/setActiveChannel', channel.channel);
    }
  },
  computed: {
    invitations: function(): { channel: Channel, topped: boolean }[] {
      return this.$store.state.channelStore.invitations;
    },
    channels: function(): { channel: Channel, topped: boolean }[] {
      return this.$store.state.channelStore.channels;
    },
    activeChannel: function(): Channel | null {
      return this.$store.state.channelStore.activeChannel;
    },
    general: function(): { channel: Channel, topped: boolean } {
      return this.$store.state.channelStore.channels.find((x) => x.channel.name === 'General') as { channel: Channel, topped: boolean };
    },
    privateChannels: function(): { channel: Channel, topped: boolean }[] {
      let privateChannels: { channel: Channel, topped: boolean }[] = [];
      this.channels.forEach(item => {
        if (item.channel.isPrivate && item.channel.name !== 'General')
          privateChannels.push(item);
      });
      return privateChannels;
    },
    publicChannels: function(): { channel: Channel, topped: boolean }[] {
      let publicChannels: { channel: Channel, topped: boolean }[] = [];
      this.channels.forEach(item => {
        if (!item.channel.isPrivate && item.channel.name !== 'General')
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
  width: 350px;
}

.new-channel h2 {
  font-size: 20px;
  font-weight: 500;
  line-height: 1;
  margin: 0;
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
