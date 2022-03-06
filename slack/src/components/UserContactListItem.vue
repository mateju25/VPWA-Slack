<template>
  <div>
    <q-item
      v-for="contact in contacts" 
      :key="contact.id" 
      class="q-my-sm" 
      clickable 
      v-ripple
    >
      <q-item-section avatar>
        <q-avatar 
          color="primary" 
          square
          text-color="white"
          size="36px"
        >
          {{ contact.nick_name[0] }}
          <q-badge
            class="absolute-bottom-right badge-state"
            :class="userState(contact.state)"
          />
        </q-avatar>
      </q-item-section>

      <q-item-section>
        <q-item-label>{{ contact.nick_name }}</q-item-label>
      </q-item-section>
      
    </q-item>
  </div>
</template>

<script lang="ts">

import { defineComponent } from 'vue'

export default defineComponent({
  // type inference enabled
  props: {
    contacts: Object,
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
  .badge-state {
    margin: 0 -4px -4px 0;
    padding: 0;
    width: 16px; 
    height: 16px;
    border: 2px solid white;
    border-radius: 10px; 
  }

</style>