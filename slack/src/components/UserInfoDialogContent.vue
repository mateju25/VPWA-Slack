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
            v-model="stateModel.state"
            :options="options"
            label="State"
            style="width:100px"
          />
        </div>
        <div
          v-else
          class="q-mb-none"
        >
          {{stateModel.state}}
        </div>

      </div>
    </q-card-section>

    <q-card-section
      v-if="inHeader"
    >
      <q-toggle
        v-model="darkMode"
        color="primary"
        label="Dark mode"
        size="md"
        @click="switchDarkMode()"
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
import { Dark } from 'quasar'
import { User } from 'components/models';

export default defineComponent({
  components: { Avatar },
  props: {
    selectedContact: Object as PropType<User>,
    inHeader: Boolean
  },
  data() {
    return {
      options: [
        'Online', 'Offline', 'DND'
      ]
    }
  },
  computed: {
    stateModel: {
      get (): User  { return this.selectedContact as User },
      set (value: User) { this.$emit('update:selectedContact', value) },
    },
    darkMode: function() {
      return Dark.isActive;
    }
  },
  methods: {
    switchDarkMode(): void {
      Dark.toggle();
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

</style>
