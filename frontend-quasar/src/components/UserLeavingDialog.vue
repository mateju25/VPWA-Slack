<template>
  <q-dialog v-model='confirmDialog' persistent>
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
</template>

<script lang='ts'>

import { defineComponent, ref } from 'vue';
import { Channel } from './models';

export default defineComponent({
  props: {
    confirm: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    let channelPrivacy = ref(false);
    return {
      newChannelName: '',
      newChannelPrivate: channelPrivacy,
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
    confirmDialog: {
      get() {
        return this.confirm;
      },
      set(newValue: boolean) {
        this.$emit('updateConfirm', newValue);
      }
    },
    loggedUser() {
      return this.$store.state.authStore.user;
    },
    activeChannel (): Channel {
      return this.$store.state.channelStore.activeChannel as Channel;
    },
  }
});

</script>

<style scoped>

</style>
