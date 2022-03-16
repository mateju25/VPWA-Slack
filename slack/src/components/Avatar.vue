<template>
  <q-item-section avatar>
    <q-avatar
      :color="isInHeader() ? 'blue-grey-11' : 'primary'"
      square
      :text-color="isInHeader() ? 'primary' : 'white'"
      :size="size"
    >
      {{ contact.nick_name[0] }}
      <q-badge
        class="absolute-bottom-right badge-state"
        :class="userState(contact.state)"
      />
    </q-avatar>
  </q-item-section>
</template>

<script lang="ts">

import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    contact: Object,
    inHeader: Boolean,
    size: String
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
    }
  }

});

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
