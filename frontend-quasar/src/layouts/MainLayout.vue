<template>
  <q-layout view="hHh LpR fFf">

    <q-header elevated class="bg-primary text-white">
      <q-toolbar class="content-center">
        <q-btn dense flat round icon="menu" class="hide-channels" @click="toggleLeftDrawer" />

        <q-toolbar-title class="flex flex-center">
          <q-icon size="lg" class="q-mr-sm">
            <img src="~assets/icon3.svg" />
          </q-icon>
          <p class="q-ma-none">VoidMessenger</p>
        </q-toolbar-title>

        <q-btn dense flat round icon="people" class="hide-users" @click="toggleRightDrawer" />

        <q-dialog v-model="dialogOpen">
          <UserInfoDialogContent
            :selectedContact='loggedUser'
            :inHeader='true'
          />
        </q-dialog>

        <q-btn
          dense
          flat
          round
          class="hide-avatar"
          @click="changeDialogOpen()"
        >
          <Avatar
            :contact="loggedUser"
            :inHeader="true"
            :size="'36px'"
          />
        </q-btn>

      </q-toolbar>
    </q-header>

    <q-drawer
      show-if-above
      v-model="leftDrawerOpen"
      side="left"
      :breakpoint="768"
      bordered
    >
      <ChannelList :channels='channels' :activeChannel='activeChannel' @updateActiveChannel="changeActiveChannel"/>

      <div
        :class="Dark.isActive ? 'background-dark' : 'background-white'"
        class="absolute-bottom-left mobile-avatar"
      >
        <q-dialog v-model="dialogOpen">
          <UserInfoDialogContent
            :selectedContact='loggedUser'
            :inHeader='true'
          />
        </q-dialog>

        <q-separator/>
        <q-btn
          dense
          class="q-ma-sm"
          @click="changeDialogOpen()"
        >
          <Avatar class='q-mr-md' :contact='loggedUser' :in-header='true' :size="'36px'"/>
          {{ loggedUser.username }}
        </q-btn>
      </div>

    </q-drawer>

    <q-drawer
      show-if-above
      v-model="rightDrawerOpen"
      side="right"
      :breakpoint="992"
      icon="people"
      bordered
    >
      <UserContactList :contacts='filteredRelations' :active-channel='activeChannel' @createNewChannel='createNewChannel' @deleteChannel='deleteChannel'/>
    </q-drawer>

    <q-page-container>
      <router-view :messages='filteredMessages' @newMessage="addNewMessage"/>
    </q-page-container>

  </q-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import UserContactList from 'src/components/UserContactList.vue';
import ChannelList from 'src/components/ChannelList.vue';
import Avatar from 'components/Avatar.vue';
import UserInfoDialogContent from 'components/UserInfoDialogContent.vue';
import { Channel, Message, Role, RelationUserChannel, UnreadMessage, User } from 'src/components/models';
import {Dark} from 'quasar';

export default defineComponent({
  name: 'MainLayout',
  components: {
    UserInfoDialogContent,
    Avatar,
    UserContactList,
    ChannelList
  },
  data() {
    console.log(this.$store.state.auth.user)
    let loggedUser = this.$store.state.auth.user as unknown as User;


    let messages: Message[] = [];
    let unreadMessages: UnreadMessage[] = [];
    let channels: Channel[] = loggedUser.channels;
    let userChannelRelations: RelationUserChannel[] = [];
    let typeRelations: Role[] = [];
    typeRelations.push(new Role(1, 'Owner'));
    typeRelations.push(new Role(2, 'User'));

    let activeChannel: Channel = channels[0];

    return {
      loggedUser: loggedUser,
      activeChannel: activeChannel,
      channels: channels,
      typeRelations: typeRelations,
      messages: messages,
      unreadMessages: unreadMessages,
      userChannelRelations: userChannelRelations,
      Dark: Dark,
      leftDrawerOpen: false,
      rightDrawerOpen: false,
      dialogOpen: false
    }
  },
  computed: {
    filteredRelations: function(): RelationUserChannel[] {
      return this.userChannelRelations.filter(item => item.channel.id == this.activeChannel.id);
    },
    filteredMessages: function(): Message[] {
      return this.messages.filter(item => item.belongsTo.id === this.activeChannel.id);
    }
  },
  methods: {
    deleteChannel(channel: Channel) {
      this.channels.splice(this.channels.indexOf(channel), 1);
      this.activeChannel = this.channels[0];
    },
    createNewChannel(channelName: string, isPrivate: boolean) {
      let channel: Channel = new Channel(10, channelName, isPrivate, false);
      this.channels.push(channel);
      this.userChannelRelations.push(new RelationUserChannel(1, this.loggedUser, channel, this.typeRelations[0]));
    },
    addNewMessage(message: string) {
      this.messages.push(new Message(-1, message, this.loggedUser, this.activeChannel, false, Date.now()));
    },
    changeActiveChannel(channel: Channel) {
      channel.topped = true;
      this.activeChannel = channel;
    },
    changeDialogOpen() {
      this.dialogOpen = !this.dialogOpen;
    },
    toggleRightDrawer () {
      this.rightDrawerOpen = !this.rightDrawerOpen
    },
    toggleLeftDrawer () {
      this.leftDrawerOpen = !this.leftDrawerOpen
    },
  },
})
</script>
<style>
@media (min-width: 992px) {
  .hide-users, .mobile-avatar, .hide-channels {
    display: none;
  }
}

@media (max-width: 992px) {
  .hide-avatar{
    display: none;
  }
}

.mobile-avatar{
  width:100%;
  background-color: var(--q-dark);
}

.background-dark{
  background-color: var(--q-dark);
}
.background-white{
  background-color: #d9d9d9;
}

</style>
