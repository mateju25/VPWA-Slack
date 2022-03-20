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
      :breakpoint="992"
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
          {{ loggedUser.nickname }}
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
import { Channel, Message, Relation, RelationUserChannel, UnreadMessage, User } from 'src/components/models';
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
    let users: User[] = [];
    let messages: Message[] = [];
    let unreadMessages: UnreadMessage[] = [];
    let channels: Channel[] = [];
    let userChannelRelations: RelationUserChannel[] = [];
    let typeRelations: Relation[] = [];
    typeRelations.push(new Relation(1, 'Owner'));
    typeRelations.push(new Relation(2, 'User'));

    let activeChannel: Channel;
    channels.push(new Channel(1, 'General', false, true));
    channels.push(new Channel(2, 'Studovna', false, true));
    channels.push(new Channel(3, 'Klietka', false, true));
    channels.push(new Channel(4, 'Opicarna', false, true));
    channels.push(new Channel(5, 'Medzi 4 ocami', true, true));
    channels.push(new Channel(6, 'Porada', true, true));
    channels.push(new Channel(7, 'Porada sefovia', true, true));
    activeChannel = channels[0];

    let loggedUser: User;
    users.push(new User(1, 'Jesse', 'Jesse Jones', 'Jesse@Jones.com', 'Online'));
    users.push(new User(2, 'John', 'John Jones', 'John@Jones.com', 'Online'));
    users.push(new User(3, 'Clarence', 'Clarence Jones', 'Clarence@Jones.com', 'DND'));
    users.push(new User(4, 'Tina', 'Tina Jones', 'Tina@Jones.com', 'Offline'));
    users.push(new User(5, 'Anne', 'Anne Jones', 'Anne@Jones.com', 'Offline'));
    loggedUser = users[0];
    this.$store.commit('chatModule/updateLoggedUser', loggedUser)

    messages.push(new Message(1, 'Nieco pisem do chatu od prihlseneho usera', loggedUser, channels[0], false, Date.UTC(2022,3,17,18,51)));
    messages.push(new Message(2, 'Nieco pisem do chatu od ineho usera a oznacujem @Jesse', users[1], channels[0], false, Date.UTC(2022,3,17,18,52)));
    messages.push(new Message(3, 'Nieco pisem do chatu od dalsieho usera', users[2], channels[0], false, Date.UTC(2022,3,17,18,59)));
    messages.push(new Message(4, 'Nieco pisem akurat  do chatu, mozes to vidiet', users[1], channels[0], true, null));
    messages.push(new Message(5, 'Nieco pisem akurat  do chatu, mozes to vidiet druhy krat', users[2], channels[0], true, null));
    messages.push(new Message(6, 'Nieco pisem do chatu, a clovek to este nevidel', users[2], channels[1], false, Date.UTC(2022,3,17,18,59)));
    messages.push(new Message(7, 'Nieco pisem do chatu, a clovek to este nevidel v private kanali', users[4], channels[5], false, Date.UTC(2022,3,17,18,59)));

    unreadMessages.push(new UnreadMessage(1, channels[1], users[0]));
    unreadMessages.push(new UnreadMessage(2, channels[5], users[0]));

    //nastav seen pre kanali
    unreadMessages.forEach(item => {
      if (item.user.id === loggedUser.id) {
        item.channel.topped = false;
      }
    });

    userChannelRelations.push(new RelationUserChannel(1, users[0], channels[0], typeRelations[1]));
    userChannelRelations.push(new RelationUserChannel(1, users[1], channels[0], typeRelations[1]));
    userChannelRelations.push(new RelationUserChannel(1, users[2], channels[0], typeRelations[1]));
    userChannelRelations.push(new RelationUserChannel(1, users[3], channels[0], typeRelations[1]));
    userChannelRelations.push(new RelationUserChannel(1, users[4], channels[0], typeRelations[1]));

    userChannelRelations.push(new RelationUserChannel(1, users[0], channels[1], typeRelations[1]));
    userChannelRelations.push(new RelationUserChannel(1, users[1], channels[1], typeRelations[1]));
    userChannelRelations.push(new RelationUserChannel(1, users[2], channels[1], typeRelations[1]));
    userChannelRelations.push(new RelationUserChannel(1, users[3], channels[1], typeRelations[1]));
    userChannelRelations.push(new RelationUserChannel(1, users[4], channels[1], typeRelations[1]));

    userChannelRelations.push(new RelationUserChannel(1, users[0], channels[2], typeRelations[1]));
    userChannelRelations.push(new RelationUserChannel(1, users[1], channels[2], typeRelations[1]));
    userChannelRelations.push(new RelationUserChannel(1, users[2], channels[2], typeRelations[1]));

    userChannelRelations.push(new RelationUserChannel(1, users[0], channels[3], typeRelations[1]));
    userChannelRelations.push(new RelationUserChannel(1, users[1], channels[3], typeRelations[1]));
    userChannelRelations.push(new RelationUserChannel(1, users[2], channels[3], typeRelations[1]));

    userChannelRelations.push(new RelationUserChannel(1, users[0], channels[4], typeRelations[0]));
    userChannelRelations.push(new RelationUserChannel(1, users[1], channels[4], typeRelations[1]));

    userChannelRelations.push(new RelationUserChannel(1, users[0], channels[5], typeRelations[0]));
    userChannelRelations.push(new RelationUserChannel(1, users[2], channels[5], typeRelations[1]));
    userChannelRelations.push(new RelationUserChannel(1, users[4], channels[5], typeRelations[1]));

    userChannelRelations.push(new RelationUserChannel(1, users[1], channels[6], typeRelations[0]));
    userChannelRelations.push(new RelationUserChannel(1, users[0], channels[6], typeRelations[1]));

    return {
      users: users,
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
