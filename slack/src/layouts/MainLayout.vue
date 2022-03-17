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
      <ChannelList :channels='channels'/>

      <div
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
      <UserContactList :contacts='users' :activeChannel='activeChannel'/>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import UserContactList from 'src/components/UserContactList.vue';
import ChannelList from 'src/components/ChannelList.vue';
import Avatar from 'components/Avatar.vue';
import UserInfoDialogContent from 'components/UserInfoDialogContent.vue';
import { Channel, User } from 'src/components/models';

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
    let channels: Channel[] = [];
    let activeChannel: Channel = new Channel(1, 'General', false, true);
    channels.push(activeChannel);
    channels.push(new Channel(2, 'Studovna', false, true));
    channels.push(new Channel(3, 'Klietka', false, true));
    channels.push(new Channel(4, 'Opicarna', false, false));
    channels.push(new Channel(5, 'Medzi 4 ocami', true, true));
    channels.push(new Channel(6, 'Porada', true, true));
    channels.push(new Channel(7, 'Porada sefovia', true, false));
    let loggedUser: User;
    users.push(new User(1, 'Jesse', 'Jesse Jones', 'Jesse@Jones.com', 'online'));
    users.push(new User(2, 'John', 'John Jones', 'John@Jones.com', 'online'));
    users.push(new User(3, 'Clarence', 'Clarence Jones', 'Clarence@Jones.com', 'online'));
    users.push(new User(4, 'Tina', 'Tina Jones', 'Tina@Jones.com', 'online'));
    users.push(new User(5, 'Anne', 'Anne Jones', 'Anne@Jones.com', 'online'));
    loggedUser = users[0];

    return {
      users: users,
      loggedUser: loggedUser,
      activeChannel: activeChannel,
      channels: channels,
      leftDrawerOpen: false,
      rightDrawerOpen: false,
      dialogOpen: false
    }
  },
  methods: {
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

</style>
