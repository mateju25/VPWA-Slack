<template>
  <q-layout view="hHh lpR fFf">

    <q-header elevated class="bg-primary text-white">
      <q-toolbar class="content-center">
        <q-btn dense flat round icon="menu" class="hide-channels" @click="toggleLeftDrawer" />

        <q-toolbar-title class="flex flex-center">
          <p class="q-ma-none">Title</p>
        </q-toolbar-title>

        <q-btn dense flat round icon="people" class="hide-users" @click="toggleRightDrawer" />

        <q-btn
          dense
          flat
          round
          class="hide-avatar"
        >
          <q-avatar
            color="blue-grey-11"
            square
            text-color="primary"
            size="36px"
          >
            {{ user.nick_name[0] }}
            <q-badge
              class="absolute-bottom-right badge-state"
              :class="userState(user.state)"
            />
          </q-avatar>
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
      <ChannelList/>

      <div
        class="absolute-bottom-left mobile-avatar"
      >
        <q-separator/>
        <q-btn
          dense
          class="q-ma-sm"
        >
          <q-avatar
            color="blue-grey-11"
            square
            text-color="primary"
            size="36px"
            class="q-mr-sm"
          >
            {{ user.nick_name[0] }}
            <q-badge
              class="absolute-bottom-right badge-state"
              :class="userState(user.state)"
            />
          </q-avatar>
          {{ user.nick_name }}
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
      <UserContactList/>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import UserContactList from 'src/components/UserContactList.vue';
import ChannelList from 'src/components/ChannelList.vue';

export default defineComponent({
  name: 'MainLayout',
  components: {
    UserContactList,
    ChannelList
  },

  data() {
    return {
      user: { 'id': 1, 'nick_name': 'Jesse', 'state': 'Online' },
    }
  },

  setup () {
    const leftDrawerOpen = ref(false)
    const rightDrawerOpen = ref(false)
    return {
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
      rightDrawerOpen,
      toggleRightDrawer () {
        rightDrawerOpen.value = !rightDrawerOpen.value
      }
    }
  },

  methods: {
    userState(state: string): string {
      let color = 'bg-negative';
      switch(state){
        case 'Online':
          color='bg-positive';
          break;
        case 'Offline':
          color='bg-negative';
          break;
        case 'DND':
          color='bg-warning';
          break;
      };
      return color;
    },
  },
})
</script>
<style>
@media (min-width: 992px) {
  .hide-users, .mobile-avatar{
    display: none;
  }
}

@media (max-width: 992px) {
  .hide-avatar{
    display: none;
  }
}

@media (min-width: 768px) {
  .hide-channels{
    display: none;
  }
}

.mobile-avatar{
  width:100%;
}

</style>
