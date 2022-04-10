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
          {{ selectedContact.username }}
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

    <q-card-section class="q-pb-none">
      <div class="row">
        <p class="col">
          Full name:
          </p>
        <p class="col">
          {{ selectedContact.fullname }}
        </p>
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
        @click="logout()"
      />
    </q-card-section>
  </q-card>
</template>

<script lang="ts">

import { defineComponent, PropType } from 'vue';
import Avatar from 'components/Avatar.vue';
import { Dark } from 'quasar';
import { User } from 'src/components/models';
import { RouteLocationRaw } from 'vue-router';

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
      userState: this.selectedContact.preference.stateName,
      darkMode: this.selectedContact.preference.darkMode,
      notifications: this.selectedContact.preference.notificationsOn,
      options: [
        'Online', 'Offline', 'DND'
      ]
    }
  },
  computed: {
    redirectTo (): RouteLocationRaw {
      return { name: 'login' }
    },
  },
  watch: {
    darkMode: function(): void {
      Dark.toggle();
      this.$store.dispatch('preferenceStore/savePreference', {
        notificationsOn: this.notifications,
        darkMode: this.darkMode
      });
    },
    notifications: function(): void {
      this.$store.dispatch('preferenceStore/savePreference', {
        notificationsOn: this.notifications,
        darkMode: this.darkMode
      });
    },
  },
  methods: {
    logout(){
      this.$store.dispatch('auth/logout').then(() => this.$router.push(this.redirectTo))
    }
  }

});

</script>

<style>
.dialog {
  width: 400px;
  height: 420px;
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
