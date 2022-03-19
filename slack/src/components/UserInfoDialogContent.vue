<template>
  <q-card class="dialog">
    <q-card-section
      class="absolute-top-right"
    >
      <q-btn icon="close" flat round dense v-close-popup />
    </q-card-section>

    <q-card-section
      class="q-mt-lg header"
    >
      <Avatar
        :contact="selectedContact"
        :inHeader="inHeader"
        :size="'50px'"
      />
      <div
        class="column q-ml-lg"
      >
        <h6
          class="q-ma-none"
        >
          {{ selectedContact.nickname }}
        </h6>
        <div
          v-if='inHeader'
          class="header"
        >
          <q-select
            dense
            options-dense
            hide-bottom-space
            v-model="userState"
            :options="options"
            label="State"
            style="width:100px"
          />
        </div>
        <div
          v-else
          class="q-mb-none"
        >
          {{userState}}
        </div>

      </div>
    </q-card-section>

    <q-card-section
      v-if="inHeader"
    >
      <q-toggle
        class='toggle'
        v-model="darkMode"
        color="primary"
        label="Dark mode"
        size="md"
        left-label
        keep-color
      />
      <br/>
      <q-toggle
        class='toggle'
        v-model="notifications"
        color="primary"
        :label="notifications ? 'Only mentions' : 'All notifications'"
        size="md"
        left-label
        keep-color
      />
    </q-card-section>

    <q-card-section
      v-if="inHeader"
    >
      <q-separator/>
      <q-btn
        flat
        :color="darkMode ? 'white' : 'black'"
        class="full-width q-my-sm"
        align="left"
        label="Sign out"
        icon="logout"
        @click="$router.replace('/login')"
      />
    </q-card-section>
  </q-card>
</template>

<script lang="ts">

import { defineComponent, PropType } from 'vue';
import Avatar from 'components/Avatar.vue';
import { Dark } from 'quasar';
import { User } from 'components/models';

export default defineComponent({
  components: { Avatar },
  props: {
    selectedContact: {
      type: Object as PropType<User>,
      required: true
    },
    inHeader: Boolean
  },
  data() {
    return {
      userState: this.selectedContact.state,
      notifications: this.selectedContact.notificationsOn,
      options: [
        'Online', 'Offline', 'DND'
      ]
    }
  },
  computed: {
    darkMode: {
      get (): boolean  { return Dark.isActive },
      set (value: boolean) { Dark.set(value)},
    },
  },
  watch: {
    userState: function(): void {
      this.$store.commit('chatModule/updateLoggedUserState', this.userState);
    },
    notifications: function(): void {
      this.$store.commit('chatModule/updateLoggedUserNotifications', this.notifications);
    }
  }

});

</script>

<style>
.dialog {
  width: 400px;
  height: 400px;
  padding: 1rem;
}

.header{
  display: flex;
  align-items: center;
}
.toggle {
  width: 200px;
  justify-content: space-between;
}
</style>
