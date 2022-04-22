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
            v-if='userLoaded'
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
            v-if='userLoaded'
            :contact="this.$store.state.authStore.user"
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
      <ChannelList v-if='channelsLoaded' />

      <div
        v-if='userLoaded'
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
      <UserContactList v-if='channelsLoaded' :highlighted='highlighted' />
    </q-drawer>

    <q-page-container>
      <router-view @commandList="commandList()"/>
    </q-page-container>

  </q-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ChannelList from 'src/components/ChannelList.vue';
import Avatar from 'components/Avatar.vue';
import UserInfoDialogContent from 'components/UserInfoDialogContent.vue';
import UserContactList from 'components/UserContactList.vue';
import { Dark } from 'quasar';
import { User } from 'src/components/models';

export default defineComponent({
  name: 'MainLayout',
  components: {
    UserInfoDialogContent,
    Avatar,
    UserContactList,
    ChannelList
  },
  async beforeUnmount() {
    await this.$store.dispatch('authStore/logout');
  },
  created() {
    if (!this.$store.state.authStore.user)
      this.$store.dispatch('authStore/check');
    this.$store.dispatch('channelStore/loadChannels');
  },
  data() {
    return {
      Dark: Dark,
      leftDrawerOpen: false,
      rightDrawerOpen: false,
      dialogOpen: false,
      highlighted: false,
    }
  },
  computed: {
    loggedUser(): User {
      return this.$store.state.authStore.user as User;
    },
    channelsLoaded (): boolean {
      return this.$store.state.channelStore.statusChannel === 'success'
    },
    userLoaded (): boolean {
      return this.$store.state.authStore.user !== null
    },
  },
  methods: {
    commandList() {
      if (!this.rightDrawerOpen)
        this.rightDrawerOpen = true;
      else {
        this.highlighted = true;
        setTimeout(() => {
          this.highlighted = false;
        }, 1000);
      }
    },
    changeDialogOpen() {
      this.dialogOpen = !this.dialogOpen;
      console.log(this.$store.state.channelStore.activeChannel);
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
