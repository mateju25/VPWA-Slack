<template>
  <div class='q-pa-sm q-gutter-md'>
    <q-dialog v-model='confirm' persistent>
      <q-card>
        <q-card-section class='row items-center'>
          <q-icon name='report_problem' size='xl' color='red' />
          <div class='q-ml-sm column'>
            <span class='text-weight-bold'>You are currently leaving this channel!</span>
            <br/>
            <span v-if='owners.includes(loggedUser)'>You are owner of this channel and it will be deleted!</span>
            <span>Are you sure?</span>
          </div>
        </q-card-section>

        <q-card-actions align='right'>
          <q-btn flat label='Cancel' color='secondary' v-close-popup />
          <q-btn flat label='Leave' color='primary' @click="this.$emit('deleteChannel', activeChannel)" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    

    <div class='q-my-lg q-ml-lg q-mr-none text-h6 row justify-between'>
      <p class='q-ma-none'># {{ activeChannel.name }}</p>
      <q-btn
        icon='flight_takeoff'
        flat
        :color="Dark.isActive ? 'white' : 'black'"
        @click='confirm = true'
      />
    </div>
    <q-separator />

    <q-list>
      <q-item-label header v-if='owners.length > 0'>Owners</q-item-label>
      <UserContactListItem
        :contacts='owners'
      />

      <q-item-label header v-if='users.length > 0'>Users</q-item-label>
      <UserContactListItem
        :contacts='users'
      />
    </q-list>

  </div>
</template>

<script lang='ts'>

import { defineComponent, PropType, ref } from 'vue';
import UserContactListItem from 'src/components/UserContactListItem.vue';
import { Channel, RelationUserChannel, User } from './models';
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
      newChannel: false,
      loggedUser: this.$store.state.chatModule.loggedUser
    };
  },
  props: {
    contacts: {
      type: Array as PropType<Array<RelationUserChannel>>,
      required: true
    },
    activeChannel: {
      type: Object as PropType<Channel>,
      required: true
    }
  },
  computed: {
    owners: function(): User[] {
      let owners: User[] = [];
      this.contacts.filter(item => item.relation.id == 1).forEach(item => owners.push(item.user));
      return owners;
    },
    users: function(): User[] {
      let users: User[] = [];
      this.contacts.filter(item => item.relation.id == 2).forEach(item => users.push(item.user));
      return users;
    }
  }
});

</script>

<style>
.menu-actions-channel {
  max-width: 250px;
}
</style>
