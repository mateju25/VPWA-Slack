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
    <div>
      <q-btn class='crossBtn' icon='close' @click='cancelInvitation(channel)'/>
      <q-btn class='q-ml-sm checkBtn' icon='check' @click='changeActiveModel(channel)'/>
    </div>
  </q-item-section>
</template>

<script lang='ts'>
import { Channel } from './models';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ChannelItem',
  props: {
    channel: Object as () => { channel: Channel, topped: boolean }
  },
  methods: {
    changeActiveModel: async function(channel: { channel: Channel, topped: boolean }): Promise<void> {
      // if topped channel -> change topped property to false
      if(channel.topped){
        await this.$store.dispatch('channelStore/changeToppedToFalse', {
          user: this.$store.state.authStore.user,
          channel: channel
        });
      }
      await this.$store.dispatch('channelStore/setActiveChannel', channel.channel);
    },
    cancelInvitation: async function(channel: { channel: Channel, topped: boolean }): Promise<void> {
      await this.$store.dispatch('channelStore/cancelInvitation', channel.channel);
    },
    channelTopped(topped: boolean): string {
      if (topped) {
        return 'text-bold';
      }
      return '';
    },
  }
});
</script>

<style scoped>
.checkBtn {
  background: #26a69a;
  color: white;
  width: 35px;
}
.crossBtn {
  background: #ff000059;
  color: white;
  width: 35px;
}
</style>
