<template>
  <div class='q-pa-sm q-gutter-md'>
    <q-dialog v-model='confirm' persistent>
      <q-card class='new-channel'>
        <q-card-section class='row items-center'>
          <q-icon name='report_problem' size='xl' color='red' />
          <div class='q-ml-sm column'>
            <span class='text-weight-bold'>You are currently leaving this channel!</span>
            <br/>
            <span v-if='activeChannel.owners.find(value => value.id === loggedUser.id)'>You are owner of this channel and it will be deleted!</span>
            <span>Are you sure?</span>
          </div>
        </q-card-section>

        <q-card-actions align='right'>
          <q-btn flat label='Cancel' color='secondary' v-close-popup />
          <q-btn flat label='Leave' color='primary' @click="deleteChannel()" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>



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
      />

      <q-item-label header v-if='activeChannel.members.length > 0'>Users</q-item-label>
      <UserContactListItem
        :contacts='activeChannel.members'
      />
    </q-list>

  </div>
</template>

<script lang='ts'>

import { defineComponent, ref } from 'vue';
import UserContactListItem from 'src/components/UserContactListItem.vue';
import { Channel } from './models';
import { Dark } from 'quasar';

export default defineComponent({
  // type inference enabled
  components: {
    UserContactListItem
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
