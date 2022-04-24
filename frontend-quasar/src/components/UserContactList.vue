<template>
  <div class='q-pa-sm q-gutter-md'>
    <UserLeavingDialog :confirm='confirm' @updateConfirm='updateConfirm'/>

    <div class='q-my-lg q-ml-lg q-mr-none text-h6 row justify-between'>
      <p class='q-ma-none'># {{ activeChannel.name }}</p>
      <q-btn
        v-if="activeChannel.name !== 'General'"
        icon='flight_takeoff'
        flat
        :color="Dark.isActive ? 'white' : 'black'"
        @click='confirm = true'
      >
        <q-tooltip>
          Leave channel
        </q-tooltip>
      </q-btn>
    </div>
    <q-separator />

    <q-list>
      <q-item-label header v-if='activeChannel.owners.length > 0'>Owners</q-item-label>
      <UserContactListItem
        :contacts='activeChannel.owners'
        :highlighted='highlighted'
      />

      <q-item-label header v-if='activeChannel.members.length > 0'>Users</q-item-label>
      <UserContactListItem
        :contacts='activeChannel.members'
        :highlighted='highlighted'
      />
    </q-list>

  </div>
</template>

<script lang='ts'>

import { defineComponent, ref } from 'vue';
import UserContactListItem from 'src/components/UserContactListItem.vue';
import { Channel } from './models';
import { Dark } from 'quasar';
import UserLeavingDialog from 'components/UserLeavingDialog.vue';

export default defineComponent({
  // type inference enabled
  components: {
    UserLeavingDialog,
    UserContactListItem
  },
  props: {
    highlighted: {
      type: Boolean,
      default: false
    },
  },
  data() {
    let channelPrivacy = ref(false);
    return {
      Dark: Dark,
      newChannelName: '',
      newChannelPrivate: channelPrivacy,
      confirm: false,
      newChannel: false
    };
  },
  methods: {
    updateConfirm(newValue: boolean) {
      this.confirm = newValue;
    },
    deleteChannel() {
      this.$store.dispatch('channelStore/deleteChannel', {channel: this.activeChannel}).then(() => {

          this.$q.notify({
            color: 'blue-4',
            textColor: 'white',
            position: 'top',
            icon: 'info',
            message: 'Channel succesfully deleted'
          });
      });
    },
  },
  computed: {
    loggedUser() {
      return this.$store.state.authStore.user;
    },
    activeChannel (): Channel {
      return this.$store.state.channelStore.activeChannel as Channel;
    },
  }
});

</script>

<style>
.menu-actions-channel {
  max-width: 250px;
}
</style>
