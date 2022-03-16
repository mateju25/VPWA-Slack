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
        class="column"
      >
        <h6
          class="q-ma-none"
        >
          {{ selectedContact.nick_name }}
        </h6>
        <div
          v-if="isEditing"
          class="header"
        >
          <q-select          
            dense
            options-dense
            hide-bottom-space
            v-model="model"
            :options="options"
            label="Online"
            style="width:100px"
          />
          <q-btn
            icon="close"
            flat
            round
            dense
            clickable
            @click="changeEdit()"
          />
        </div>
        <p
          v-else
          class="q-mb-none"
        >
          Online 
          <q-icon
            v-if="isInHeader()"
            name="settings" 
            color="grey-8"
            style="cursor:pointer"
            @click="changeEdit()"
          />
        </p>
      </div>  
    </q-card-section>

    <q-card-section
      v-if="isInHeader()"
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
      v-if="isInHeader()"
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

import { defineComponent } from 'vue';
import Avatar from 'components/Avatar.vue';
import { ref } from 'vue'
import { Dark } from 'quasar'

export default defineComponent({
  components: { Avatar },
  props: {
    selectedContact: Object,
    inHeader: Boolean
  },
  setup () {
    return {
      model: ref(null),
      value: ref(true),
      options: [
        'Online', 'Offline', 'DND'
      ]
    }
  },
  data() {
    return {
      isEditing: false,
      darkMode: true,
    }
  },
  methods: {
    userState(state: string): string {
      let color = 'bg-negative';
      switch (state) {
        case 'Online':
          color = 'bg-positive';
          break;
        case 'Offline':
          color = 'bg-negative';
          break;
        case 'DND':
          color = 'bg-warning';
          break;
      }
      ;
      return color;
    },
    isInHeader(): boolean {
      return this.inHeader;
    },
    changeEdit():void{
      this.isEditing = !this.isEditing;
    },
    switchDarkMode(): void {
      Dark.toggle();
      console.log(this.darkMode);
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
